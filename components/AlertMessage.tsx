import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';

interface AlertMessageProps {
  message: string;
  onClose: () => void;
}

export default function AlertMessage({ message, onClose }: AlertMessageProps) {
  return (
    <Modal visible={!!message} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.alertOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{message}</Text>
          <Pressable style={styles.alertButton} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 32,
    minWidth: 240,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  alertText: {
    color: '#6200ea',
    fontSize: 17,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  alertButton: {
    backgroundColor: '#6200ea',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 4,
  },
});
