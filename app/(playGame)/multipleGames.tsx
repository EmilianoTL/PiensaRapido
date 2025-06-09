import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MultipleGamesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Múltiples Juegos</Text>
      <Text style={styles.subtitle}>Aquí se mostrarán los juegos múltiples o grupales próximamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6200ea', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#3e2d6b', textAlign: 'center' },
});