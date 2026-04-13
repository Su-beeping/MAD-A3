import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../App';

const API = 'http://10.0.2.2:3001/api'; // use your PC's IP if on real device

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
      if (res.ok) {
        setUser(data.user);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Cannot connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 ShopEasy</Text>
      <Text style={styles.subtitle}>Login to your account</Text>
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
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 32 },
  input: { backgroundColor: 'white', padding: 14, borderRadius: 8, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#ff6600', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#ff6600', fontSize: 14 },
});
