import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // update this path as needed

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: name,
      });
  
      Alert.alert('Success!', 'Account created successfully!');
  
      // 👇 Go directly to Home — bypass Landing entirely
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
  
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
