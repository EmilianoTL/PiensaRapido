import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';

const COLORS = {
  red: { base: '#e74c3c', shadow: '#c0392b' },
  green: { base: '#2ecc71', shadow: '#27ae60' },
  blue: { base: '#3498db', shadow: '#2980b9' },
  yellow: { base: '#f1c40f', shadow: '#f39c12' },
};
const COLOR_KEYS = ['red', 'green', 'blue', 'yellow'];

type GameState = 'idle' | 'showing' | 'playing' | 'gameOver';

interface LightSequenceProps {
  isPaused: boolean;
  gameState: GameState;
  onScoreChange: (newScore: number) => void;
  onStateChange: (newState: GameState) => void;
}

const LightSequence = forwardRef((props: LightSequenceProps, ref) => {
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

  useEffect(() => {
    if (isPaused) return;

    if (gameState === 'idle') {
      onScoreChange(0);
      setScore(0);
      setSequence([]);
      setPlayerSequence([]);
      setTimeout(() => {
        onStateChange('showing');
      }, 800);
    } else if (gameState === 'showing') {
        const newColorIndex = Math.floor(Math.random() * COLOR_KEYS.length);
        const newSequence = [...sequence, newColorIndex];
        setSequence(newSequence);
        setPlayerSequence([]);
        showSequence(newSequence);
    }
  }, [gameState, isPaused]);

  const handlePlayerPress = (index: number) => {
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
      onStateChange('showing');
    }
  };

  return (
    <View style={styles.gameBoard}>
      {COLOR_KEYS.map((key, index) => {
        const color = COLORS[key as keyof typeof COLORS];
        const isActive = activeButton === index;
        return (
          <View key={index} style={styles.buttonWrapper}>
            <Pressable
              disabled={gameState !== 'playing'}
              onPress={() => handlePlayerPress(index)}
              style={({ pressed }) => [
                styles.gameButton,
                { 
                  backgroundColor: color.base,
                  borderColor: color.shadow,
                  opacity: isActive || (pressed && gameState === 'playing') ? 1 : 0.6,
                },
                isActive && styles.activeButton,
                pressed && gameState === 'playing' && styles.pressedButton,
              ]}
            />
          </View>
        );
      })}
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
    borderBottomWidth: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  activeButton: {
    transform: [{ scale: 1.05 }],
    opacity: 1,
    shadowColor: '#fff',
    shadowRadius: 15,
    elevation: 16,
  },
  pressedButton: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 4,
    elevation: 2,
  }
});

export default LightSequence;
