import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API = 'http://10.0.2.2:3002/api';

export default function ItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useFocusEffect(useCallback(() => { loadItems(); loadCategories(); }, [search, selectedCategory]));

  const loadItems = async () => {
    try {
      let url = `${API}/items?search=${search}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      Alert.alert('Error', 'Cannot connect to server');
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {}
  };

  const deleteItem = async (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await fetch(`${API}/items/${id}`, { method: 'DELETE' });
        loadItems();
      }}
    ]);
  };

  const getStockColor = (qty) => {
    if (qty <= 0) return '#e00';
    if (qty <= 10) return '#ff9500';
    return '#2ecc71';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Inventory</Text>

      <TextInput style={styles.search} placeholder="🔍 Search items..."
        value={search} onChangeText={setSearch} />

      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterBtn, !selectedCategory && styles.filterActive]}
          onPress={() => setSelectedCategory('')}>
          <Text style={styles.filterTxt}>All</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id.toString())}
            style={[styles.filterBtn, selectedCategory === cat.id.toString() && styles.filterActive]}>
            <Text style={styles.filterTxt}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={[styles.stockBadge, { backgroundColor: getStockColor(item.quantity) }]}>
                <Text style={styles.stockTxt}>Stock: {item.quantity}</Text>
              </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
              <Text style={styles.category}>{item.category_name || 'No category'}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn}
                  onPress={() => navigation.navigate('EditItem', { item })}>
                  <Text style={styles.editTxt}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delBtn} onPress={() => deleteItem(item.id)}>
                  <Text style={styles.delTxt}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddItem')}>
        <Text style={styles.addTxt}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center' },
  search: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, gap: 6 },
  filterBtn: { padding: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#ddd' },
  filterActive: { backgroundColor: '#2e86de' },
  filterTxt: { fontSize: 12, color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  itemName: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stockTxt: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  desc: { color: '#666', fontSize: 13, marginBottom: 8 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#2e86de' },
  category: { fontSize: 12, color: '#999', backgroundColor: '#f0f0f0', padding: 4, borderRadius: 6 },
  actions: { flexDirection: 'row', gap: 6 },
  editBtn: { backgroundColor: '#2e86de', padding: 6, paddingHorizontal: 12, borderRadius: 6 },
  editTxt: { color: 'white', fontSize: 13 },
  delBtn: { backgroundColor: '#e00', padding: 6, paddingHorizontal: 12, borderRadius: 6 },
  delTxt: { color: 'white', fontSize: 13 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
  addBtn: { backgroundColor: '#2e86de', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  addTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
