import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3003/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);

  const login = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) { setUser(data.user); }
      else { Alert.alert('Error', data.error); }
    } catch { Alert.alert('Error', 'Cannot connect to server'); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍽️</Text>
      <Text style={styles.title}>Restaurant App</Text>
      <Text style={styles.subtitle}>Login to order food</Text>
      <TextInput style={styles.input} placeholder="Email" value={email}
        onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password}
        onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.btn} onPress={login}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff5f5' },
  logo: { fontSize: 60, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#e74c3c' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 32 },
  input: { backgroundColor: 'white', padding: 14, borderRadius: 8, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#e74c3c', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#e74c3c', fontSize: 14 },
});
