import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

const API = 'http://10.0.2.2:3002/api';

export default function AddItemScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const res = await fetch(`${API}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const addItem = async () => {
    if (!name || !quantity) { Alert.alert('Error', 'Name and quantity are required'); return; }
    try {
      const res = await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, quantity: parseInt(quantity), price: parseFloat(price) || 0, category_id: categoryId || null }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Item added!');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot connect to server');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>➕ Add New Item</Text>
      <TextInput style={styles.input} placeholder="Item Name *" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Quantity *" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.categoryRow}>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} onPress={() => setCategoryId(cat.id.toString())}
            style={[styles.catBtn, categoryId === cat.id.toString() && styles.catActive]}>
            <Text style={styles.catTxt}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={addItem}>
        <Text style={styles.saveTxt}>Save Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelTxt}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 14, borderRadius: 8, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  catBtn: { padding: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#ddd' },
  catActive: { backgroundColor: '#2e86de' },
  catTxt: { color: 'white', fontSize: 13 },
  saveBtn: { backgroundColor: '#2e86de', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  saveTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#999', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  cancelTxt: { color: 'white', fontSize: 16 },
});
