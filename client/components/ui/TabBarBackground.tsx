import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function AndroidTabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View 
      style={[
        StyleSheet.absoluteFill,
        { 
          backgroundColor: colorScheme === 'dark' 
            ? Colors.dark.background 
            : Colors.light.background,
          opacity: 0.95,
        }
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}