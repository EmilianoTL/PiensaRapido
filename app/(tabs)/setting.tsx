import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Screen from '@components/Screen';
import SignOutButton from '@components/Auth/SignOutButton';

export default function Setting() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        
        {/* Sección de ajustes */}
        <View style={styles.section}>
          <Text style={styles.optionText}>Tamaño de letra</Text>
          <View style={styles.fontSizeControls}>
            <TouchableOpacity style={styles.fontSizeButton}>
              <Text>A-</Text>
            </TouchableOpacity>
            <Text style={styles.currentSize}>Mediano</Text>
            <TouchableOpacity style={styles.fontSizeButton}>
              <Text>A+</Text>
            </TouchableOpacity>
          </View>
          {/* Aquí iría la lógica para cambiar tamaño de fuente */}
        </View>

        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch 
              value={true} 
              onValueChange={() => {}} 
              /* Aquí iría el estado y función para notificaciones */
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Idioma</Text>
            <Text style={styles.valueText}>Español ▼</Text>
            {/* Aquí iría el selector de idioma */}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Guía de uso</Text>
            {/* Aquí iría la navegación a la guía */}
          </TouchableOpacity>
        </View>

        {/* Conexión con otras ventanas - Esta sección sería para navegación */}
        <View style={styles.section}>
          {/* Ejemplo: <TouchableOpacity onPress={() => navigation.navigate('Help')}> */}
        </View>

        {/* Botón de cerrar sesión (ya existente) */}
        <SignOutButton />
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
});