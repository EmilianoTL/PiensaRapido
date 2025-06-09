import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlayPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a la pantalla de juego!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 22, fontWeight: 'bold', color: '#6200ea' },
});