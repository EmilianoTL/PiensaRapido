import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AllGamesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos los Juegos</Text>
      <Text style={styles.subtitle}>Aquí podrás ver la lista de todos los minijuegos disponibles próximamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#3e2d6b',
    textAlign: 'center',
  },
});