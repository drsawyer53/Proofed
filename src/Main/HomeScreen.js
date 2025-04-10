import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Feed from './Feed';
import YourLists from './YourLists';
import AddDrink from './AddDrink';
import Suggested from './Suggested';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Feed':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Your Lists':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Add':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Suggested':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#b81c1c', // Wine red 🍷
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Your Lists" component={YourLists} />
      <Tab.Screen name="Add" component={AddDrink} />
      <Tab.Screen name="Suggested" component={Suggested} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
