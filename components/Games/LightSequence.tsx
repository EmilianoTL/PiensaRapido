import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

const COLORS = {
  red: { base: '#e74c3c', shadow: '#c0392b' },
  green: { base: '#2ecc71', shadow: '#27ae60' },
  blue: { base: '#3498db', shadow: '#2980b9' },
  yellow: { base: '#f1c40f', shadow: '#f39c12' },
};
const COLOR_KEYS = ['red', 'green', 'blue', 'yellow'];

interface LightSequenceProps {
  isPaused: boolean;
  onScoreChange: (newScore: number) => void;
  setStatusText: (text: string) => void;
  onGameOver: () => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
}

const LightSequence = forwardRef((props: LightSequenceProps, ref) => {
  const { isPaused, onScoreChange, setStatusText, onGameOver, onStartTimer, onPauseTimer, onResetTimer } = props;

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'playing' | 'gameOver'>('idle');
  const sequenceIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  useImperativeHandle(ref, () => ({
    restart() {
      setScore(0);
      setSequence([]);
      setPlayerSequence([]);
      setPhase('idle');
    },
    forceGameOver() {
      setPhase('gameOver');
    }
  }));

  // Mostrar la secuencia (pausable y reanudable correctamente, siempre enciende/apaga aunque se repita el botón)
  const runStep = useCallback((seq: number[]) => {
    if (props.isPaused) return;
    const index = sequenceIndexRef.current;
    setActiveButton(seq[index]);
    timeoutRef.current = setTimeout(() => {
      setActiveButton(null);
      timeoutRef.current = setTimeout(() => {
        sequenceIndexRef.current++;
        if (sequenceIndexRef.current < seq.length) {
          runStep(seq);
        } else {
          setIsShowingSequence(false);
          setTimeout(() => {
            if (!props.isPaused) {
              setPhase('playing');
              setStatusText('¡Tu Turno!');
              onResetTimer();
              onStartTimer();
            }
          }, 400);
        }
      }, 200); // Espera apagado antes de avanzar
    }, 350); // Tiempo encendido
  }, [props.isPaused, setStatusText, onResetTimer, onStartTimer]);

  const showSequence = useCallback((seq: number[]) => {
    setPhase('showing');
    setStatusText('Observa...');
    onPauseTimer();
    setIsShowingSequence(true);
    sequenceIndexRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    runStep(seq);
    return () => {
      setIsShowingSequence(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onPauseTimer, runStep]);

  // Efecto para pausar/reanudar la secuencia
  useEffect(() => {
    if (phase === 'showing') {
      if (props.isPaused && isShowingSequence) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else if (!props.isPaused && isShowingSequence) {
        // Reanuda la secuencia desde el índice actual
        runStep(sequence);
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [props.isPaused, phase, isShowingSequence, runStep, sequence]);

  // Controla el flujo del juego
  useEffect(() => {
    if (isPaused) {
      onPauseTimer();
      return;
    }
    if (phase === 'idle') {
      setStatusText('');
      onScoreChange(0);
      setScore(0);
      setSequence([]);
      setPlayerSequence([]);
      onPauseTimer(); // Barra pausada al iniciar
      setTimeout(() => {
        // Empieza el juego
        const newColorIndex = Math.floor(Math.random() * COLOR_KEYS.length);
        const newSequence = [newColorIndex];
        setSequence(newSequence);
        setPlayerSequence([]);
        showSequence(newSequence);
      }, 800);
    } else if (phase === 'showing') {
      // Nada, showSequence se encarga
    } else if (phase === 'playing') {
      onStartTimer();
    } else if (phase === 'gameOver') {
      setStatusText('¡Fin del juego!');
      onPauseTimer();
      onGameOver();
    }
  }, [phase, isPaused, showSequence, onScoreChange, setStatusText, onGameOver, onPauseTimer, onStartTimer]);

  // Cuando el usuario presiona un botón
  const handlePlayerPress = (index: number) => {
    if (phase !== 'playing' || isPaused) return;
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setPhase('gameOver');
      onPauseTimer();
      return;
    }
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange(newScore);
      onPauseTimer(); // Detiene la barra al terminar input
      onResetTimer(); // Reinicia la barra visualmente
      setTimeout(() => {
        const newColorIndex = Math.floor(Math.random() * COLOR_KEYS.length);
        const newSequence = [...sequence, newColorIndex];
        setSequence(newSequence);
        setPlayerSequence([]);
        showSequence(newSequence);
      }, 600);
    }
  };

  // Handler para cuando se acaba el tiempo
  const handleTimeOut = () => {
    if (phase === 'playing') {
      setPhase('gameOver');
      onPauseTimer();
    }
  };

  // Renderiza el tablero, pero si isPaused, deshabilita todos los botones
  return (
    <View style={styles.gameBoard}>
      {COLOR_KEYS.map((key, index) => {
        const color = COLORS[key as keyof typeof COLORS];
        const isActive = activeButton === index;
        return (
          <View key={index} style={styles.buttonWrapper}>
            <Pressable
              disabled={phase !== 'playing' || isPaused}
              onPress={() => handlePlayerPress(index)}
              style={({ pressed }) => [
                styles.gameButton,
                { 
                  backgroundColor: color.base,
                  borderColor: color.shadow,
                  opacity: isActive || (pressed && phase === 'playing') ? 1 : 0.6,
                },
                isActive && styles.activeButton,
                pressed && phase === 'playing' && styles.pressedButton,
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
