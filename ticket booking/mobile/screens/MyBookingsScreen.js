import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3004/api';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);

  useFocusEffect(React.useCallback(() => { if (user) loadBookings(); }, [user]));

  const loadBookings = async () => {
    const res = await fetch(`${API}/bookings/${user.id}`);
    const data = await res.json();
    setBookings(data);
  };

  const cancelBooking = (id) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel?', [
      { text: 'No' },
      { text: 'Yes', style: 'destructive', onPress: async () => {
        await fetch(`${API}/bookings/${id}/cancel`, { method: 'PUT' });
        loadBookings();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 My Bookings</Text>
      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎟️</Text>
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, item.status === 'cancelled' && styles.cancelledCard]}>
              <View style={styles.cardTop}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <View style={[styles.badge,
                  { backgroundColor: item.status === 'confirmed' ? '#2ecc71' : '#e00' }]}>
                  <Text style={styles.badgeTxt}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.info}>📍 {item.location}</Text>
              <Text style={styles.info}>📅 {new Date(item.date).toDateString()} · {item.time}</Text>
              <View style={styles.ticketRow}>
                <View style={[styles.ticketBadge,
                  { backgroundColor: item.ticket_type === 'vip' ? '#fff8e1' : '#f0f0f0' }]}>
                  <Text style={[styles.ticketTxt,
                    { color: item.ticket_type === 'vip' ? '#f39c12' : '#555' }]}>
                    {item.ticket_type === 'vip' ? '⭐ VIP' : 'Standard'} × {item.quantity}
                  </Text>
                </View>
                <Text style={styles.total}>Total: ${parseFloat(item.total_price).toFixed(2)}</Text>
              </View>
              {item.status === 'confirmed' && (
                <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelBooking(item.id)}>
                  <Text style={styles.cancelTxt}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#8e44ad' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
  cancelledCard: { opacity: 0.6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeTxt: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  info: { fontSize: 13, color: '#666', marginBottom: 4 },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  ticketBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ticketTxt: { fontSize: 13, fontWeight: 'bold' },
  total: { fontSize: 15, fontWeight: 'bold', color: '#8e44ad' },
  cancelBtn: { backgroundColor: '#ffe5e5', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  cancelTxt: { color: '#e00', fontWeight: 'bold', fontSize: 13 },
});
