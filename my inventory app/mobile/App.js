import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import ItemsScreen from './screens/ItemsScreen';
import AddItemScreen from './screens/AddItemScreen';
import EditItemScreen from './screens/EditItemScreen';
import CategoriesScreen from './screens/CategoriesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ItemsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ItemsList" component={ItemsScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="EditItem" component={EditItemScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2e86de' }}>
        <Tab.Screen name="Inventory" component={ItemsStack}
          options={{ tabBarIcon: () => <Text>📦</Text> }} />
        <Tab.Screen name="Categories" component={CategoriesScreen}
          options={{ tabBarIcon: () => <Text>📂</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
