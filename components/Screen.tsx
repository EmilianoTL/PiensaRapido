import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface ScreenProps {
  children: ReactNode;
}

const Screen = ({ children }: ScreenProps) => {
  return <View style={styles.container}>{children}</View>;
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
  },
});
