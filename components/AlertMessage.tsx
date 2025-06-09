import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface AlertMessageProps {
  message: string;
  onClose: () => void;
}

export default function AlertMessage({ message, onClose }: AlertMessageProps) {
  if (!message) return null;
  return (
    <View style={styles.alertOverlay}>
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>{message}</Text>
        <Pressable style={styles.alertButton} onPress={onClose}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    minWidth: 220,
    alignItems: 'center',
    elevation: 6,
  },
  alertText: {
    color: '#6200ea',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});
