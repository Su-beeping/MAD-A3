import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3001/api';

export default function AdminScreen() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const { user, setUser } = useContext(UserContext);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await fetch(`${API}/products`);
    const data = await res.json();
    setProducts(data);
  };

  const addProduct = async () => {
    if (!name || !price) { Alert.alert('Error', 'Name and price are required'); return; }
    await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc, price, stock, image_url: 'https://via.placeholder.com/200' }),
    });
    Alert.alert('Success', 'Product added!');
    setName(''); setDesc(''); setPrice(''); setStock('');
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    loadProducts();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Admin Panel</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add New Product</Text>
        <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={desc} onChangeText={setDesc} />
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
        <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
          <Text style={styles.addBtnTxt}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>All Products</Text>
      {products.map(item => (
        <View key={item.id.toString()} style={styles.item}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.delBtn} onPress={() => deleteProduct(item.id)}>
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
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 40, textAlign: 'center' },
  section: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  addBtn: { backgroundColor: '#333', padding: 14, borderRadius: 8, alignItems: 'center' },
  addBtnTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  item: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold' },
  itemPrice: { color: '#ff6600', marginTop: 2 },
  delBtn: { backgroundColor: '#e00', padding: 8, borderRadius: 6 },
  delTxt: { color: 'white' },
  logoutBtn: { backgroundColor: '#555', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logoutTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});
