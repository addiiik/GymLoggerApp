import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/themed/ThemedText';
import * as Haptics from 'expo-haptics';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  title: string;
  variant?: 'primary' | 'outline';
  textClassName?: string;
  useNativeWindForText?: boolean;
  size?: ButtonSize;
  useHaptics?: boolean;
};

export function ThemedButton({
  style,
  lightBackgroundColor,
  darkBackgroundColor,
  lightTextColor,
  darkTextColor,
  title,
  variant = 'primary',
  textClassName,
  useNativeWindForText = false,
  size = 'md',
  useHaptics = false,
  onPress,
  ...otherProps
}: ThemedButtonProps) {
  const tintColor = useThemeColor({}, 'tint');

  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    variant === 'outline' ? 'background' : 'tint'
  );

  const textColor = useThemeColor(
    { light: lightTextColor, dark: darkTextColor },
    variant === 'outline' ? 'tint' : 'background'
  );

  const buttonSizeStyle = {
    sm: { paddingVertical: 6, paddingHorizontal: 12 },
    md: { paddingVertical: 10, paddingHorizontal: 16 },
    lg: { paddingVertical: 14, paddingHorizontal: 20 },
    xl: { paddingVertical: 18, paddingHorizontal: 24 },
  }[size];

  const handlePress = (event: any) => {
    if (useHaptics && process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonSizeStyle,
        variant === 'primary' && { backgroundColor },
        variant === 'outline' && {
          borderWidth: 1,
          borderColor: tintColor,
          backgroundColor: '#transparent',
        },
        style,
      ]}
      activeOpacity={0.7}
      onPress={handlePress}
      {...otherProps}
    >
      <ThemedText 
        className={textClassName}
        useNativeWind={useNativeWindForText}
        preserveColor={true}
        lightColor={variant === 'outline' ? lightTextColor : darkTextColor}
        darkColor={variant === 'outline' ? darkTextColor : lightTextColor}
        style={{ color: textColor }}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});