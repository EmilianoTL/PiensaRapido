import { StyleSheet,Pressable } from "react-native";
import {icon} from "@constants/icons";
import React, { useEffect } from "react";
import Animated,{ useSharedValue, withSpring, useAnimatedStyle, interpolate } from "react-native-reanimated";

type TabRouteName = keyof typeof icon;

interface TabBarButtonProps {
    onPress: () => void;
    onLongPress: () => void;
    isFocused: boolean;
    routeName: TabRouteName;
    color: string;
    label: string;
}   

export default function TabBarButton({ onPress, onLongPress, isFocused, routeName, color, label }: TabBarButtonProps) {
    const scale = useSharedValue(1);
    useEffect(() => {
        scale.value = withSpring(
            typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused
        );
    },[scale, isFocused]);
    
    const animatedTextStyle = useAnimatedStyle(() =>  {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity,
        };
    });
    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);
        return {
            transform: [{ scale: scaleValue }],
            top,
        };
    });

    // Validación del icono
    const IconComponent = icon[routeName];
    const iconElement = typeof IconComponent === 'function'
        ? IconComponent({ color: isFocused ? '#FFF' : '#222' })
        : null;

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={[animatedIconStyle]}>
                {iconElement}
            </Animated.View>
            <Animated.Text style={[{ color: isFocused ? '#673ab7' : '#222', fontSize:12}, animatedTextStyle]}>{label}</Animated.Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    tabBarItem:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
    },
});
