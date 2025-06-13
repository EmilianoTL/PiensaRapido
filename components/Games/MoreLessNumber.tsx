import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CalculoM() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál número es mayor?</Text>
      <View style={styles.numbersContainer}>
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>{/* Número 1 */}?</Text>
        </View>
        <Text style={styles.vsText}>vs</Text>
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>{/* Número 2 */}?</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mayor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Menor</Text>
        </TouchableOpacity>
      </View>
      {/* 
        Aquí puedes mostrar el resultado (correcto/incorrecto)
        <Text style={styles.resultText}>¡Correcto!</Text>
      */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
      {/* 
        Aquí va la lógica para generar nuevos números y manejar el estado del juego
      */}
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 24,
    textAlign: 'center',
  },
  numbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  numberBox: {
    backgroundColor: '#e0d7f8',
    padding: 32,
    borderRadius: 16,
    marginHorizontal: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  numberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3e2d6b',
  },
  vsText: {
    fontSize: 22,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0d7f8',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#6200ea',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // resultText: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#388e3c',
  //   marginTop: 16,
  // },
});