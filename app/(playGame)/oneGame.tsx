import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CalculoM from './calculom';

export default function OneGamePage() {
  const { tipo, id } = useLocalSearchParams();

  if (tipo === 'calculo' && id === '401') {
    return <CalculoM />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minijuego</Text>
      <Text style={styles.subtitle}>Aquí se mostrará el minijuego seleccionado.</Text>
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