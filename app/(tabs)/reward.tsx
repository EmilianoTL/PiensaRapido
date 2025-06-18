import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@components/Screen';

// Tipado para recompensas
interface Reward {
  id: string;
  type: string;
  name: string;
  icon: any; // Ionicons acepta string, pero para evitar error de tipado
  cost: number;
}

const MOCK_REWARDS: Reward[] = [
  { id: '1', type: 'avatar', name: 'Avatar sonriente', icon: 'happy-outline', cost: 300 },
  { id: '2', type: 'theme', name: 'Tema relajante', icon: 'color-palette-outline', cost: 200 },
  { id: '3', type: 'booster', name: 'Doble puntos', icon: 'flash-outline', cost: 500 },
];

export default function Reward() {
  const [points, setPoints] = useState<number>(1250);
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [inventory, setInventory] = useState<Reward[]>([]);
  const [isGachaRunning, setIsGachaRunning] = useState(false);

  const handleGacha = () => {
    if (points < 100 || isGachaRunning) return;
    setIsGachaRunning(true);
    setTimeout(() => {
      const reward = MOCK_REWARDS[Math.floor(Math.random() * MOCK_REWARDS.length)];
      setLastReward(reward);
      setInventory([...inventory, reward]);
      setPoints(points - 100);
      setIsGachaRunning(false);
    }, 1200);
  };

  const handleBuy = (reward: Reward) => {
    if (points < reward.cost) return;
    setInventory([...inventory, reward]);
    setPoints(points - reward.cost);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.points}>Puntos: {points}</Text>
        <View style={styles.gachaSection}>
          <Ionicons name="gift-outline" size={64} color="#6200ea" style={{ marginBottom: 8 }} />
          <TouchableOpacity
            style={[styles.gachaButton, points < 100 && { backgroundColor: '#ccc' }]}
            onPress={handleGacha}
            disabled={points < 100 || isGachaRunning}
          >
            <Text style={styles.gachaButtonText}>{isGachaRunning ? 'Girando...' : '¡Girar Gacha! (100 pts)'}</Text>
          </TouchableOpacity>
        </View>
        {lastReward && (
          <View style={styles.lastReward}>
            <Ionicons name={lastReward.icon} size={36} color="#43a047" />
            <Text style={styles.lastRewardText}>¡Obtuviste: {lastReward.name}!</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>Tienda</Text>
        <FlatList
          data={MOCK_REWARDS}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.shopItem}>
              <Ionicons name={item.icon} size={32} color="#6200ea" />
              <Text style={styles.shopItemName}>{item.name}</Text>
              <Text style={styles.shopItemCost}>{item.cost} pts</Text>
              <TouchableOpacity
                style={[styles.buyButton, points < item.cost && { backgroundColor: '#ccc' }]}
                onPress={() => handleBuy(item)}
                disabled={points < item.cost}
              >
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          )}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.sectionTitle}>Inventario</Text>
        <FlatList
          data={inventory}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.inventoryItem}>
              <Ionicons name={item.icon} size={28} color="#43a047" />
              <Text style={styles.inventoryItemText}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f5f3ff',
  },
  points: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d1750',
    marginBottom: 10,
    textAlign: 'center',
  },
  gachaSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  gachaButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginTop: 8,
  },
  gachaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastReward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
  },
  lastRewardText: {
    marginLeft: 10,
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d1750',
    marginVertical: 10,
  },
  shopItem: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  shopItemName: {
    fontSize: 14,
    color: '#2d1750',
    marginTop: 6,
    textAlign: 'center',
  },
  shopItemCost: {
    fontSize: 13,
    color: '#6200ea',
    marginVertical: 4,
  },
  buyButton: {
    backgroundColor: '#43a047',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  inventoryItem: {
    backgroundColor: '#ede7f6',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
    width: 90,
  },
  inventoryItemText: {
    fontSize: 12,
    color: '#2d1750',
    marginTop: 4,
    textAlign: 'center',
  },
});
