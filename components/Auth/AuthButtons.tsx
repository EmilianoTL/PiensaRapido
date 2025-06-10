import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AlertMessage from '../AlertMessage';

export default function AuthButtons({ setAlertMsg }: { setAlertMsg?: (msg: string) => void }) {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [internalAlertMsg, setInternalAlertMsg] = useState('');

  // Si el usuario ya está loggeado, no mostrar los botones
  if (FIREBASE_AUTH.currentUser) return null;

  // Renderizar solo los botones y modals aquí
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
        onPress={() => setInternalAlertMsg('Próximamente. La autenticación con Google estará disponible en el futuro.')}
      >
        <AntDesign name="google" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Google</Text>
      </Pressable>
      <Pressable
        style={[styles.button, { backgroundColor: '#2F2F7A' }]}
        onPress={() => setInternalAlertMsg('Próximamente. La autenticación con Microsoft estará disponible en el futuro.')}
      >
        <Ionicons name="logo-windows" size={22} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Microsoft</Text>
      </Pressable>
      {modalType === 'login' && (
        <LoginModal visible={true} onClose={() => setModalType(null)} />
      )}
      {modalType === 'signup' && (
        <SignupModal visible={true} onClose={() => setModalType(null)} />
      )}
      <AlertMessage message={internalAlertMsg} onClose={() => setInternalAlertMsg('')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 30,
    marginTop: 18,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
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