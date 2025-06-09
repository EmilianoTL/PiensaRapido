import { BottomTabBarProps } from '@react-navigation/bottom-tabs'; 
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import TabBarButton from '@components/TabBarButton';
import type { TabRouteName } from '@constants/icons';
import React, { useState } from 'react';
import Animated,{ useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { TabRouter } from '@react-navigation/native';

// Componente personalizado para la barra de pestañas inferior
export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Estado para guardar las dimensiones del contenedor de la tab bar
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 }); // evitar división por cero
  // Define los tabs que quieres mostrar
  const allowedTabs = ['index','progress',"reward", 'profile', 'setting']; // Cambia estos por los nombres de tus tabs

  // Filtra solo los tabs permitidos
  const filteredRoutes = state.routes.filter(route => allowedTabs.includes(route.name));

  // Calcula el ancho de cada botón/tab según los tabs permitidos
  const buttonWidth = dimensions.width / filteredRoutes.length;

  // Valor animado para la posición X del indicador morado
  const tabPositionX = useSharedValue(0);

  // Maneja el layout de la tab bar para obtener dimensiones y posicionar el indicador
  const onTabBarLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });

    // Encuentra el índice del tab activo dentro de los filtrados
    const filteredIndex = filteredRoutes.findIndex(
      r => r.key === state.routes[state.index].key
    );

    // Inicializa la posición del recuadro morado en el tab actual filtrado
    tabPositionX.value = withSpring((width / filteredRoutes.length) * filteredIndex);
  };

  // Estilo animado para mover el indicador morado
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    // Contenedor principal de la tab bar
    <View onLayout={onTabBarLayout} style={styles.tabBar}>
      {/* Indicador morado animado que resalta el tab activo */}
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: '#723FEB',
            borderRadius: 30,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {/* Renderiza los botones de cada tab */}
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
        const label = typeof rawLabel === 'string' ? rawLabel : route.name;

        // Determina si este tab está enfocado
        const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

        // Maneja el evento de presionar el tab
        const onPress = () => {
          // Mueve el indicador morado al tab seleccionado
          tabPositionX.value = withSpring(buttonWidth * index);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // Navega al tab si no está enfocado
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Maneja el evento de mantener presionado el tab
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Renderiza el botón de la tab
        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as TabRouteName}
            color={isFocused ? '#FFF' : '#222'}
            label={label}
          />
        );
      })}
    </View>
  );
}

// Estilos para la tab bar
const styles = StyleSheet.create({
    tabBar:{
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
});
