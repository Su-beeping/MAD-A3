import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import EventsScreen from './screens/EventsScreen';
import BookingScreen from './screens/BookingScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import AdminScreen from './screens/AdminScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserContext = React.createContext(null);

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#8e44ad' }}>
      <Tab.Screen name="Events" component={EventsStack}
        options={{ tabBarIcon: () => <Text>🎟️</Text> }} />
      <Tab.Screen name="My Bookings" component={MyBookingsScreen}
        options={{ tabBarIcon: () => <Text>📋</Text> }} />
      <Tab.Screen name="Admin" component={AdminScreen}
        options={{ tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tab.Navigator>
  );
}

const EventStack = createStackNavigator();
function EventsStack() {
  return (
    <EventStack.Navigator screenOptions={{ headerShown: false }}>
      <EventStack.Screen name="EventsList" component={EventsScreen} />
      <EventStack.Screen name="BookTicket" component={BookingScreen} />
    </EventStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainTabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
