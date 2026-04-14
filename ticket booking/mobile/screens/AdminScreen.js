import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3004/api';

export default function AdminScreen() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [vipPrice, setVipPrice] = useState('');
  const [standardSeats, setStandardSeats] = useState('');
  const [vipSeats, setVipSeats] = useState('');
  const { setUser } = useContext(UserContext);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    const res = await fetch(`${API}/events`);
    const data = await res.json();
    setEvents(data);
  };

  const addEvent = async () => {
    if (!title || !date || !standardPrice) { Alert.alert('Error', 'Title, date and price required'); return; }
    await fetch(`${API}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location, date, time, category,
        standard_price: standardPrice, vip_price: vipPrice,
        standard_seats: standardSeats, vip_seats: vipSeats }),
    });
    Alert.alert('Success', 'Event added!');
    setTitle(''); setDescription(''); setLocation(''); setDate('');
    setTime(''); setCategory(''); setStandardPrice(''); setVipPrice('');
    setStandardSeats(''); setVipSeats('');
    loadEvents();
  };

  const deleteEvent = (id) => {
    Alert.alert('Delete Event', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await fetch(`${API}/events/${id}`, { method: 'DELETE' });
        loadEvents();
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Admin Panel</Text>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Event</Text>
        <TextInput style={styles.input} placeholder="Event Title *" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
        <TextInput style={styles.input} placeholder="Date (e.g. 2024-12-25) *" value={date} onChangeText={setDate} />
        <TextInput style={styles.input} placeholder="Time (e.g. 6:00 PM)" value={time} onChangeText={setTime} />
        <TextInput style={styles.input} placeholder="Category (Music/Tech/Sports)" value={category} onChangeText={setCategory} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Standard Price *" value={standardPrice} onChangeText={setStandardPrice} keyboardType="numeric" />
          <TextInput style={[styles.input, styles.half]} placeholder="VIP Price" value={vipPrice} onChangeText={setVipPrice} keyboardType="numeric" />
        </View>
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Standard Seats" value={standardSeats} onChangeText={setStandardSeats} keyboardType="numeric" />
          <TextInput style={[styles.input, styles.half]} placeholder="VIP Seats" value={vipSeats} onChangeText={setVipSeats} keyboardType="numeric" />
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={addEvent}>
          <Text style={styles.addTxt}>Add Event</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>All Events</Text>
      {events.map(event => (
        <View key={event.id} style={styles.card}>
          <View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventInfo}>{new Date(event.date).toDateString()} · {event.category}</Text>
          </View>
          <TouchableOpacity style={styles.delBtn} onPress={() => deleteEvent(event.id)}>
            <Text style={styles.delTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={() => setUser(null)}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 16, textAlign: 'center', color: '#8e44ad' },
  form: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#8e44ad' },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  addBtn: { backgroundColor: '#8e44ad', padding: 14, borderRadius: 8, alignItems: 'center' },
  addTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  eventTitle: { fontSize: 15, fontWeight: 'bold' },
  eventInfo: { fontSize: 12, color: '#666', marginTop: 2 },
  delBtn: { backgroundColor: '#e00', padding: 8, paddingHorizontal: 14, borderRadius: 6 },
  delTxt: { color: 'white' },
  logoutBtn: { backgroundColor: '#555', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  logoutTxt: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});
