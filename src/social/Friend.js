import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function Feed() {
  const [drinks, setDrinks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchFriendsAndDrinks = async () => {
      try {
        const friendsSnap = await getDocs(
          query(collection(db, 'friends'), where('userId', '==', user.uid))
        );
        const friendIds = friendsSnap.docs.map(doc => doc.data().friendId);
        setFriends(friendIds);

        if (friendIds.length > 0) {
          const drinksSnap = await getDocs(
            query(
              collection(db, 'drinks'),
              where('userId', 'in', friendIds),
              orderBy('rating', 'desc')
            )
          );
          const drinkResults = drinksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDrinks(drinkResults);
        } else {
          setDrinks([]);
        }
      } catch (err) {
        console.error('Error fetching feed data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndDrinks();
  }, []);

  const handleSearch = async (text) => {
    setSearch(text);
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const usersSnap = await getDocs(
        query(
          collection(db, 'users'),
          where('name', '>=', text),
          where('name', '<=', text + '\uf8ff')
        )
      );

      const results = usersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(userResult => userResult.id !== user.uid && !friends.includes(userResult.id));

      setSearchResults(results);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addDoc(collection(db, 'friends'), {
        userId: user.uid,
        friendId,
      });
      setFriends([...friends, friendId]);
      setSearchResults(searchResults.filter(user => user.id !== friendId));
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  const renderDrink = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name} ({item.rating}/10)</Text>
      <Text style={styles.type}>{item.type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Feed</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for friends by name"
        value={search}
        onChangeText={handleSearch}
      />

      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          {searchResults.map((user) => (
            <View key={user.id} style={styles.searchItem}>
              <Text style={styles.searchName}>{user.name}</Text>
              <TouchableOpacity onPress={() => handleAddFriend(user.id)}>
                <Text style={styles.addButton}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" color="#b81c1c" />
      ) : drinks.length === 0 ? (
        <Text style={styles.empty}>No friend activity yet. Add friends to see what they’re drinking!</Text>
      ) : (
        <FlatList
          data={drinks}
          keyExtractor={(item) => item.id}
          renderItem={renderDrink}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff6f6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#b81c1c', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  name: { fontSize: 18, fontWeight: '600' },
  type: { fontSize: 14, color: '#555', marginTop: 4 },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchResults: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  searchName: { fontSize: 16 },
  addButton: { color: '#b81c1c', fontWeight: '600' },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#444',
  },
});

