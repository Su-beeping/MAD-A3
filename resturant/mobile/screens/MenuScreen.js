import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CartContext } from '../App';

const API = 'http://10.0.2.2:3003/api';
const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Salads', 'Pasta', 'Desserts', 'Drinks'];

export default function MenuScreen() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState('All');
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => { loadMenu(); }, [category]);

  const loadMenu = async () => {
    try {
      const url = category === 'All' ? `${API}/menu` : `${API}/menu?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setMenu(data);
    } catch { Alert.alert('Error', 'Cannot load menu'); }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    Alert.alert('Added!', `${item.name} added to cart`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍽️ Our Menu</Text>
      <View style={styles.catRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
            style={[styles.catBtn, category === cat && styles.catActive]}>
            <Text style={[styles.catTxt, category === cat && styles.catActiveTxt]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={menu}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
                <Text style={styles.addTxt}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 12, textAlign: 'center', color: '#e74c3c' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  catBtn: { padding: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#ddd' },
  catActive: { backgroundColor: '#e74c3c' },
  catTxt: { fontSize: 12, color: '#555' },
  catActiveTxt: { color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  cardLeft: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDesc: { fontSize: 13, color: '#666', marginVertical: 4 },
  itemCategory: { fontSize: 11, color: '#e74c3c', backgroundColor: '#ffe5e5', padding: 3, paddingHorizontal: 8, borderRadius: 10, alignSelf: 'flex-start' },
  cardRight: { alignItems: 'center', justifyContent: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c', marginBottom: 8 },
  addBtn: { backgroundColor: '#e74c3c', padding: 8, paddingHorizontal: 14, borderRadius: 8 },
  addTxt: { color: 'white', fontWeight: 'bold' },
});
