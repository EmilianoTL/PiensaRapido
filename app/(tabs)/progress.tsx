import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Screen from '@components/Screen';
import progressData from '@assets/progress.json';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const categoryIcons: Record<string, React.ReactNode> = {
  memoria: <Ionicons name="book-outline" size={28} color="#6200ea" style={{ marginRight: 10 }} />,
  atencion: <Ionicons name="eye-outline" size={28} color="#6200ea" style={{ marginRight: 10 }} />,
  razonamiento: <Ionicons name="bulb-outline" size={28} color="#6200ea" style={{ marginRight: 10 }} />,
  calculo: <Ionicons name="calculator-outline" size={28} color="#6200ea" style={{ marginRight: 10 }} />,
};

type ProgressKeys = keyof typeof progressData.progreso;

type StreakDayProps = {
  day: string;
  isCurrent: boolean;
  isCompleted: boolean;
  index: number;
};

const StreakDay: React.FC<StreakDayProps> = ({ day, isCurrent, isCompleted, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.dayContainer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={[styles.dayCircle, isCompleted ? styles.completedDay : null, isCurrent ? styles.currentDay : null]}>
        <Text style={styles.dayText}>{day}</Text>
      </View>
    </Animated.View>
  );
};

type ProgressBarProps = {
  category: ProgressKeys;
  value: number;
  icon: React.ReactNode;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ category, value, icon }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: value,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        {icon}
        <Text style={styles.progressLabel}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
      </View>
      <Text style={styles.progressText}>{`${Math.round(value)}%`}</Text>
    </View>
  );
};

const dayMapping: { [key: string]: keyof typeof progressData.Racha } = {
    'Lun': 'lunes',
    'Mar': 'martes',
    'Mié': 'miercoles',
    'Jue': 'jueves',
    'Vie': 'viernes',
    'Sáb': 'sabado',
    'Dom': 'domingo'
};

export default function Progress() {
  const [progress, setProgress] = useState(progressData.progreso);
  const [streak, setStreak] = useState(progressData.Racha);

  // Simulate data fetching and update
  useEffect(() => {
    // In a real app, you'd fetch this data.
    // For now, we just re-set it to trigger animations.
    setProgress({ ...progressData.progreso });
    setStreak({ ...progressData.Racha });
  }, []);

  const todayIndex = daysOfWeek.findIndex(d => streak.currentday.toLowerCase().startsWith(d.toLowerCase()));

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Racha de la Semana</Text>
          <View style={styles.streakContainer}>
            {daysOfWeek.map((day, index) => (
              <StreakDay
                key={day}
                day={day}
                isCurrent={index === todayIndex}
                isCompleted={streak[dayMapping[day]] !== ''} // Placeholder logic
                index={index}
              />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Progreso de Habilidades</Text>
          {(Object.keys(progress) as ProgressKeys[]).map((category) => (
            <ProgressBar
              key={category}
              category={category}
              value={progress[category]}
              icon={categoryIcons[category]}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#f5f3ff', // Lila muy suave para fondo de card
    borderRadius: 32,
    padding: 25,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d1750', // Texto oscuro para mejor contraste
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff', // Fondo blanco para los días
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#b39ddb', // Lila claro para borde
  },
  currentDay: {
    backgroundColor: '#ffe082', // Amarillo suave para el día actual
    borderColor: '#fbc02d',
    borderWidth: 2.5,
  },
  completedDay: {
    backgroundColor: '#c8e6c9', // Verde suave para días completados
    borderColor: '#388e3c',
  },
  dayText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d1750', // Texto oscuro para días
  },
  progressContainer: {
    width: '100%',
    marginVertical: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d1750', // Texto oscuro para etiquetas
    marginLeft: 6,
  },
  progressBarBackground: {
    height: 14,
    backgroundColor: '#ede7f6', // Lila muy claro para fondo de barra
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: '#6200ea', // Lila fuerte para barra de progreso
  },
  progressText: {
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '500',
    color: '#2d1750', // Texto oscuro para porcentaje
    marginTop: 3,
  },
});
