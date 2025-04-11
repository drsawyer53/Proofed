import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../../firebase';
import { collection, query, where, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CompareDrink({ route, navigation }) {
  const { name, type, reaction } = route.params;
  const [loading, setLoading] = useState(true);
  const [similarDrinks, setSimilarDrinks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [betterCount, setBetterCount] = useState(0);
  const [newDrinkId, setNewDrinkId] = useState(null);

  const getRatingRange = (reaction) => {
    if (reaction === 'dislike') return [0, 4];
    if (reaction === 'fine') return [4, 7];
    return [7, 10];
  };

  useEffect(() => {
    const saveAndFetchDrinks = async () => {
      const [min, max] = getRatingRange(reaction);

      try {
        const user = auth.currentUser;

        // Step 1: Save new drink with placeholder rating
        const placeholderRating = reaction === 'dislike' ? 3 : reaction === 'fine' ? 5.5 : 8.5;
        const newDrinkRef = await addDoc(collection(db, 'drinks'), {
          name,
          type,
          rating: placeholderRating,
          userId: user.uid,
        });

        setNewDrinkId(newDrinkRef.id);
        console.log('✅ New drink saved:', newDrinkRef.id);

        // Step 2: Fetch similar drinks excluding the new one
        const drinksRef = collection(db, 'drinks');
        const q = query(
          drinksRef,
          where('userId', '==', user.uid),
          where('rating', '>=', min),
          where('rating', '<=', max)
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .filter((doc) => doc.id !== newDrinkRef.id)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        console.log('📦 Filtered comparison set:', results);
        setSimilarDrinks(results);
      } catch (err) {
        console.error('❌ Error saving/fetching drinks:', err);
      } finally {
        setLoading(false);
      }
    };

    saveAndFetchDrinks();
  }, []);

  const handleComparison = async (isBetter) => {
    if (isBetter) setBetterCount(betterCount + 1);
    const nextIndex = currentIndex + 1;
    if (nextIndex < similarDrinks.length) {
      setCurrentIndex(nextIndex);
    } else {
      const [min, max] = getRatingRange(reaction);
      const score = min + ((betterCount / similarDrinks.length) * (max - min));

      try {
        const drinkRef = doc(db, 'drinks', newDrinkId);
        await setDoc(drinkRef, {
          name,
          type,
          rating: parseFloat(score.toFixed(1)),
          userId: auth.currentUser.uid,
        });
        console.log('✅ Final rating saved:', score);
        navigation.navigate('Home');
      } catch (err) {
        console.error('❌ Error updating final rating:', err);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#b81c1c" />
        <Text style={{ marginTop: 12 }}>Loading drinks...</Text>
      </View>
    );
  }

  if (similarDrinks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No drinks to compare to. Skipping ranking.</Text>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.skipText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentDrink = similarDrinks[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compare your drink to:</Text>
      <Text style={styles.subtitle}>{currentDrink.name} ({currentDrink.rating}/10)</Text>
      <Text style={styles.info}>Did you like your drink more or less?</Text>

      <TouchableOpacity
        style={[styles.compareButton, { backgroundColor: '#4caf50' }]}
        onPress={() => handleComparison(true)}
      >
        <Text style={styles.buttonText}>Better</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.compareButton, { backgroundColor: '#f44336' }]}
        onPress={() => handleComparison(false)}
      >
        <Text style={styles.buttonText}>Worse</Text>
      </TouchableOpacity>

      <Text style={styles.progress}>Comparing {currentIndex + 1} of {similarDrinks.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#b81c1c', textAlign: 'center' },
  subtitle: { fontSize: 18, marginBottom: 8, textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  compareButton: {
    padding: 14,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  progress: { fontSize: 14, marginTop: 20 },
  skipButton: {
    marginTop: 40,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  skipText: { fontSize: 16 },
});