import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type SumaFastProps = {
  isPaused?: boolean;
  isGameOver?: boolean;
  onScoreChange?: (score: number) => void;
  onGameOver?: () => void;
  onStartTimer?: () => void;
  onPauseTimer?: () => void;
  onResetTimer?: () => void;
};

type Operation = {
  a: number;
  b: number;
  result: number;
  isCorrect: boolean;
  display: string;
};

const TOTAL_QUESTIONS = 3;

function generateOperation(): Operation {
  const a = Math.floor(Math.random() * 90) + 10; // 2 dígitos
  const b = Math.floor(Math.random() * 90) + 10; // 2 dígitos
  const isCorrect = Math.random() < 0.5;
  let result: number;
  if (isCorrect) {
    result = a + b;
  } else {
    // Genera un resultado incorrecto cercano
    let delta = Math.floor(Math.random() * 10) + 1;
    if (Math.random() < 0.5) delta = -delta;
    result = a + b + delta;
    if (result === a + b) result += 1; // Asegura que sea incorrecto
  }
  return {
    a,
    b,
    result,
    isCorrect,
    display: `${a} + ${b} = ${result}`,
  };
}

const SumaFast = forwardRef((props: SumaFastProps, ref) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [operation, setOperation] = useState<Operation>(generateOperation());
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  // Notifica score global
  useEffect(() => {
    if (props.onScoreChange) props.onScoreChange(score);
  }, [score]);

  // Reinicia el juego
  const restartGame = () => {
    setQuestionIdx(0);
    setScore(0);
    setOperation(generateOperation());
    setAnswered(false);
    if (props.onResetTimer) props.onResetTimer();
    if (props.onStartTimer) props.onStartTimer();
  };

  // Exponer métodos al padre
  useImperativeHandle(ref, () => ({
    restart: restartGame,
    forceGameOver: () => handleGameOver(),
    getScore: () => score,
  }));

  // Si el juego se pausa, pausa el timer
  useEffect(() => {
    if (props.isPaused && props.onPauseTimer) props.onPauseTimer();
    if (!props.isPaused && props.onStartTimer) props.onStartTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isPaused]);

  // Limpia estado cuando el juego termina (por ejemplo, al salir)
  useEffect(() => {
    if (props.isGameOver) {
      setAnswered(false);
    }
  }, [props.isGameOver]);

  // Reinicia el estado interno y la barra cuando el juego se reinicia desde el padre
  useEffect(() => {
    if (!props.isGameOver) {
      setQuestionIdx(0);
      setScore(0);
      setOperation(generateOperation());
      setAnswered(false);
      if (props.onResetTimer) props.onResetTimer();
      if (props.onStartTimer) props.onStartTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isGameOver]);

  // Cuando termina el juego
  function handleGameOver() {
    if (props.onGameOver) props.onGameOver();
  }

  // Cuando el usuario responde
  function handleAnswer(userSaysCorrect: boolean) {
    if (props.isPaused || props.isGameOver || answered) return;
    setAnswered(true);

    let isRight = userSaysCorrect === operation.isCorrect;
    if (isRight) setScore(s => s + 1);

    setTimeout(() => {
      if (questionIdx + 1 >= TOTAL_QUESTIONS) {
        handleGameOver();
      } else {
        setQuestionIdx(idx => idx + 1);
        setOperation(generateOperation());
        setAnswered(false);
        if (props.onResetTimer) props.onResetTimer();
        if (props.onStartTimer) props.onStartTimer();
      }
    }, 600);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿La suma es correcta?</Text>
      <Text style={styles.question}>{operation.display}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, answered && operation.isCorrect && styles.correct]}
          onPress={() => handleAnswer(true)}
          disabled={props.isPaused || props.isGameOver || answered}
        >
          <Text style={styles.buttonText}>Correcto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, answered && !operation.isCorrect && styles.correct]}
          onPress={() => handleAnswer(false)}
          disabled={props.isPaused || props.isGameOver || answered}
        >
          <Text style={styles.buttonText}>Falso</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.progress}>
        Pregunta {questionIdx + 1} de {TOTAL_QUESTIONS}
      </Text>
      <Text style={styles.scoreText}>
        Puntuación: <Text style={styles.score}>{score}</Text>
      </Text>
      {props.isGameOver && (
        <Text style={styles.gameOverText}>¡Juego Terminado!</Text>
      )}
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 18,
    textAlign: 'center',
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3e2d6b',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 18,
  },
  button: {
    backgroundColor: '#b39ddb',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  correct: {
    backgroundColor: '#81c784',
  },
  progress: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  score: {
    color: '#388e3c',
  },
  gameOverText: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SumaFast;