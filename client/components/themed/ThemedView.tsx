import { View, type ViewProps } from 'react-native';

import { useThemeColor, type ColorName } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isModal?: boolean;
  isInsideModal?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, isModal = false, isInsideModal = false, ...otherProps }: ThemedViewProps) {
  let colorType: ColorName = 'background';
  
  if (isInsideModal) {
    colorType = 'insideModalBackground' as ColorName;
  } else if (isModal) {
    colorType = 'modalBackground' as ColorName;
  }
  
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorType);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}