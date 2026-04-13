import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3001/api';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => { if (user) loadCart(); }, [user]);

  const loadCart = async () => {
    try {
      const res = await fetch(`${API}/cart/${user.id}`);
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      Alert.alert('Error', 'Cannot load cart');
    }
  };

  const removeItem = async (cartId) => {
    await fetch(`${API}/cart/${cartId}`, { method: 'DELETE' });
    loadCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.msg}>Please login to view your cart</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>
      {cartItems.length === 0 ? (
        <View style={styles.center}><Text style={styles.msg}>Your cart is empty</Text></View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeTxt}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.totalBox}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.checkoutBtn}
              onPress={() => Alert.alert('Order Placed!', 'Thank you for your purchase.')}>
              <Text style={styles.checkoutTxt}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginTop: 40, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  msg: { fontSize: 16, color: '#666' },
  item: { backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#ff6600', marginTop: 4 },
  removeBtn: { backgroundColor: '#e00', padding: 8, borderRadius: 6 },
  removeTxt: { color: 'white', fontSize: 13 },
  totalBox: { backgroundColor: 'white', padding: 16, borderRadius: 10, elevation: 2 },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  checkoutBtn: { backgroundColor: '#ff6600', padding: 14, borderRadius: 8, alignItems: 'center' },
  checkoutTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
