import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameCardProps {
  title: string;
  blocked?: boolean;
  onPress?: () => void;
  onInfoPress?: () => void;
}

export default function GameCard({ title, blocked, onPress, onInfoPress }: GameCardProps) {
  return (
    <Pressable
      style={styles.card}
      disabled={blocked}
      onPress={blocked ? undefined : onPress}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Pressable
        style={[
          styles.infoButton,
          {
            position: 'absolute',
            right: 18,
            top: '50%',
            marginTop: -14,
            zIndex: 10,
          },
        ]}
        onPress={(e) => {
          e.stopPropagation();
          onInfoPress && onInfoPress();
        }}
      >
        <Ionicons name="help-circle-outline" size={28} color="#6200ea" />
      </Pressable>
      {blocked && (
        <View style={styles.blockedOverlay} pointerEvents="none" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    position: 'relative',
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
  blockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    zIndex: 2,
  },
});
