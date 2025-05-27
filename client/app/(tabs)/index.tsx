import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useState, useCallback, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavStore } from "@/stores/useNavStore";
import { ChevronRight, ChevronLeft } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePathname } from "expo-router";
import * as Haptics from 'expo-haptics';
import { SessionComponent } from "@/components/SessionComponent";

export default function HomeScreen() {
  const pathname = usePathname();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();
  const { setHomeNavData } = useNavStore();
  const iconColor = useThemeColor({}, 'icon');

  const formatDateDisplay = useCallback((date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };
    
    const monthDayFormat = date.toLocaleDateString('en-US', options);

    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      return {
        day: "Today",
        date: monthDayFormat
      };
    } else if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return {
        day: "Yesterday",
        date: monthDayFormat
      };
    } else {
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        date: monthDayFormat
      };
    }
  }, []);

  const formattedDateDisplay = formatDateDisplay(selectedDate);

  const goToPreviousDay = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const goToNextDay = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    
    if (nextDay <= today) {
      setSelectedDate(nextDay);
    }
  };

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }, []);

  useEffect(() => {
    setHomeNavData({
      selectedDate,
      isOnHome: pathname === '/',
      resetToToday: () => setSelectedDate(new Date())
    });
  }, [selectedDate, pathname, setHomeNavData]);

  return (
    <ThemedView className="flex-1 justify-between px-8 py-16">
      <View className="mt-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={goToPreviousDay}
            activeOpacity={0.7}
            className="p-2"
          >
            <ChevronLeft size={24} color={iconColor} />
          </TouchableOpacity>
          
          <View className="items-center">
            <ThemedText type="title" className="text-center">
              {formattedDateDisplay.day}
            </ThemedText>
            <ThemedText className="text-center mt-1">
              {formattedDateDisplay.date}
            </ThemedText>
          </View>

          {!isToday(selectedDate) ? (
            <TouchableOpacity 
              onPress={goToNextDay}
              activeOpacity={0.7}
              className="p-2"
            >
              <ChevronRight size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View className="p-2 opacity-0">
              <ChevronRight size={24} />
            </View>
          )}
        </View>
      </View>

      <SessionComponent selectedDate={selectedDate} />
    </ThemedView>
  );
}