import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3004/api';

export default function BookingScreen({ route, navigation }) {
  const { event } = route.params;
  const { user } = useContext(UserContext);
  const [ticketType, setTicketType] = useState('standard');
  const [quantity, setQuantity] = useState(1);

  const price = ticketType === 'vip' ? event.vip_price : event.standard_price;
  const total = price * quantity;

  const confirmBooking = async () => {
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event.id,
          ticket_type: ticketType,
          quantity,
          total_price: total,
        }),
      });
      if (res.ok) {
        Alert.alert('Booking Confirmed! 🎉',
          `${quantity} ${ticketType.toUpperCase()} ticket(s) for ${event.title}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch { Alert.alert('Error', 'Could not complete booking'); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🎟️ Book Tickets</Text>

      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventInfo}>📍 {event.location}</Text>
        <Text style={styles.eventInfo}>📅 {new Date(event.date).toDateString()} · {event.time}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Ticket Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity style={[styles.typeBtn, ticketType === 'standard' && styles.typeActive]}
          onPress={() => setTicketType('standard')}>
          <Text style={styles.typeLabel}>Standard</Text>
          <Text style={styles.typePrice}>${parseFloat(event.standard_price).toFixed(2)}</Text>
          <Text style={styles.typeSeats}>{event.standard_seats} seats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.typeBtn, styles.vipBtn, ticketType === 'vip' && styles.vipActive]}
          onPress={() => setTicketType('vip')}>
          <Text style={styles.vipLabel}>⭐ VIP</Text>
          <Text style={styles.vipPrice}>${parseFloat(event.vip_price).toFixed(2)}</Text>
          <Text style={styles.typeSeats}>{event.vip_seats} seats</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quantity</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.qtyTxt}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.min(10, quantity + 1))}>
          <Text style={styles.qtyTxt}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={confirmBooking}>
        <Text style={styles.confirmTxt}>Confirm Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelTxt}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#8e44ad' },
  eventCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  eventTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#8e44ad' },
  eventInfo: { fontSize: 14, color: '#666', marginBottom: 4 },
  eventDesc: { fontSize: 13, color: '#999', marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeBtn: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: '#ddd', elevation: 1 },
  typeActive: { borderColor: '#8e44ad', backgroundColor: '#f5f0ff' },
  vipBtn: { borderColor: '#f39c12' },
  vipActive: { backgroundColor: '#fff8e1', borderColor: '#f39c12' },
  typeLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  typePrice: { fontSize: 18, fontWeight: 'bold', color: '#8e44ad' },
  vipLabel: { fontSize: 14, fontWeight: 'bold', color: '#f39c12', marginBottom: 4 },
  vipPrice: { fontSize: 18, fontWeight: 'bold', color: '#f39c12' },
  typeSeats: { fontSize: 11, color: '#999', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 20 },
  qtyBtn: { backgroundColor: '#8e44ad', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  qtyTxt: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  qty: { fontSize: 24, fontWeight: 'bold', minWidth: 40, textAlign: 'center' },
  totalBox: { backgroundColor: 'white', borderRadius: 10, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, elevation: 2 },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#8e44ad' },
  confirmBtn: { backgroundColor: '#8e44ad', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  confirmTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#ddd', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  cancelTxt: { color: '#555', fontSize: 15 },
});
