import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function Suggested() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const myDrinksSnap = await getDocs(query(collection(db, 'drinks'), where('userId', '==', user.uid)));
        const myDrinks = myDrinksSnap.docs.map(doc => doc.data());

        // Count types and find the favorite type
        const typeScores = {};
        myDrinks.forEach(drink => {
          if (!typeScores[drink.type]) typeScores[drink.type] = 0;
          typeScores[drink.type] += drink.rating;
        });

        const favoriteType = Object.entries(typeScores).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (!favoriteType) return;

        const myDrinkNames = myDrinks.map(drink => drink.name);

        const allDrinksSnap = await getDocs(query(collection(db, 'drinks'), where('type', '==', favoriteType)));
        const allDrinks = allDrinksSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(drink => drink.userId !== user.uid && drink.rating >= 7 && !myDrinkNames.includes(drink.name));

        // Remove duplicates by drink name
        const seen = new Set();
        const unique = allDrinks.filter(d => {
          if (seen.has(d.name)) return false;
          seen.add(d.name);
          return true;
        });

        setSuggestions(unique);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Drinks 🍸</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#b81c1c" style={{ marginTop: 24 }} />
      ) : suggestions.length === 0 ? (
        <Text style={styles.empty}>No suggestions yet. Try logging more drinks!</Text>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.type} · {item.rating.toFixed(1)}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff6f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b81c1c',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});
