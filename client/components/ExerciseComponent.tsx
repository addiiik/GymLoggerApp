import { useState, useCallback } from "react";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useSessionStore } from "@/stores/useSessionStore";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { ExerciseModal } from "@/components/modals/ExerciseModalComponent";
import { ChevronRight, Trash2 } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { deleteExerciseAPI } from "@/api/deleteAPI";
import { createExerciseAPI } from "@/api/postAPI";

interface ExerciseComponentProps {
  session: any;
  viewOnly?: boolean;
}

export function ExerciseComponent({ session, viewOnly = false }: ExerciseComponentProps) {
  const router = useRouter();
  const { addExerciseToSession, deleteExerciseFromSession } = useSessionStore();
  const [modalVisible, setModalVisible] = useState(false);
  const iconColor = useThemeColor({}, 'icon');

  const formatExerciseName = (value: string) => {
    return value
      .split('_')
      .map((word) => word[0] + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getExerciseStats = useCallback((exercise: any) => {
    if (!exercise.sets || exercise.sets.length === 0) {
      return null;
    }

    const totalSets = exercise.sets.length;
    return { totalSets };
  }, []);

  const formatExerciseStats = (stats: { totalSets: number } | null) => {
    if (!stats) return '';
    
    const setText = stats.totalSets === 1 ? 'set' : 'sets';
    return `${stats.totalSets} ${setText}`;
  };

  const handleSelectExercise = async (exerciseName: string) => {
    if (viewOnly) return;
    
    try {
      const newExercise = await createExerciseAPI(session.id, exerciseName);
      addExerciseToSession(session.id, newExercise);
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  };

  const handleExercisePress = (exercise: any) => {
    if (viewOnly) {
      router.push(`/session/exercise/${exercise.id}?viewOnly=true`);
    } else {
      router.push(`/session/exercise/${exercise.id}`);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (viewOnly) return;
    
    try {
      await deleteExerciseAPI(exerciseId);
      
      deleteExerciseFromSession(session.id, exerciseId);
      
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      Alert.alert(
        'Error', 
        'Failed to delete exercise. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <>
      <ScrollView>
        {session.exercises.length > 0 ? (
          <View className="mt-6">
            {session.exercises.map((exercise: { id: any; name: string; }, index: any) => {
              const stats = getExerciseStats(exercise);

              const renderRightActions = () => {
                if (viewOnly) return null;
                
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Alert.alert(
                        "Delete Exercise",
                        "This action cannot be undone and will affect progress",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => handleDeleteExercise(exercise.id),
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                    className="flex-1 bg-red-600 justify-center items-center rounded-xl w-20 mb-6"
                  >
                    <Trash2 size={24} color="white" />
                  </TouchableOpacity>
                );
              };

              const ExerciseContent = (
                <TouchableOpacity 
                  onPress={() => handleExercisePress(exercise)}
                  activeOpacity={0.7}
                >
                  <ThemedView 
                    isModal 
                    className="p-4 rounded-xl mb-6 flex-row justify-between items-center"
                  >
                    <View className="flex-1 pl-2">
                      <ThemedText type="subtitle" className="mb-1">
                        {formatExerciseName(exercise.name)}
                      </ThemedText>
                      {stats && (
                        <ThemedText className="text-sm opacity-70">
                          {formatExerciseStats(stats)}
                        </ThemedText>
                      )}
                    </View>
                    <ChevronRight size={20} className="text-white" color={iconColor} />
                  </ThemedView>
                </TouchableOpacity>
              );

              if (viewOnly) {
                return (
                  <View key={exercise.id || exercise.name || index}>
                    {ExerciseContent}
                  </View>
                );
              }

              return (
                <Swipeable
                  key={exercise.id || exercise.name || index}
                  renderRightActions={renderRightActions}
                  overshootRight={false}
                >
                  {ExerciseContent}
                </Swipeable>
              );
            })}
          </View>
        ) : (
          <View className="mt-80 items-center justify-center">
            <ThemedText className="italic">So empty...</ThemedText>
          </View>
        )}
      </ScrollView>

      {!viewOnly && (
        <ThemedButton 
          title="Add exercise" 
          className="w-full h-14" 
          textClassName="font-medium"
          onPress={() => setModalVisible(true)}
        />
      )}

      {!viewOnly && (
        <ExerciseModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)}
          onSelectExercise={handleSelectExercise}
        />
      )}
    </>
  );
}