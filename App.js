import React from 'react';
import { Text, View } from 'react-native';
import Home from './src/Home'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import EventPage from './src/EventPage';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ // Use modal style
        headerShown: false, // Hide header for seamless transitions
        animationEnabled: false, }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="EventPage" component={EventPage} />
      </Stack.Navigator>
      </NavigationContainer>
  );
} 