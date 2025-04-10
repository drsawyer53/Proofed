import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './src/Landing'; 
import RegisterScreen from './src/Register'; 
import LoginScreen from './src/Login'; // Add the Login screen import
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen} // Register screen already added
          options={{ headerShown: true, title: 'Register' }} // Customize header
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen} // Add Login screen here
          options={{ headerShown: true, title: 'Login' }} // Customize header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





