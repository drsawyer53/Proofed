import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { auth } from './firebase'; // Assuming firebase.js is in the same folder

export default function Landing({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe; // Clean up on component unmount
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <Text>Welcome, {user.displayName || 'User'}!</Text>
      ) : (
        <>
          <Button title="Register" onPress={() => navigation.navigate('Register')} />
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
        </>
      )}
    </View>
  );
}


