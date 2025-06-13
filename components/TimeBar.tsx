import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface TimerBarProps {
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  onTimeOut: () => void;
}

export default function TimerBar({ isPaused, isGameOver, score, onTimeOut }: TimerBarProps) {
  const timerAnimation = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const lastScoreRef = useRef(score);
  const lastValueRef = useRef(1);

  // Listener para guardar el valor actual de la animación
  useEffect(() => {
    const id = timerAnimation.addListener(({ value }) => {
      lastValueRef.current = value;
    });
    return () => timerAnimation.removeListener(id);
  }, [timerAnimation]);

  useEffect(() => {
    // Solo reinicia la barra si cambia el score (nuevo turno)
    if (score !== lastScoreRef.current) {
      timerAnimation.setValue(1);
      lastScoreRef.current = score;
      lastValueRef.current = 1;
    }
    if (isPaused || isGameOver) {
      animationRef.current?.stop();
      return;
    }
    const timeForLevel = Math.max(5000 - (score * 200), 1500);
    animationRef.current = Animated.timing(timerAnimation, {
      toValue: 0,
      duration: timeForLevel * lastValueRef.current, // ajusta el tiempo restante
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished) {
        onTimeOut();
      }
    });
    return () => {
      animationRef.current?.stop();
    };
  }, [isPaused, isGameOver, score, timerAnimation, onTimeOut]);

  return (
    <View style={styles.timerWrapper}>
      <View style={styles.timerContainer}>
        <Animated.View style={[styles.timerBar, {
          width: timerAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          })
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerWrapper: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  timerContainer: {
    height: 14,
    width: '80%',
    backgroundColor: '#e0d7f8',
    borderRadius: 7,
    marginVertical: 0,
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#723FEB',
    borderRadius: 7,
  },
});
