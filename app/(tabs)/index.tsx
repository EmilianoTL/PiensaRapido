import { View, Text, StyleSheet, Pressable, Animated, ViewStyle, StyleProp, PressableProps } from 'react-native';
import React, { useRef, ReactNode } from 'react';
import Screen from '@components/Screen';

// Constantes para tamaños
const GRID_BUTTON_SIZE = 160;
const CENTER_CIRCLE_SIZE = 170;
const CENTER_CIRCLE_TRANSLATE = CENTER_CIRCLE_SIZE / 2;

// Tipado correcto para AnimatedPressable
type AnimatedPressableProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
} & PressableProps;

function AnimatedPressable({ children, style, ...props }: AnimatedPressableProps) {
  const animation = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      {...props}
      onPressIn={event => {
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }).start();
        props.onPressIn && props.onPressIn(event);
      }}
      onPressOut={event => {
        Animated.timing(animation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
        props.onPressOut && props.onPressOut(event);
      }}
    >
      <Animated.View style={[style, { opacity: animation }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function Game() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.grid}>
          <AnimatedPressable style={styles.gridButton}>
            <Text style={styles.buttonText}>Memoria</Text>
          </AnimatedPressable>
          <AnimatedPressable style={styles.gridButton}>
            <Text style={styles.buttonText}>Atención</Text>
          </AnimatedPressable>
          <AnimatedPressable style={styles.gridButton}>
            <Text style={styles.buttonText}>Razonamiento{'\n'}Lógico</Text>
          </AnimatedPressable>
          <AnimatedPressable style={styles.gridButton}>
            <Text style={styles.buttonText}>Cálculo{'\n'}Mental</Text>
          </AnimatedPressable>
        </View>
        <View style={styles.centerCircleWrapper}>
          <AnimatedPressable style={styles.centerCircle}>
            <Text style={styles.playButtonText}>Jugar</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: GRID_BUTTON_SIZE * 2 + 80,
    height: GRID_BUTTON_SIZE * 2 + 80,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridButton: {
    width: GRID_BUTTON_SIZE,
    height: GRID_BUTTON_SIZE,
    backgroundColor: '#e0d7f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    margin: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e2d6b',
    textAlign: 'center',
  },
  centerCircleWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -CENTER_CIRCLE_TRANSLATE },
      { translateY: -CENTER_CIRCLE_TRANSLATE }
    ],
    zIndex: 2,
  },
  centerCircle: {
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    borderRadius: CENTER_CIRCLE_SIZE / 2,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  playButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
});