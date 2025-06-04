import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from '@components/TabBar';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';

const TABS = [ 'profile', 'reward', 'game', 'progress', 'setting'];

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab}
          name={`${tab}`}
          options={{
            title: tab.charAt(0).toUpperCase() + tab.slice(1),
          }}
        />
      ))}
    </Tabs>
  );
}
