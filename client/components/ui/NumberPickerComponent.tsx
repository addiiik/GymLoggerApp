import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ThemedText } from '@/components/themed/ThemedText';
import * as Haptics from 'expo-haptics';

interface NumberPickerComponentProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}

export const NumberPickerComponent = React.memo(({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  suffix = '',
}: NumberPickerComponentProps) => {
  const colorScheme = useColorScheme();
  const flatListRef = useRef<FlatList<number>>(null);
  const itemHeight = 50;
  const visibleItems = 5;
  const containerHeight = itemHeight * visibleItems;
  const lastHapticTime = useRef(0);
  const lastHapticIndex = useRef(-1);

  const numbers = useMemo(() => {
    const isWeightPicker = suffix === 'kg';

    if (isWeightPicker) {
      const nums: number[] = [];

      if (min <= 1) {
        nums.push(1);
      }

      for (let i = 2.5; i <= max; i = parseFloat((i + 2.5).toFixed(10))) {
        if (i > 1) {
          nums.push(i);
        }
      }

      return nums;
    }

    const nums: number[] = [];
    for (let i = min; i <= max; i = parseFloat((i + step).toFixed(10))) {
      nums.push(i);
    }
    return nums;
  }, [min, max, step, suffix]);

  useEffect(() => {
    const index = numbers.findIndex(num => num === value);
    if (index !== -1 && flatListRef.current) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: index * itemHeight,
          animated: false,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [value, numbers, itemHeight]);

  const triggerHaptic = useCallback((currentIndex: number) => {
    const now = Date.now();
    if (now - lastHapticTime.current > 100 && currentIndex !== lastHapticIndex.current) {
      lastHapticTime.current = now;
      lastHapticIndex.current = currentIndex;
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, []);

  const clampScrollOffset = useCallback((offset: number) => {
    const minOffset = 0;
    const maxOffset = (numbers.length - 1) * itemHeight;
    return Math.min(Math.max(offset, minOffset), maxOffset);
  }, [numbers.length]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const clampedY = clampScrollOffset(y);
    const currentIndex = Math.round(clampedY / itemHeight);
    
    if (clampedY !== y) {
      flatListRef.current?.scrollToOffset({
        offset: clampedY,
        animated: false,
      });
    }
    
    triggerHaptic(currentIndex);
  }, [clampScrollOffset, triggerHaptic]);

  const onScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const selectedValue = numbers[index];
    if (selectedValue !== undefined && selectedValue !== value) {
      onValueChange(selectedValue);
    }
    lastHapticIndex.current = -1;
  }, [numbers, value, onValueChange]);

  const renderItem = useCallback(({ item }: { item: number; index: number }) => {
    const isSelected = item === value;
    return (
      <TouchableOpacity
        className="justify-center items-center"
        style={{ height: itemHeight }}
        activeOpacity={0.7}
      >
        <ThemedText
          className="text-2xl font-medium"
          style={{ opacity: isSelected ? 1 : 0.4 }}
        >
          {item}{suffix}
        </ThemedText>
      </TouchableOpacity>
    );
  }, [value, suffix]);

  return (
    <View className="relative" style={{ height: containerHeight }}>
      <View
        className={`absolute left-0 right-0 border-t-2 border-b-2 z-10 
          ${colorScheme === 'light' ? 'border-black/20' : 'border-white/30'}`}
        style={{ top: itemHeight * 2, height: itemHeight }}
      />

      <FlatList
        ref={flatListRef}
        data={numbers}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        contentContainerStyle={{
          paddingTop: itemHeight * 2,
          paddingBottom: itemHeight * 2,
        }}
        initialNumToRender={visibleItems}
        maxToRenderPerBatch={visibleItems}
        windowSize={5}
        className={`border-2 rounded-lg 
          ${colorScheme === 'light' 
            ? 'border-black/10 bg-[#f9f9f9]' 
            : 'border-white/10 bg-[#303132]'}`}
      />
    </View>
  );
});