import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig'; // Adjust the import path as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';

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
  const [localImage, setLocalImage] = useState<string | null>(null);
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
          setLocalImage(snap.data().profile.foto || null);
        } else {
          setProfile({
            foto: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            edad: ''
          });
          setLocalImage(null);
        }
      } catch (e) {
        setProfile({
          foto: '',
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          edad: ''
        });
        setLocalImage(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7, base64: false });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      // Comprimir y convertir a base64
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }], // Redimensiona a 300px de ancho
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setLocalImage(`data:image/jpeg;base64,${manipResult.base64}`);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    let photoBase64 = profile.foto;
    try {
      // Si hay una imagen local nueva en base64, guárdala en Firestore
      if (localImage && localImage.startsWith('data:image')) {
        photoBase64 = localImage;
      }
      const ref = doc(FIREBASE_DB, 'users', user.uid);
      await setDoc(ref, { profile: { ...profile, foto: photoBase64 } }, { merge: true });
    } catch (e) {
      alert('Error al guardar: ' + (e as Error).message);
    }
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#6200ea" />;

  return (
    <View style={styles.form}>
      <Pressable onPress={pickImage} style={styles.avatarWrapper}>
        {/* Mostrar la imagen local si existe, si no, mostrar la de profile.foto si es base64, si no, placeholder */}
        {localImage ? (
          <Image source={{ uri: localImage }} style={styles.avatar} />
        ) : profile.foto && profile.foto.startsWith('data:image') ? (
          <Image source={{ uri: profile.foto }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-circle-outline" size={80} color="#bdbdbd" />
            <Text style={{ color: '#6200ea', marginTop: 4 }}>Agregar foto</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre(s)</Text>
        <TextInput style={styles.input} placeholder="Nombre(s)" value={profile.nombre} onChangeText={v => setProfile({ ...profile, nombre: v })} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Apellido paterno</Text>
        <TextInput style={styles.input} placeholder="Apellido paterno" value={profile.apellidoPaterno} onChangeText={v => setProfile({ ...profile, apellidoPaterno: v })} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Apellido materno</Text>
        <TextInput style={styles.input} placeholder="Apellido materno" value={profile.apellidoMaterno} onChangeText={v => setProfile({ ...profile, apellidoMaterno: v })} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Edad</Text>
        <TextInput style={styles.input} placeholder="Edad" value={profile.edad} onChangeText={v => setProfile({ ...profile, edad: v.replace(/[^0-9]/g, '') })} keyboardType="numeric" />
      </View>
      <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar cambios'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%', alignItems: 'center', gap: 18, padding: 18, borderRadius: 18, elevation: 2 },
  avatarWrapper: { marginBottom: 8, borderRadius: 60, overflow: 'hidden', borderWidth: 2, borderColor: '#e0d7f8', backgroundColor: '#f5f3ff' },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#e0d7f8', alignItems: 'center', justifyContent: 'center' },
  inputGroup: { width: '90%', marginBottom: 6 },
  label: { color: '#6200ea', fontWeight: 'bold', marginBottom: 2, marginLeft: 2 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, color: '#222', backgroundColor: '#f8f8ff' },
  saveButton: { backgroundColor: '#6200ea', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 32, marginTop: 12, width: '90%', alignItems: 'center', elevation: 2 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 1 },
});