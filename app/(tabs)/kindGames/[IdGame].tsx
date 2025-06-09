import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import Screen from '@components/Screen';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function KindGamePage() {
  const { IdGame } = useLocalSearchParams();

  return (
    <Screen>
      <Stack.Screen
        options={{
        headerShown: true,
          title: ``,
          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={24} color="#6200ea" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>¡Pantalla {IdGame}!</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 22, fontWeight: 'bold' },
});