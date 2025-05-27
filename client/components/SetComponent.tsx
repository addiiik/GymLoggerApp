import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { SetModal } from "./modals/SetModalComponent";
import { useState } from "react";
import { ThemedButton } from "./themed/ThemedButton";
import { ThemedView } from "./themed/ThemedView";
import { Trash2 } from "lucide-react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { deleteSetAPI } from "@/api/deleteAPI";
import { createSetAPI } from "@/api/postAPI";
import { useSessionStore } from "@/stores/useSessionStore";

export type Set = {
  id: string;
  type: "WARMUP" | "REGULAR" | "SUPERSET";
  reps: number;
  weight: number;
};

interface SetComponentProps {
  sets?: Set[];
  exerciseId: string;
  sessionId: string;
  onSetAdded?: (set: Set) => void;
  viewOnly?: boolean;
}

export default function SetComponent({ sets = [], exerciseId, sessionId, onSetAdded, viewOnly = false }: SetComponentProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteSetFromExercise } = useSessionStore();
  let regularSetIndex = 1;

  const handleSetSubmit = async (setData: { setType: string; weight: number; reps: number }) => {
    if (viewOnly) return;
    
    setIsLoading(true);

    try {
      const newSet = await createSetAPI(exerciseId, setData.setType, setData.weight, setData.reps);

      if (onSetAdded) {
        onSetAdded(newSet);
      }

      setModalVisible(false);
    } catch (err: any) {
      console.error('Error adding set:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (viewOnly) return;
    
    try {
      await deleteSetAPI(setId);
      
      deleteSetFromExercise(sessionId, exerciseId, setId);
      
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error deleting set:', error);
      Alert.alert(
        'Error', 
        'Failed to delete set. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <>
      <ScrollView>
        <ThemedView isModal className="p-4 rounded-xl mt-6">
          <ThemedView isModal className="px-2 rounded-xl">
            <View className="flex-row justify-between px-2 py-1">
              <ThemedText className="w-1/3 text-sm font-semibold">Set</ThemedText>
              <ThemedText className="w-1/3 text-sm font-semibold text-center">Reps</ThemedText>
              <ThemedText className="w-1/3 text-sm font-semibold text-right">Weight</ThemedText>
            </View>
          </ThemedView>

          {sets.length > 0 && (
            <View className="mt-2">
              {sets.map((set, index) => {
                let setLabel = "";

                if (set.type === "WARMUP") {
                  setLabel = "W";
                } else if (set.type === "SUPERSET") {
                  setLabel = "S";
                } else {
                  setLabel = String(regularSetIndex++);
                }

                const renderRightActions = () => {
                  if (viewOnly) return null;
                  
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        Alert.alert(
                          "Delete Set",
                          "This action cannot be undone and will affect progress",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => handleDeleteSet(set.id),
                            },
                          ],
                          { cancelable: true }
                        );
                      }}
                      className="flex-1 bg-red-600 justify-center items-center rounded-xl w-20 mb-3"
                    >
                      <Trash2 size={24} color="white" />
                    </TouchableOpacity>
                  );
                };

                const SetContent = (
                  <ThemedView
                    isInsideModal
                    className="p-4 rounded-xl mb-3"
                  >
                    <View className="flex-row justify-between px-2">
                      <ThemedText className="w-1/3 text-sm">{setLabel}</ThemedText>
                      <ThemedText className="w-1/3 text-sm text-center">{set.reps}</ThemedText>
                      <ThemedText className="w-1/3 text-sm text-right">{set.weight}kg</ThemedText>
                    </View>
                  </ThemedView>
                );

                if (viewOnly) {
                  return (
                    <View key={set.id || index}>
                      {SetContent}
                    </View>
                  );
                }

                return (
                  <Swipeable
                    key={set.id || index}
                    renderRightActions={renderRightActions}
                    overshootRight={false}
                  >
                    {SetContent}
                  </Swipeable>
                );
              })}
            </View>
          )}
        </ThemedView>
      </ScrollView>

      {!viewOnly && (
        <ThemedButton 
          title="Add set" 
          className="w-full h-14" 
          textClassName="font-medium"
          onPress={() => setModalVisible(true)}
        />
      )}

      {!viewOnly && (
        <SetModal 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)}
          onSetSubmit={handleSetSubmit}
          isLoading={isLoading}
          exerciseId={exerciseId}
          sets={sets}
        />
      )}
    </>
  );
}