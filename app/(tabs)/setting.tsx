import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Screen from '@components/Screen';

const FONT_SIZES = ['Pequeño', 'Mediano', 'Grande'] as const;
const LANGUAGES = ['Español', 'Inglés'] as const;

export default function Setting() {
  const [fontSizeIdx, setFontSizeIdx] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageIdx, setLanguageIdx] = useState(0);

  const handleFontSize = (change: number) => {
    setFontSizeIdx(idx => {
      const newIdx = Math.max(0, Math.min(FONT_SIZES.length - 1, idx + change));
      return newIdx;
    });
  };

  const handleLanguage = () => {
    setLanguageIdx(idx => (idx + 1) % LANGUAGES.length);
  };

  const handleGuide = () => {
    Alert.alert('Guía de uso', 'Aquí iría la navegación a la guía de uso.');
  };

  // Aquí iría la función real de cerrar sesión
  const handleSignOut = () => {
    // TODO: Implementar lógica de cierre de sesión
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.header}>Ajustes</Text>
        
        {/* Tamaño de letra */}
        <View style={styles.section}>
          <Text style={styles.optionText}>Tamaño de letra</Text>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                fontSizeIdx === 0 && { opacity: 0.5 }
              ]}
              onPress={() => handleFontSize(-1)}
              disabled={fontSizeIdx === 0}
            >
              <Text>A-</Text>
            </TouchableOpacity>
            <Text style={styles.currentSize}>{FONT_SIZES[fontSizeIdx]}</Text>
            <TouchableOpacity
              style={[
                styles.fontSizeButton,
                fontSizeIdx === FONT_SIZES.length - 1 && { opacity: 0.5 }
              ]}
              onPress={() => handleFontSize(1)}
              disabled={fontSizeIdx === FONT_SIZES.length - 1}
            >
              <Text>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled}
            />
          </View>
        </View>

        {/* Idioma */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.option} onPress={handleLanguage}>
            <Text style={styles.optionText}>Idioma</Text>
            <Text style={styles.valueText}>{LANGUAGES[languageIdx]} ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Guía de uso */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.option} onPress={handleGuide}>
            <Text style={styles.optionText}>Guía de uso</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
          {/* Aquí iría la lógica real de cierre de sesión */}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  valueText: {
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 15,
  },
  fontSizeButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  currentSize: {
    marginHorizontal: 10,
  },
  signOutButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  signOutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});