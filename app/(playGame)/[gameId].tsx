import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Screen from '@components/Screen';
import LightSequenceGame from '@components/Games/LightSequence';
import { Ionicons } from '@expo/vector-icons';

// Mapeo de IDs a componentes de juego
const GAME_COMPONENTS: Record<string, React.ElementType> = {
  '101': LightSequenceGame,
  // Aquí agregarás otros juegos en el futuro
};

type GameState = 'idle' | 'showing' | 'playing' | 'gameOver';

export default function GamePlayerPage() {
  const router = useRouter();
  const { gameId, mode = 'oneGame' } = useLocalSearchParams<{ gameId: string; mode: 'oneGame' | 'multipleGames' | 'allGames' }>();

  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [currentGameState, setCurrentGameState] = useState<GameState>('idle');
  const gameRef = useRef<{ restart: () => void }>(null);

  const timerAnimation = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const GameComponent = gameId ? GAME_COMPONENTS[gameId] : null;

  // Efecto que controla el temporizador y los textos basado en el estado del juego
  useEffect(() => {
    if (isPaused || isGameOver) {
      animationRef.current?.stop();
      return;
    }

    switch (currentGameState) {
      case 'showing':
        setStatusText('Observa...');
        animationRef.current?.stop();
        timerAnimation.setValue(1);
        break;
      
      case 'playing':
        setStatusText('¡Tu Turno!');
        const timeForLevel = Math.max(5000 - (score * 200), 1500);
        timerAnimation.setValue(1);
        
        animationRef.current = Animated.timing(timerAnimation, {
          toValue: 0,
          duration: timeForLevel,
          useNativeDriver: false,
        });
        
        animationRef.current.start(({ finished }) => {
          if (finished && !isPaused && !isGameOver) {
            setCurrentGameState('gameOver');
          }
        });
        break;
      
      case 'gameOver':
        setStatusText('¡Fin del juego!');
        animationRef.current?.stop();
        setIsGameOver(true);
        break;

      case 'idle':
      default:
        setStatusText('');
        animationRef.current?.stop();
        timerAnimation.setValue(1);
        break;
    }
    
    return () => {
        animationRef.current?.stop();
    };

  }, [currentGameState, isPaused, isGameOver, score]);
  
  const handleFinalAction = () => {
    setIsGameOver(false);
    if (mode !== 'oneGame') {
      router.back();
    } else {
      gameRef.current?.restart();
    }
  };

  const handleExit = () => {
    setIsGameOver(false);
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Barra de tiempo centrada y en la parte superior */}
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

      {/* Barra superior sin botón de retorno */}
      <View style={styles.topBarNoBack}>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={24} color="#FDD835" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <Pressable onPress={() => setIsPaused(true)} style={styles.iconButton}>
          <Ionicons name="pause" size={32} color="#3e2d6b" />
        </Pressable>
      </View>

      {/* Texto de estado mejorado */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusTextEnhanced}>{statusText}</Text>
      </View>

      <View style={styles.gameArea}>
        {GameComponent ? (
          <GameComponent
            ref={gameRef}
            isPaused={isPaused || isGameOver}
            gameState={currentGameState}
            onScoreChange={setScore}
            onStateChange={setCurrentGameState}
          />
        ) : (
          <View>
            <Text style={styles.title}>Juego no Encontrado</Text>
          </View>
        )}
      </View>
      
      {/* Modal de pausa */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pausa</Text>
            <Pressable style={styles.modalButton} onPress={() => setIsPaused(false)}>
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Reanudar</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.quitButton]} onPress={() => router.back()}>
              <Ionicons name="exit-outline" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de fin de juego con dos botones */}
      <Modal visible={isGameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Juego Terminado!</Text>
            <Text style={styles.finalScoreText}>Puntuación Final: {score}</Text>
            <Pressable style={styles.modalButton} onPress={handleFinalAction}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Jugar de Nuevo</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.quitButton]} onPress={handleExit}>
              <Ionicons name="exit-outline" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
  },
  topBarNoBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    marginTop: 10,
  },
  timerWrapper: {
    alignItems: 'center',
    marginTop: 10,
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
  iconButton: {
    padding: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3e2d6b',
    marginLeft: 8,
  },
  statusContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 22,
    fontFamily: 'RobotoSlab_700Bold',
    color: '#723FEB',
    letterSpacing: 1,
  },
  statusTextEnhanced: {
    fontSize: 26,
    fontFamily: 'RobotoSlab_900Black',
    color: '#3e2d6b',
    letterSpacing: 1.5,
    textShadowColor: '#e0d7f8',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginVertical: 10,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#f5f3ff',
    borderRadius: 22,
    padding: 35,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'RobotoSlab_900Black',
    color: '#6200ea',
    marginBottom: 25,
  },
  finalScoreText:{
    fontSize: 20,
    color: '#3e2d6b',
    fontFamily: 'RobotoSlab_700Bold',
    marginBottom: 30,
  },
  modalButton: {
    flexDirection: 'row',
    backgroundColor: '#6200ea',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  quitButton: {
    backgroundColor: '#c62828',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});
