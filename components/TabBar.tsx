import { BottomTabBarProps } from '@react-navigation/bottom-tabs'; 
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import type { Route } from '@react-navigation/native';
import TabBarButton from '@components/TabBarButton';
import type { TabRouteName } from '@constants/icons';
import React, { useState } from 'react';
import Animated,{ useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 }); // evitar división por cero
  const buttonWidth = dimensions.width / state.routes.length;

  const tabPositionX = useSharedValue(0);

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });

    // ✅ Inicializa la posición del recuadro morado en el tab actual
    tabPositionX.value = withSpring((width / state.routes.length) * state.index);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View onLayout={onTabBarLayout} style={styles.tabBar}>
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
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
        const label = typeof rawLabel === 'string' ? rawLabel : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index); // No usar duration aquí
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

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
