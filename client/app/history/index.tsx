import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, ScrollView, View } from "react-native";
import { useSessionStore } from "@/stores/useSessionStore";
import { useCallback, useMemo } from "react";
import { SessionComponent } from "@/components/SessionComponent";

export default function HistoryScreen() {
  const iconColor = useThemeColor({}, 'text');
  const { sessions } = useSessionStore();
  
  const handleBackPress = () => {
    router.back();
  };

  const formatDateDisplay = useCallback((dateString: string) => {
    const date = new Date(dateString);
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
      return "Today, " + monthDayFormat;
    } else if (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    ) {
      return "Yesterday, " + monthDayFormat;
    } else {
      const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const weekday = date.toLocaleDateString('en-US', weekdayOptions);
      return `${weekday}, ${monthDayFormat}`;
    }
  }, []);

  const uniqueDates = useMemo(() => {
    if (!sessions) return [];
    
    const dateSet = new Set<string>();
    sessions.forEach(session => {
      const date = new Date(session.time);
      const dateKey = date.toDateString();
      dateSet.add(dateKey);
    });
    
    return Array.from(dateSet).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [sessions]);

  return (
    <ThemedView className="flex-1 px-8 py-16">
      <ThemedView className="mb-6">
        <TouchableOpacity 
          className="flex-row w-full items-center -ml-2 mb-6" 
          onPress={handleBackPress} 
          activeOpacity={0.5}
        >
          <ChevronLeft size={20} color={iconColor} strokeWidth={3} />
          <ThemedText type="defaultSemiBold" className="pl-1">Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title">History</ThemedText>
      </ThemedView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {uniqueDates.length > 0 ? (
          <>
            {uniqueDates.map((dateKey) => {
              const date = new Date(dateKey);
              
              return (
                <View key={dateKey} className="mb-6">
                  <ThemedText type="subtitle" className="opacity-80">
                    {formatDateDisplay(date.toISOString())}
                  </ThemedText>
                  
                  <SessionComponent selectedDate={date} viewOnly />
                </View>
              );
            })}
          </>
        ) : (
          <View className="flex-1 items-center justify-center mt-32">
            <ThemedText className="italic opacity-70">No workout history yet...</ThemedText>
            <ThemedText className="text-sm opacity-50 mt-2 text-center">
              Your completed sessions will appear here
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}