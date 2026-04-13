import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3003/api';

export default function AdminScreen() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const { setUser } = useContext(UserContext);

  useEffect(() => { loadMenu(); }, []);

  const loadMenu = async () => {
    const res = await fetch(`${API}/menu`);
    const data = await res.json();
    setMenu(data);
  };

  const addItem = async () => {
    if (!name || !price) { Alert.alert('Error', 'Name and price required'); return; }
    await fetch(`${API}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, category }),
    });
    Alert.alert('Success', 'Menu item added!');
    setName(''); setDescription(''); setPrice(''); setCategory('');
    loadMenu();
  };

  const deleteItem = async (id) => {
    Alert.alert('Delete', 'Remove this item from menu?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await fetch(`${API}/menu/${id}`, { method: 'DELETE' });
        loadMenu();
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Admin Panel</Text>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add Menu Item</Text>
        <TextInput style={styles.input} placeholder="Item Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Category (e.g. Pizza)" value={category} onChangeText={setCategory} />
        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Text style={styles.addTxt}>Add to Menu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>All Menu Items</Text>
      {menu.map(item => (
        <View key={item.id} style={styles.card}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)} · {item.category}</Text>
          </View>
          <TouchableOpacity style={styles.delBtn} onPress={() => deleteItem(item.id)}>
            <Text style={styles.delTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#e74c3c' },
  form: { backgroundColor: 'white', borderRadius: 10, padding: 16, marginBottom: 20, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#e74c3c' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  addBtn: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 8, alignItems: 'center' },
  addTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold' },
  itemPrice: { color: '#666', fontSize: 13, marginTop: 2 },
  delBtn: { backgroundColor: '#e00', padding: 8, paddingHorizontal: 14, borderRadius: 6 },
  delTxt: { color: 'white' },
  logoutBtn: { backgroundColor: '#555', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  logoutTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});
