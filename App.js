import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './src/Landing'; 
import RegisterScreen from './src/Register'; 
import LoginScreen from './src/Login'; 
import { auth } from './firebase'; // Import firebase auth

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe; // Clean up on component unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        {user ? (
          // If the user is authenticated, show the Landing screen
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* If the user is not authenticated, show Register and Login screens */}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}






