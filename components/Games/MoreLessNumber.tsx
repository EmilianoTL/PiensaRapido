import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getUniqueNumbers = (min: number, max: number, count: number) => {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const n = getRandomNumber(min, max);
    if (!numbers.includes(n)) numbers.push(n);
  }
  return numbers;
};

const PHRASES = [
  { key: 'mayor', text: '¿Cuál es el número mayor?' },
  { key: 'menor', text: '¿Cuál es el número menor?' },
];

const ROUND_TIME = 5000; // 5 segundos por ronda

const MoreLessNumber = forwardRef((props: any, ref) => {
  const router = useRouter();

  // Estados de juego
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [numbers, setNumbers] = useState(getUniqueNumbers(1, 99, 3));
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer control
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef(0);

  // Métodos expuestos para el padre (idéntico a LightSequence)
  useImperativeHandle(ref, () => ({
    restart: () => {
      internalRestart();
    },
    forceGameOver: () => {
      internalForceGameOver();
    },
  }));

  // Detener timer si el juego termina desde el padre
  useEffect(() => {
    if (props.isGameOver) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerIdRef.current += 1;
    }
  }, [props.isGameOver]);

  // Reiniciar juego cuando el padre lo indique (cuando isGameOver pasa de true a false)
  useEffect(() => {
    if (!props.isGameOver) {
      internalRestart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isGameOver]);

  // Timer control
  const startTimer = () => {
    setIsPaused(false);
    if (props.onStartTimer) props.onStartTimer();
    if (timerRef.current) clearTimeout(timerRef.current);

    timerIdRef.current += 1;
    const thisTimerId = timerIdRef.current;

    timerRef.current = setTimeout(() => {
      if (timerIdRef.current === thisTimerId && !props.isGameOver) {
        if (props.onGameOver) props.onGameOver();
      }
    }, ROUND_TIME);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (props.onPauseTimer) props.onPauseTimer();
    timerIdRef.current += 1;
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (props.onResetTimer) props.onResetTimer();
    timerIdRef.current += 1;
  };

  // Siguiente ronda
  const nextRound = () => {
    setNumbers(getUniqueNumbers(1, 99, 3));
    setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    setResult(null);
    setIsPaused(false);
    if (props.onResetTimer) props.onResetTimer();
    startTimer();
  };

  // Manejo de fin de juego (por error del usuario)
  const internalForceGameOver = () => {
    pauseTimer();
    if (props.onGameOver) props.onGameOver();
  };

  // Al seleccionar un número
  const handleSelect = (selected: number) => {
    if (result || isPaused || props.isGameOver) return;
    const phraseKey = PHRASES[phraseIndex].key;
    let correct = false;
    if (phraseKey === 'mayor') {
      correct = selected === Math.max(...numbers);
    } else {
      correct = selected === Math.min(...numbers);
    }
    if (correct) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (props.onScoreChange) props.onScoreChange(newScore);
        return newScore;
      });
      setResult('¡Correcto!');
      setIsPaused(true);
      pauseTimer();
      setTimeout(() => {
        setResult(null);
        setIsPaused(false);
        nextRound();
      }, 800);
    } else {
      internalForceGameOver();
    }
  };

  // Iniciar el juego al montar
  useEffect(() => {
    if (!props.isGameOver) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerIdRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reiniciar todo el juego
  const internalRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerIdRef.current += 1;

    setScore(0);
    setPhraseIndex(0);
    setNumbers(getUniqueNumbers(1, 99, 3));
    setResult(null);
    setIsPaused(false);
    if (props.onResetTimer) props.onResetTimer();

    setTimeout(() => {
      if (!props.isGameOver) startTimer();
    }, 50);
  };

  // Reiniciar juego si el usuario regresa
  const handleBack = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerIdRef.current += 1;
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PHRASES[phraseIndex].text}</Text>
      <View style={styles.numbersContainer}>
        {numbers.map((num, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.numberBox}
            onPress={() => handleSelect(num)}
            disabled={!!result || isPaused || props.isGameOver}
          >
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {result && (
        <Text
          style={[
            styles.resultText,
            result === '¡Correcto!' ? styles.correct : styles.incorrect,
          ]}
        >
          {result}
        </Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 24,
    textAlign: 'center',
    marginTop: 40,
  },
  numbersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 18,
  },
  numberBox: {
    backgroundColor: '#e0d7f8',
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginHorizontal: 8,
    minWidth: 80,
    alignItems: 'center',
    elevation: 4,
  },
  numberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3e2d6b',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  correct: {
    color: '#388e3c',
  },
  incorrect: {
    color: '#d32f2f',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0d7f8',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#6200ea',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MoreLessNumber;