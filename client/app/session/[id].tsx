import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useSessionStore } from "@/stores/useSessionStore";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ChevronLeft } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native";
import { ExerciseComponent } from "@/components/ExerciseComponent";

export default function SessionScreen() {
  const { id, viewOnly } = useLocalSearchParams();
  const { sessions } = useSessionStore();
  const iconColor = useThemeColor({}, 'text');
  const isViewOnly = viewOnly === 'true';
  const session = sessions?.find((s) => s.id === id);

  if (!session) {
    return (
      <ThemedView className="flex-1 justify-center items-center px-8">
        <ThemedText>Session not found</ThemedText>
        <ThemedButton 
          title="Go back" 
          className="mt-4" 
          onPress={() => router.back()}
        />
      </ThemedView>
    );
  }

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ThemedView className="flex-1 justify-between px-8 py-16">      
      <ThemedView>
        <TouchableOpacity className="flex-row w-full items-center -ml-2 mb-6" onPress={handleBackPress} activeOpacity={0.5}>
          <ChevronLeft size={20} color={iconColor} strokeWidth={3} />
          <ThemedText type="defaultSemiBold" className="pl-1">Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" className="mb-2">{session.name}</ThemedText>
      </ThemedView>

      <ExerciseComponent session={session} viewOnly={isViewOnly} />
    </ThemedView>
  );
}