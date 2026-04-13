import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3001/api';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      Alert.alert('Error', 'Cannot load products');
    }
  };

  const addToCart = async (productId) => {
    if (!user) { Alert.alert('Error', 'Please login first'); return; }
    try {
      await fetch(`${API}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: productId, quantity: 1 }),
      });
      Alert.alert('Success', 'Added to cart!');
    } catch (err) {
      Alert.alert('Error', 'Could not add to cart');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛍️ Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
              style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
            <Text style={styles.stock}>Stock: {item.stock}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => addToCart(item.id)}>
              <Text style={styles.btnText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 40, textAlign: 'center' },
  card: { flex: 1, backgroundColor: 'white', margin: 6, borderRadius: 10, padding: 10, alignItems: 'center', elevation: 2 },
  image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  desc: { fontSize: 12, color: '#666', textAlign: 'center', marginVertical: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#ff6600' },
  stock: { fontSize: 12, color: '#999', marginBottom: 8 },
  btn: { backgroundColor: '#333', padding: 8, borderRadius: 6, width: '100%', alignItems: 'center' },
  btnText: { color: 'white', fontSize: 13 },
});
