import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

// Asegúrate de importar SafeAreaView desde 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
}

const Screen = ({ children }: ScreenProps) => {
  // Usa SafeAreaView como el contenedor principal
  return <View style={styles.container}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
    paddingTop: 15,
    paddingBottom: 50,
  },
});