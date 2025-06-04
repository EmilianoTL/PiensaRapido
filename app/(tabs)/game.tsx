import { View, Text, StyleSheet } from 'react-native';
import Screen from '@components/Screen';

export default function Game() {
  return (
    <Screen>
      <View style={styles.container}>
         <Text style={styles.text}>¡Pantalla Game!</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20},
});
