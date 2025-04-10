import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase';

export default function Landing({ navigation }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Proofed 🍷</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
