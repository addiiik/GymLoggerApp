import React from 'react';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DropDownComponentProps {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  formatLabel?: (value: string) => string;
}

export const DropDownComponent = ({
  value,
  options,
  onValueChange,
  isOpen,
  onToggle,
  formatLabel = (val) => val
}: DropDownComponentProps) => {
  const colorScheme = useColorScheme();
  const iconColor = useThemeColor({}, 'text');

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    onToggle();
  };

  return (
    <View className="relative">
      <TouchableOpacity
        className={`border-2 rounded-lg h-12 px-3 flex-row items-center justify-between
          ${colorScheme === 'light' 
            ? 'border-black/10 bg-[#f9f9f9]' 
            : 'border-white/10 bg-[#303132]'}`}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <ThemedText className="flex-1">
          {value && formatLabel(value)}
        </ThemedText>
        <ChevronDown 
          size={20} 
          color={iconColor}
          className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </TouchableOpacity>

      {isOpen && (
        <View className={`absolute top-14 left-0 right-0 z-50 rounded-lg border-2 shadow-lg max-h-48
          ${colorScheme === 'light' 
            ? 'border-black/10 bg-[#f9f9f9]' 
            : 'border-white/10 bg-[#303132]'}`}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option}
              className={`px-3 py-3 ${
                index !== options.length - 1 
                  ? colorScheme === 'light' 
                    ? 'border-b border-gray-200' 
                    : 'border-b border-white/10'
                  : ''
              }`}
              onPress={() => handleOptionSelect(option)}
              activeOpacity={0.7}
            >
              <ThemedText className={value === option ? 'font-medium' : ''}>
                {formatLabel(option)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};