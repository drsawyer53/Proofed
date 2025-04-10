import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './src/Landing';
import RegisterScreen from './src/Register';
import LoginScreen from './src/Login';
import HomeScreen from './src/Main/HomeScreen'; // Import the HomeScreen
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebase'; // Firebase import

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase listener to track user authentication status
    const unsubscribe = auth.onAuthStateChanged(setUser);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Landing'}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true, title: 'Register' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true, title: 'Login' }}
        />
        {/* Conditionally render HomeScreen if user is logged in */}
        {user && (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}







