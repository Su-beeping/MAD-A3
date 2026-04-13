import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3003/api';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext);

  useFocusEffect(React.useCallback(() => { if (user) loadOrders(); }, [user]));

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/orders/${user.id}`);
      const data = await res.json();
      setOrders(data);
    } catch { Alert.alert('Error', 'Cannot load orders'); }
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return '#ff9500';
    if (status === 'preparing') return '#2e86de';
    if (status === 'ready') return '#2ecc71';
    if (status === 'delivered') return '#999';
    return '#666';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 My Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusTxt}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.items}>{item.items}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.total}>Total: ${parseFloat(item.total).toFixed(2)}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#e74c3c' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusTxt: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  items: { fontSize: 13, color: '#666', marginBottom: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  total: { fontSize: 15, fontWeight: 'bold', color: '#e74c3c' },
  date: { fontSize: 12, color: '#999' },
});
