import { Modal, TouchableOpacity, TextInput, useColorScheme, ScrollView } from "react-native";
import { Search, X } from "lucide-react-native";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState, useEffect, useCallback } from "react";
import { EXERCISES_BY_GROUP } from "@/constants/Types";

interface ExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exerciseName: string) => void;
}

export const ExerciseModal = ({ visible, onClose, onSelectExercise }: ExerciseModalProps) => {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
    }
  }, [visible]);

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  const handleSelectExercise = useCallback((exerciseName: string) => {
    onSelectExercise(exerciseName);
  }, [onSelectExercise]);

  const formatExerciseName = (value: string) => {
    return value
      .split('_')
      .map((word) => word[0] + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <ThemedView className="flex-1 px-8 py-16">
        <ThemedView className="flex-row justify-between items-center mb-4 mt-4">
          <ThemedText type="title">Choose Exercise</ThemedText>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color={iconColor}/>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView className="flex-row items-center h-14 px-4 rounded-lg mb-6" isModal>
          <Search size={18} color={iconColor}/>
          <TextInput
            placeholder="Search exercises"
            placeholderTextColor={iconColor}
            className={`flex-1 px-3
              ${colorScheme === 'light' 
                    ? `text-[#11181C]` 
                    : `text-[#ECEDEE]`}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize: 15 }}
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color={iconColor} />
            </TouchableOpacity>
          )}
        </ThemedView>

        <ScrollView className="flex-1">
          {Object.entries(EXERCISES_BY_GROUP)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([muscleGroup, exercises]) => {
              const filtered = exercises
                .filter((exerciseName) =>
                  formatExerciseName(exerciseName)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .sort((a, b) =>
                  formatExerciseName(a).localeCompare(formatExerciseName(b)));
              if (filtered.length === 0) return null;

              return (
                <ThemedView key={muscleGroup} className="mb-6">
                  <ThemedText type="subtitle" className="mb-4">
                    {muscleGroup}
                  </ThemedText>
                  {filtered.map((exerciseName) => (
                    <ThemedView
                      key={exerciseName}
                      className="rounded-md mb-3"
                      isModal
                    >
                      <TouchableOpacity
                        onPress={() => {
                          handleSelectExercise(exerciseName);
                          handleClose();
                        }}
                        className="py-3 px-3"
                      >
                        <ThemedText className="font-medium">
                          {formatExerciseName(exerciseName)}
                        </ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  ))}
                </ThemedView>
              );
            })}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};