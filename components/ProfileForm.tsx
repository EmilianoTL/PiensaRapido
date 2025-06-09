import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig'; // Adjust the import path as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileForm() {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) return null;
  const [profile, setProfile] = useState({
    foto: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const ref = doc(FIREBASE_DB, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile({ ...profile, ...snap.data().profile });
        } else {
          setProfile({
            foto: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            edad: ''
          });
        }
      } catch (e) {
        setProfile({
          foto: '',
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          edad: ''
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.5, base64: true });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setProfile({ ...profile, foto: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      console.log('Intentando guardar perfil:', profile);
      const ref = doc(FIREBASE_DB, 'users', user.uid);
      await setDoc(ref, { profile }, { merge: true });
      console.log('Perfil guardado correctamente');
    } catch (e) {
      console.log('Error al guardar en Firestore:', e);
      alert('Error al guardar: ' + (e as Error).message);
    }
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#6200ea" />;

  return (
    <View style={styles.form}>
      <Pressable onPress={pickImage}>
        {profile.foto ? (
          <Image source={{ uri: profile.foto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}><Text style={{ color: '#6200ea' }}>Agregar foto</Text></View>
        )}
      </Pressable>
      <TextInput style={styles.input} placeholder="Nombre(s)" value={profile.nombre} onChangeText={v => setProfile({ ...profile, nombre: v })} />
      <TextInput style={styles.input} placeholder="Apellido paterno" value={profile.apellidoPaterno} onChangeText={v => setProfile({ ...profile, apellidoPaterno: v })} />
      <TextInput style={styles.input} placeholder="Apellido materno" value={profile.apellidoMaterno} onChangeText={v => setProfile({ ...profile, apellidoMaterno: v })} />
      <TextInput style={styles.input} placeholder="Edad" value={profile.edad} onChangeText={v => setProfile({ ...profile, edad: v.replace(/[^0-9]/g, '') })} keyboardType="numeric" />
      <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%', alignItems: 'center', gap: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e0d7f8', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  input: { width: '90%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, color: '#222', marginBottom: 8 },
  saveButton: { backgroundColor: '#6200ea', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 8, width: '90%', alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});