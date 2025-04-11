import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
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

const getRatingColor = (rating) => {
  if (rating >= 7) return '#4CAF50';
  if (rating >= 4) return '#FFC107';
  return '#F44336';
};

const AnimatedDrinkCard = ({ item, friendName }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardText}>
          <Text style={styles.bold}>{friendName}</Text> ranked{' '}
          <Text style={[styles.drinkName, { color: getRatingColor(item.rating) }]}>{item.name}</Text>
        </Text>
        <Text style={styles.typeText}>{item.type}</Text>
      </View>
      <View style={[styles.ratingCircle, { borderColor: getRatingColor(item.rating) }]}>
        <Text style={[styles.ratingText, { color: getRatingColor(item.rating) }]}> {item.rating.toFixed(1)} </Text>
      </View>
    </Animated.View>
  );
};

export default function Feed() {
  const [drinks, setDrinks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [friendNames, setFriendNames] = useState({});

  const user = auth.currentUser;

  useEffect(() => {
    const fetchFriendsAndDrinks = async () => {
      try {
        const friendQuery = query(collection(db, 'friends'), where('userId', '==', user.uid));
        const friendSnap = await getDocs(friendQuery);
        const friendIds = friendSnap.docs.map((doc) => doc.data().friendId);
        setFriends(friendIds);

        const addedYouQuery = query(collection(db, 'friends'), where('friendId', '==', user.uid));
        const addedYouSnap = await getDocs(addedYouQuery);
        const suggested = [];

        for (let docSnap of addedYouSnap.docs) {
          const theirId = docSnap.data().userId;
          if (!friendIds.includes(theirId)) {
            const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', theirId)));
            if (!userDoc.empty) {
              suggested.push({ id: theirId, ...userDoc.docs[0].data() });
            }
          }
        }
        setSuggestedFriends(suggested);

        if (friendIds.length > 0) {
          const drinksSnap = await getDocs(
            query(collection(db, 'drinks'), where('userId', 'in', friendIds), orderBy('rating', 'desc'))
          );
          const drinkResults = drinksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setDrinks(drinkResults);

          const userSnap = await getDocs(query(collection(db, 'users')));
          const userMap = {};
          userSnap.docs.forEach((doc) => {
            userMap[doc.id] = doc.data().name;
          });
          setFriendNames(userMap);
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
        query(collection(db, 'users'), where('name', '>=', text), where('name', '<=', text + '\uf8ff'))
      );

      const results = usersSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((userResult) => userResult.id !== user.uid && !friends.includes(userResult.id));

      setSearchResults(results);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addDoc(collection(db, 'friends'), { userId: user.uid, friendId });
      setFriends([...friends, friendId]);
      setSearchResults(searchResults.filter((user) => user.id !== friendId));
      setSuggestedFriends(suggestedFriends.filter((user) => user.id !== friendId));
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  const renderDrink = ({ item }) => (
    <AnimatedDrinkCard item={item} friendName={friendNames[item.userId] || 'User'} />
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

      {suggestedFriends.length > 0 && (
        <View style={styles.suggestionsBox}>
          <Text style={styles.sectionTitle}>People who added you:</Text>
          {suggestedFriends.map((user) => (
            <View key={user.id} style={styles.searchItem}>
              <Text style={styles.searchName}>{user.name}</Text>
              <TouchableOpacity onPress={() => handleAddFriend(user.id)}>
                <Text style={styles.addButton}>Add Back</Text>
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
    flexDirection: 'row',
    backgroundColor: '#fffdfd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  cardLeft: { flexShrink: 1 },
  bold: { fontWeight: '600' },
  drinkName: { fontWeight: '600' },
  cardText: { fontSize: 16 },
  typeText: { fontSize: 14, color: '#666', marginTop: 4 },
  ratingCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
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
  suggestionsBox: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderColor: '#bbb',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b81c1c',
    marginBottom: 8,
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