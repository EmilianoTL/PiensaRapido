import React from 'react';
import { Pressable, Text, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Solo muestra el botón si hay usuario loggeado
  if (!FIREBASE_AUTH.currentUser) return null;

  return (
    <Pressable style={styles.button} onPress={handleSignOut}>
      <Text style={styles.buttonText}>Cerrar sesión</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E53935',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});