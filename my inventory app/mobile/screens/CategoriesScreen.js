import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const API = 'http://10.0.2.2:3002/api';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    const res = await fetch(`${API}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  const addCategory = async () => {
    if (!newCategory) { Alert.alert('Error', 'Enter a category name'); return; }
    await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory('');
    loadCategories();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📂 Categories</Text>
      <View style={styles.addRow}>
        <TextInput style={styles.input} placeholder="New category name"
          value={newCategory} onChangeText={setNewCategory} />
        <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
          <Text style={styles.addTxt}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.catName}>📁 {item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 20, textAlign: 'center' },
  addRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  input: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  addBtn: { backgroundColor: '#2e86de', padding: 12, borderRadius: 8, justifyContent: 'center' },
  addTxt: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 8, elevation: 1 },
  catName: { fontSize: 16 },
});
