import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import AuthModals from '@components/AuthModals';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function AuthButtons() {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  // Si el usuario ya está loggeado, no mostrar los botones
  if (FIREBASE_AUTH.currentUser) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={() => setModalType('login')}>
        <Ionicons name="log-in-outline" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>
      <Pressable style={[styles.button, { backgroundColor: '#723FEB' }]} onPress={() => setModalType('signup')}>
        <Ionicons name="person-add-outline" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: '#4285F4' }]}
        onPress={() => Alert.alert('Próximamente', 'La autenticación con Google estará disponible en el futuro.')}
      >
        <AntDesign name="google" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Google</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: '#2F2F7A' }]}
        onPress={() => Alert.alert('Próximamente', 'La autenticación con Microsoft estará disponible en el futuro.')}
      >
        <Ionicons name="logo-windows" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Microsoft</Text>
      </Pressable>
      <AuthModals
        visible={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType === 'signup' ? 'signup' : 'login'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 30,
    marginTop: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginBottom: 0,
    width: 300,
    justifyContent: 'center',
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});