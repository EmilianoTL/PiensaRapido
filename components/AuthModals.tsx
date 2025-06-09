import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, Pressable, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AlertMessage from './AlertMessage';

function getFriendlyErrorMessage(error: any): string {
  if (!error || !error.code) return 'Ocurrió un error inesperado.';
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'El correo ya está registrado.';
    case 'auth/invalid-email':
      return 'El correo no es válido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/user-not-found':
      return 'No existe una cuenta con ese correo.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde.';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Verifica tu correo y contraseña.';
    default:
      return 'Error: ' + (error.message || 'Ocurrió un error inesperado.');
  }
}

export default function AuthModals({ visible, onClose, type }: { visible: boolean; onClose: () => void; type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  // Limpiar campos cada vez que se abre el modal
  useEffect(() => {
    if (visible) {
      setEmail('');
      setPassword('');
      setAlertMsg('');
    }
  }, [visible]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (type === 'signup') {
        await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        setAlertMsg('Registro exitoso. ¡Bienvenido!');
      } else {
        await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        setAlertMsg('Login exitoso. ¡Bienvenido de nuevo!');
      }
      onClose();
    } catch (error: any) {
      setAlertMsg(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{type === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.button} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : (type === 'signup' ? 'Registrarse' : 'Entrar')}</Text>
          </Pressable>
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={{ color: '#6200ea', fontWeight: 'bold' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        <AlertMessage message={alertMsg} onClose={() => setAlertMsg('')} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 18, padding: 28, width: 320, alignItems: 'center', elevation: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6200ea', marginBottom: 18 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 16, color: '#222' },
  button: { backgroundColor: '#6200ea', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  close: { marginTop: 16 },
});