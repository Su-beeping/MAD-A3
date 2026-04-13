import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import BookingScreen from './screens/BookingScreen';
import AdminScreen from './screens/AdminScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const UserContext = React.createContext(null);
export const CartContext = React.createContext(null);

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#e74c3c' }}>
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarIcon: () => <Text>🍽️</Text> }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: () => <Text>🛒</Text> }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarIcon: () => <Text>📋</Text> }} />
      <Tab.Screen name="Booking" component={BookingScreen} options={{ tabBarIcon: () => <Text>📅</Text> }} />
      <Tab.Screen name="Admin" component={AdminScreen} options={{ tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, setCart }}>
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
      </CartContext.Provider>
    </UserContext.Provider>
  );
}
