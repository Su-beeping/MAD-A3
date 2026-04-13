import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext, CartContext } from '../App';

const API = 'http://10.0.2.2:3003/api';

export default function CartScreen() {
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

  const changeQty = (id, delta) => {
    setCart(cart.map(item => item.id === id
      ? { ...item, quantity: Math.max(1, item.quantity + delta) }
      : item));
  };

  const placeOrder = async () => {
    if (!user) { Alert.alert('Error', 'Please login first'); return; }
    if (cart.length === 0) { Alert.alert('Error', 'Cart is empty'); return; }
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, items: cart, total }),
      });
      if (res.ok) {
        Alert.alert('Order Placed! 🎉', 'Your order is being prepared.');
        setCart([]);
      }
    } catch { Alert.alert('Error', 'Could not place order'); }
  };

  if (cart.length === 0) return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyText}>Your cart is empty</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                <Text style={styles.qtyTxt}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                <Text style={styles.qtyTxt}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                <Text style={styles.removeTxt}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
          <Text style={styles.orderTxt}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#e74c3c' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff5f5' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  info: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { backgroundColor: '#e74c3c', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  qtyTxt: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  qty: { fontSize: 16, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: 'auto', backgroundColor: '#ddd', padding: 6, paddingHorizontal: 12, borderRadius: 6 },
  removeTxt: { fontSize: 13, color: '#555' },
  footer: { backgroundColor: 'white', padding: 16, borderRadius: 10, elevation: 2 },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  orderBtn: { backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, alignItems: 'center' },
  orderTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
