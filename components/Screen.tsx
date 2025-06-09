import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
// Asegúrate de importar SafeAreaView desde 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
}

const Screen = ({ children }: ScreenProps) => {
  // Usa SafeAreaView como el contenedor principal
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
});