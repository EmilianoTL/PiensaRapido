import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';

const COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']; // Rojo, Verde, Azul, Amarillo

type GameState = 'idle' | 'showing' | 'playing' | 'gameOver';

interface SimonSaysProps {
  isPaused: boolean;
  gameState: GameState; // Recibe el estado del padre
  onScoreChange: (newScore: number) => void;
  onStateChange: (newState: GameState) => void;
}

const SimonSays = forwardRef((props: SimonSaysProps, ref) => {
  const { isPaused, gameState, onScoreChange, onStateChange } = props;

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useImperativeHandle(ref, () => ({
    restart() {
      onStateChange('idle');
    }
  }));

  const showSequence = useCallback((seq: number[]) => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (isPaused) {
        clearInterval(intervalId);
        return;
      }
      setActiveButton(seq[index]);
      setTimeout(() => setActiveButton(null), 350);
      index++;
      if (index >= seq.length) {
        clearInterval(intervalId);
        onStateChange('playing');
      }
    }, 700);
    return () => clearInterval(intervalId);
  }, [isPaused, onStateChange]);
  
  // Este efecto ahora reacciona a los cambios de estado del padre
  useEffect(() => {
    if (isPaused) return;

    if (gameState === 'idle') {
      onScoreChange(0);
      setScore(0);
      setSequence([]);
      setPlayerSequence([]);
      setTimeout(() => onStateChange('showing'), 500);
    } else if (gameState === 'showing') {
      const newColorIndex = Math.floor(Math.random() * COLORS.length);
      const newSequence = [...sequence, newColorIndex];
      setSequence(newSequence);
      setPlayerSequence([]);
      showSequence(newSequence);
    }
  }, [gameState, isPaused]);


  const handlePlayerPress = (index: number) => {
    // CAMBIO CLAVE: La guarda ahora usa el `gameState` del padre
    if (gameState !== 'playing' || isPaused) return;

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      onStateChange('gameOver');
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange(newScore);
      onStateChange('showing'); // Notifica al padre que empiece la siguiente ronda
    }
  };

  return (
    <View style={styles.gameBoard}>
      {COLORS.map((color, index) => (
        <Animated.View key={index} style={styles.buttonWrapper}>
          <Pressable
            // CAMBIO CLAVE: El botón se deshabilita si no es el turno del jugador
            disabled={gameState !== 'playing'}
            onPress={() => handlePlayerPress(index)}
            style={({ pressed }) => [
              styles.gameButton,
              { backgroundColor: color },
              activeButton === index && styles.activeButton,
              (pressed && gameState === 'playing') && styles.pressedButton,
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  gameBoard: {
    width: '90%',
    aspectRatio: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    maxWidth: 400,
  },
  buttonWrapper: {
    width: '45%',
    height: '45%',
  },
  gameButton: {
    flex: 1,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  activeButton: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
    shadowColor: '#fff',
    shadowRadius: 15,
  },
  pressedButton: {
    opacity: 0.6,
  }
});

export default SimonSays;
