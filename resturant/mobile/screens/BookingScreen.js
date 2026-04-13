import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3003/api';
const TIMES = ['12:00 PM', '1:00 PM', '2:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

export default function BookingScreen() {
  const { user } = useContext(UserContext);
  const [name, setName] = useState(user?.name || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useFocusEffect(React.useCallback(() => { if (user) loadBookings(); }, [user]));

  const loadBookings = async () => {
    const res = await fetch(`${API}/bookings/${user.id}`);
    const data = await res.json();
    setBookings(data);
  };

  const bookTable = async () => {
    if (!name || !date || !time || !guests) { Alert.alert('Error', 'All fields are required'); return; }
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, name, date, time, guests: parseInt(guests) }),
      });
      if (res.ok) {
        Alert.alert('Booking Confirmed! 🎉', `Table booked for ${guests} guests on ${date} at ${time}`);
        setShowForm(false);
        loadBookings();
      }
    } catch { Alert.alert('Error', 'Could not book table'); }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📅 Table Booking</Text>

      {!showForm ? (
        <TouchableOpacity style={styles.newBtn} onPress={() => setShowForm(true)}>
          <Text style={styles.newBtnTxt}>+ Book a Table</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Reserve a Table</Text>
          <TextInput style={styles.input} placeholder="Your Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Date (e.g. 2024-12-25)" value={date} onChangeText={setDate} />
          <Text style={styles.label}>Select Time:</Text>
          <View style={styles.timeRow}>
            {TIMES.map(t => (
              <TouchableOpacity key={t} onPress={() => setTime(t)}
                style={[styles.timeBtn, time === t && styles.timeActive]}>
                <Text style={[styles.timeTxt, time === t && styles.timeActiveTxt]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Number of Guests" value={guests}
            onChangeText={setGuests} keyboardType="numeric" />
          <TouchableOpacity style={styles.bookBtn} onPress={bookTable}>
            <Text style={styles.bookTxt}>Confirm Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>My Bookings</Text>
      {bookings.map(b => (
        <View key={b.id} style={styles.bookingCard}>
          <View style={styles.bookingTop}>
            <Text style={styles.bookingName}>{b.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: b.status === 'confirmed' ? '#2ecc71' : b.status === 'cancelled' ? '#e00' : '#ff9500' }]}>
              <Text style={styles.statusTxt}>{b.status}</Text>
            </View>
          </View>
          <Text style={styles.bookingInfo}>📅 {b.date} at {b.time}</Text>
          <Text style={styles.bookingInfo}>👥 {b.guests} guests</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#e74c3c' },
  newBtn: { backgroundColor: '#e74c3c', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  newBtnTxt: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  form: { backgroundColor: 'white', borderRadius: 10, padding: 16, marginBottom: 20, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#e74c3c' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  timeBtn: { padding: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#ddd' },
  timeActive: { backgroundColor: '#e74c3c' },
  timeTxt: { fontSize: 13, color: '#555' },
  timeActiveTxt: { color: 'white' },
  bookBtn: { backgroundColor: '#e74c3c', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  bookTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#ddd', padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelTxt: { color: '#555' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  bookingCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
  bookingTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bookingName: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTxt: { color: 'white', fontSize: 12 },
  bookingInfo: { fontSize: 13, color: '#666', marginBottom: 4 },
});
