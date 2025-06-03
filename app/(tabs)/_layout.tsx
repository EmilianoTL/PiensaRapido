import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

const TABS = ['game', 'progress', 'reward', 'profile', 'setting'];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab}
          name={`${tab}`}
          options={{
            title: tab.charAt(0).toUpperCase() + tab.slice(1),
            tabBarIcon: ({ focused }) => <TabIcon routeName={tab} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  const scale = useSharedValue(1);
  const colorTransition = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 300 });
    colorTransition.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorTransition.value,
      [0, 1],
      ['gray', '#6200ea']
    ),
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: 300 }),
    transform: [{ scaleX: withTiming(focused ? 1 : 0.2, { duration: 300 }) }],
  }));

  const iconNameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    game: 'play-circle',
    progress: 'stats-chart',
    reward: 'gift',
    profile: 'person-circle',
    setting: 'settings',
  };

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedStyle}>
        <Animated.Text>
          <Ionicons
            name={iconNameMap[routeName] || 'ellipse'}
            size={28}
            style={colorStyle as any}
          />
        </Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.underline, underlineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  underline: {
    height: 3,
    width: 24,
    borderRadius: 2,
    backgroundColor: '#6200ea',
    marginTop: 4,
  },
});
