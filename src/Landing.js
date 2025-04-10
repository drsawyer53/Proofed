import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const images = [
  { uri: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2luZXN8ZW58MHx8MHx8fDA%3D'},
  { uri: 'https://plus.unsplash.com/premium_photo-1679397829259-5cd327e1e467?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29ja3RhaWxzfGVufDB8fDB8fHww' },
  { uri: 'https://images.unsplash.com/photo-1603596311111-b43c809e02a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdoaXNrZXl8ZW58MHx8MHx8fDA%3D' },
  { uri: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVlcnxlbnwwfHwwfHx8MA%3D%3D' },
  { uri: 'https://images.unsplash.com/photo-1582819509237-d5b75f20ff7a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGlxdW9yfGVufDB8fDB8fHww' },
];

export default function Landing({ navigation }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500); // Rotate every 3.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={images[index]}
      style={styles.background}
      blurRadius={1.5}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Proofed 🍷</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#b81c1c' }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
