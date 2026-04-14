import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';

const API = 'http://10.0.2.2:3004/api';
const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Entertainment'];

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => { loadEvents(); }, [search, category]);

  const loadEvents = async () => {
    try {
      let url = `${API}/events?search=${search}`;
      if (category !== 'All') url += `&category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
    } catch { Alert.alert('Error', 'Cannot load events'); }
  };

  const getCategoryEmoji = (cat) => {
    if (cat === 'Music') return '🎵';
    if (cat === 'Tech') return '💻';
    if (cat === 'Sports') return '⚽';
    if (cat === 'Entertainment') return '🎭';
    return '🎟️';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎟️ Events</Text>
      <TextInput style={styles.search} placeholder="🔍 Search events..."
        value={search} onChangeText={setSearch} />
      <View style={styles.catRow}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
            style={[styles.catBtn, category === cat && styles.catActive]}>
            <Text style={[styles.catTxt, category === cat && styles.catActiveTxt]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('BookTicket', { event: item })}>
            <View style={styles.cardTop}>
              <Text style={styles.emoji}>{getCategoryEmoji(item.category)}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Text style={styles.date}>📅 {new Date(item.date).toDateString()} · {item.time}</Text>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Standard</Text>
                <Text style={styles.price}>${parseFloat(item.standard_price).toFixed(2)}</Text>
              </View>
              <View style={[styles.priceBox, styles.vipBox]}>
                <Text style={styles.vipLabel}>VIP</Text>
                <Text style={styles.vipPrice}>${parseFloat(item.vip_price).toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn}
                onPress={() => navigation.navigate('BookTicket', { event: item })}>
                <Text style={styles.bookTxt}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No events found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f0ff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 40, marginBottom: 12, textAlign: 'center', color: '#8e44ad' },
  search: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  catBtn: { padding: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#ddd' },
  catActive: { backgroundColor: '#8e44ad' },
  catTxt: { fontSize: 12, color: '#555' },
  catActiveTxt: { color: 'white' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 3 },
  cardTop: { flexDirection: 'row', marginBottom: 12 },
  emoji: { fontSize: 40, marginRight: 12 },
  cardInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  location: { fontSize: 13, color: '#666', marginBottom: 2 },
  date: { fontSize: 13, color: '#666' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  priceBox: { alignItems: 'center' },
  priceLabel: { fontSize: 11, color: '#999' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  vipBox: { alignItems: 'center' },
  vipLabel: { fontSize: 11, color: '#f39c12' },
  vipPrice: { fontSize: 15, fontWeight: 'bold', color: '#f39c12' },
  bookBtn: { backgroundColor: '#8e44ad', padding: 10, paddingHorizontal: 20, borderRadius: 8 },
  bookTxt: { color: 'white', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});
