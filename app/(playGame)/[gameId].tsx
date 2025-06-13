import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Screen from '@components/Screen';
import LightSequenceGame from '@components/Games/LightSequence';
import TimerBar from '@components/TimeBar';
import { Ionicons } from '@expo/vector-icons';
import MoreLessNumber from '@components/Games/MoreLessNumber';

// --- Game Component Mapping ---
const GAME_COMPONENTS: Record<string, React.ElementType> = {
  '101': LightSequenceGame,
  '401': MoreLessNumber,
  // Future games will be added here
};


// --- Main Component ---
export default function GamePlayerPage() {
  // --- Hooks ---
  const router = useRouter();
  const { gameId, mode = 'oneGame', tipo } = useLocalSearchParams<{ gameId: string; mode: 'oneGame' | 'multipleGames' | 'allGames'; tipo: string }>();
  const gameRef = useRef<{ restart: () => void; forceGameOver: () => void }>(null);

  // --- State Management ---
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timerPaused, setTimerPaused] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  // --- Dynamic Game Component ---
  const GameComponent = gameId ? GAME_COMPONENTS[gameId] : null;


  // --- Callbacks and Event Handlers ---
  const handleFinalAction = useCallback(() => {
    setIsGameOver(false);
    if (mode !== 'oneGame') {
      router.back();
    } else {
      gameRef.current?.restart();
    }
  }, [mode, router]);

  const handleExit = useCallback(() => {
    setIsGameOver(false);
    router.back();
  }, [router]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  // Cuando el usuario pierde (por error en la secuencia)
  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  // --- TimerBar handlers ---
  const handleStartTimer = useCallback(() => {
    setTimerPaused(false);
  }, []);
  const handlePauseTimer = useCallback(() => {
    setTimerPaused(true);
  }, []);
  const handleResetTimer = useCallback(() => {
    setTimerKey(prev => prev + 1);
    setTimerPaused(true);
  }, []);

  // --- TimeOut handler ---
  const handleTimeOut = useCallback(() => {
    gameRef.current?.forceGameOver();
  }, []);

  // Al iniciar la partida, la barra debe aparecer llena y pausada
  useEffect(() => {
    setTimerKey(0); // Reinicia la barra
    setTimerPaused(true); // Pausada y llena
  }, []);

  // --- Render Logic ---
  if (mode === 'multipleGames' || mode === 'allGames') {
    return (
      <Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ fontSize: 22, color: '#6200ea', textAlign: 'center', marginBottom: 20 }}>
            Esta función estará disponible en una versión futura.
          </Text>
          <Pressable
            style={{ backgroundColor: '#6200ea', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 30 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Volver</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Top Bar */}
      <View style={styles.topBarNoBack}>
        <View style={styles.scoreContainer}>
          <Ionicons name="star" size={24} color="#FDD835" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <Pressable onPress={handlePause} style={styles.iconButton}>
          <Ionicons name="pause" size={32} color="#3e2d6b" />
        </Pressable>
      </View>
      {/* Game Area */}
      <View style={styles.gameArea}>
        {GameComponent ? (
          <GameComponent
            ref={gameRef}
            isPaused={isPaused || isGameOver}
            onScoreChange={setScore}
            onGameOver={handleGameOver}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onResetTimer={handleResetTimer}
          />
        ) : (
          <View>
            <Text style={styles.title}>Juego no Encontrado</Text>
          </View>
        )}
      </View>
      {/* TimerBar SIEMPRE visible al final del layout */}
      <View style={styles.timerBarWrapper}>
        <TimerBar
          key={timerKey}
          isPaused={timerPaused || isPaused || isGameOver}
          isGameOver={isGameOver}
          score={score}
          onTimeOut={handleTimeOut}
        />
      </View>
      {/* Pause Modal */}
      <Modal visible={isPaused} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pausa</Text>
            <Pressable style={styles.modalButton} onPress={handleResume}>
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Reanudar</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => {
              setIsPaused(false);
              gameRef.current?.restart();
            }}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Reiniciar</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.quitButton]} onPress={() => router.back()}>
              <Ionicons name="exit-outline" size={24} color="#fff" />
              <Text style={styles.modalButtonText}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Game Over Modal */}
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

// --- Styles ---
const styles = StyleSheet.create({
  topBarNoBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    marginTop: 10,
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
  },
  timerBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 50,
  },
});
