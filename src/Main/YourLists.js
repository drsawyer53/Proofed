import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const drinkTypes = ['All', 'Wine', 'Beer', 'Cocktail', 'Whiskey', 'Vodka', 'Tequila'];

export default function YourLists() {
  const [drinks, setDrinks] = useState([]);
  const [filteredType, setFilteredType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const user = auth.currentUser;
        const q = query(
          collection(db, 'drinks'),
          where('userId', '==', user.uid),
          orderBy('rating', 'desc')
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDrinks(results);
      } catch (err) {
        console.error('Error fetching drinks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const filteredDrinks = filteredType === 'All'
    ? drinks
    : drinks.filter((drink) => drink.type === filteredType);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type} — {item.rating}/10</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ranked Drinks</Text>

      <View style={styles.filterRow}>
        {drinkTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filteredType === type && styles.activeFilter]}
            onPress={() => setFilteredType(type)}
          >
            <Text style={[styles.filterText, filteredType === type && styles.activeText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Text style={{ marginTop: 24 }}>Loading your list...</Text>
      ) : (
        <FlatList
          data={filteredDrinks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff6f6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#b81c1c', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rank: { fontSize: 16, fontWeight: 'bold', color: '#b81c1c' },
  name: { fontSize: 18, fontWeight: '500', marginTop: 4 },
  type: { fontSize: 14, color: '#555', marginTop: 2 },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  activeFilter: { backgroundColor: '#b81c1c' },
  filterText: { fontSize: 14, color: '#000' },
  activeText: { color: '#fff' },
});
