import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import Screen from '@components/Screen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import gamesDataJson from '@assets/games.json';

const ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; label: string }> = {
  memoria: { name: 'book-outline', label: 'Memoria' },
  atencion: { name: 'eye-outline', label: 'Atención' },
  razonamiento: { name: 'bulb-outline', label: 'Razonamiento Lógico' },
  calculo: { name: 'calculator-outline', label: 'Cálculo Mental' },
};

// Define los tipos válidos para los juegos
type GameType = 'memoria' | 'atencion' | 'razonamiento' | 'calculo';

// Cambia la importación si usas require o import json
const gamesData = gamesDataJson as Record<GameType, { id: number; nombre: string; descripcion: string }[]>;

export default function KindGamePage() {
  const { IdGame } = useLocalSearchParams();
  const gameType = (IdGame as GameType) || 'memoria'; // fallback por si acaso
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ nombre: string; descripcion: string } | null>(null);

  // Obtén los datos del tipo de juego
  const juegos = gamesData[gameType] || [];
  const iconData = ICONS[gameType];

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={40} color="#6200ea" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{iconData?.label || IdGame}</Text>
        {iconData && (
          <Ionicons
            name={iconData.name}
            size={36}
            color="#6200ea"
            style={{ marginLeft: 12 }}
          />
        )}
      </View>
      {/* Botón Play debajo del título */}
      <View style={styles.playButtonWrapper}>
        <Link
          href={{
            pathname: '/(playGame)/multipleGames',
            params: { tipo: gameType },
          }}
          asChild
        >
          <Pressable style={styles.playButton}>
            <Ionicons name="play-circle" size={28} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.playButtonText}>Jugar</Text>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={juegos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16, // padding inferior extra
          paddingTop: 16,
        }}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: '/(playGame)/oneGame',
              params: { tipo: gameType, id: item.id },
            }}
            asChild
          >
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={(e) => {
                  e.stopPropagation?.(); // Evita que el click abra la carta
                  setSelectedGame({
                    nombre: item.nombre,
                    descripcion: item.descripcion || 'Descripción no disponible.',
                  });
                  setModalVisible(true);
                }}
              >
                <Ionicons name="help-circle-outline" size={28} color="#6200ea" />
              </TouchableOpacity>
            </Pressable>
          </Link>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedGame?.nombre}</Text>
            <Text style={styles.modalDescription}>{selectedGame?.descripcion}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ea',
    textAlign: 'center',
    letterSpacing: 1,
  },
  playButtonWrapper: {
    alignItems: 'center',
    marginBottom: 6,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 4,
    marginBottom: 8,
    elevation: 2,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0d7f8',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    color: '#3e2d6b',
    fontWeight: '600',
    flex: 1,
  },
  infoButton: {
    marginLeft: 16,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: 300,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#3e2d6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6200ea',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});