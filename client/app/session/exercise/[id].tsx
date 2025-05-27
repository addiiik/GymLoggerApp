import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useSessionStore } from "@/stores/useSessionStore";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ChevronLeft } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native";
import SetComponent from "@/components/SetComponent";

export default function ExerciseScreen() {
  const { id, viewOnly } = useLocalSearchParams();
  const { sessions, addSetToExercise } = useSessionStore();
  const iconColor = useThemeColor({}, 'text');

  const isViewOnly = viewOnly === 'true';
  let exercise = null;
  let sessionId = null;
  
  for (const session of sessions || []) {
    const foundExercise = session.exercises.find((ex) => ex.id === id);
    if (foundExercise) {
      exercise = foundExercise;
      sessionId = session.id;
      break;
    }
  }

  if (!exercise || !sessionId) {
    return (
      <ThemedView className="flex-1 justify-center items-center px-8">
        <ThemedText>Exercise not found</ThemedText>
        <ThemedButton 
          title="Go back" 
          className="mt-4" 
          onPress={() => router.back()}
        />
      </ThemedView>
    );
  }

  const formatExerciseName = (value: string) => {
    return value
      .split('_')
      .map((word) => word[0] + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSetAdded = (set: any) => {
    if (!isViewOnly) {
      addSetToExercise(sessionId, exercise.id, set);
    }
  };

  return (
    <ThemedView className="flex-1 justify-start px-8 py-16">      
      <ThemedView>
        <TouchableOpacity className="flex-row w-full items-center -ml-2 mb-6" onPress={handleBackPress} activeOpacity={0.5}>
          <ChevronLeft size={20} color={iconColor} strokeWidth={3} />
          <ThemedText type="defaultSemiBold" className="pl-1">Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" className="mb-2">{formatExerciseName(exercise.name)}</ThemedText>
      </ThemedView>

      <SetComponent 
        sets={exercise.sets} 
        exerciseId={exercise.id}
        sessionId={sessionId}
        onSetAdded={handleSetAdded}
        viewOnly={isViewOnly}
      />
    </ThemedView>
  );
}