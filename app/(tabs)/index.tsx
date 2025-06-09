import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';

// Ajustamos los tamaños para el nuevo diseño compacto
const GRID_BUTTON_SIZE = 150;
const CENTER_BUTTON_SIZE = 150;

export default function Game() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Este es el nuevo contenedor principal para el bloque de botones.
        Tendrá una posición relativa para que el botón central absoluto se posicione respecto a él.
      */}
      <View style={styles.centralBox}>
        
        {/* --- CUADRÍCULA DE 4 BOTONES --- */}
        <TouchableOpacity style={styles.gridButton}>
          <Text style={styles.buttonText}>Memoria</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <Text style={styles.buttonText}>Atención</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <Text style={styles.buttonText}>Razonamiento{'\n'}Lógico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridButton}>
          <Text style={styles.buttonText}>Cálculo{'\n'}Mental</Text>
        </TouchableOpacity>
        
        {/* --- BOTÓN CENTRAL SUPERPUESTO --- */}
        <TouchableOpacity style={styles.centerCircle}>
          <Text style={styles.playButtonText}>Jugar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // El contenedor principal ahora solo se encarga de centrar el bloque de botones en la pantalla
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // El "recuadro" que contiene la cuadrícula y el botón central
  centralBox: {
    width: GRID_BUTTON_SIZE * 2 + 60, // Ancho para dos botones más un pequeño espacio
    flexDirection: 'row',
    flexWrap: 'wrap', // Esto permite que los botones se acomoden en una cuadrícula (2x2)
    justifyContent: 'space-around', // Distribuye los botones con espacio uniforme
    // La posición 'relative' es por defecto, pero es crucial para que 'absolute' del hijo funcione correctamente
  },
  // Estilo para los 4 botones de la cuadrícula
  gridButton: {
    width: GRID_BUTTON_SIZE,
    height: GRID_BUTTON_SIZE,
    backgroundColor: '#e0d7f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    margin: 15, // Un pequeño margen entre botones
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e2d6b',
    textAlign: 'center',
  },
  // El botón central sigue siendo absoluto, pero ahora se centra sobre el 'centralBox'
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      { translateX: -CENTER_BUTTON_SIZE / 2 },
      { translateY: -CENTER_BUTTON_SIZE / 2 }
    ],
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});