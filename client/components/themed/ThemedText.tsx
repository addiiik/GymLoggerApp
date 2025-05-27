import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'medium';
  className?: string;
  useNativeWind?: boolean;
  preserveColor?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className,
  useNativeWind = false,
  preserveColor = true,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      className={className}
      style={[
        preserveColor && { color },
        useNativeWind && type === 'default' ? { lineHeight: styles.default.lineHeight } : undefined,
        useNativeWind && type === 'title' ? { lineHeight: styles.title.lineHeight } : undefined,
        useNativeWind && type === 'defaultSemiBold' ? { lineHeight: styles.defaultSemiBold.lineHeight } : undefined,
        useNativeWind && type === 'subtitle' ? {} : undefined,
        useNativeWind && type === 'link' ? { lineHeight: styles.link.lineHeight } : undefined,
        !useNativeWind && type === 'default' ? styles.default : undefined,
        !useNativeWind && type === 'title' ? styles.title : undefined,
        !useNativeWind && type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        !useNativeWind && type === 'subtitle' ? styles.subtitle : undefined,
        !useNativeWind && type === 'link' ? styles.link : undefined,
        !useNativeWind && type === 'medium' ? styles.medium : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  medium: {
    fontSize: 22,
    fontWeight: '600',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});