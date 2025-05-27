import React, { useCallback, useState, useEffect } from "react";
import { BlurView } from 'expo-blur';
import { Keyboard, Modal, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { SET_TYPES } from "@/constants/Types";
import { DropDownComponent } from "../ui/DropDownComponent";
import { NumberPickerComponent } from "../ui/NumberPickerComponent";
import { Set } from "@/components/SetComponent";

interface SetModalProps {
  visible: boolean;
  onClose: () => void;
  onSetSubmit: (setData: { setType: string; weight: number; reps: number }) => Promise<void>;
  isLoading?: boolean;
  exerciseId: string;
  sets: Set[];
}

export const SetModal = ({ 
  visible, 
  onClose, 
  onSetSubmit, 
  isLoading = false,
  sets 
}: SetModalProps) => {
  const colorScheme = useColorScheme();
  const [setType, setSetType] = useState("REGULAR");
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(10);
  const [showSetTypeDropdown, setShowSetTypeDropdown] = useState(false);

  const getDefaultValues = useCallback(() => {
    if (sets.length > 0) {
      const lastSet = sets[sets.length - 1];
      return {
        weight: lastSet.weight,
        reps: lastSet.reps
      };
    }
    return {
      weight: 20,
      reps: 10
    };
  }, [sets]);

  useEffect(() => {
    if (visible) {
      const defaults = getDefaultValues();
      setWeight(defaults.weight);
      setReps(defaults.reps);
    }
  }, [visible, getDefaultValues]);

  const handleSetSubmit = useCallback(async () => {
    Keyboard.dismiss();
    
    try {
      await onSetSubmit({
        setType,
        weight,
        reps
      });
      
      handleClose();
    } catch (error) {}
  }, [setType, weight, reps, onSetSubmit]);

  const handleClose = useCallback(() => {
    setSetType("REGULAR");
    setShowSetTypeDropdown(false);
    onClose();
  }, [onClose]);

  const formatSetTypeLabel = useCallback((type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }, []);

  const handleDropdownToggle = useCallback(() => {
    setShowSetTypeDropdown(!showSetTypeDropdown);
  }, [showSetTypeDropdown]);

  const handleBackdropPress = useCallback(() => {
    if (showSetTypeDropdown) {
      setShowSetTypeDropdown(false);
    }
  }, [showSetTypeDropdown]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 justify-center px-6 pb-12">
          <BlurView 
            intensity={15} 
            tint={colorScheme === 'dark' ? 'dark' : 'light'} 
            className="absolute inset-0" 
          />

          <ThemedView isModal className="rounded-lg py-6 px-8 w-full shadow-lg">
            <ThemedText type="subtitle" className="text-center mb-6">
              Add Set
            </ThemedText>

            <View className="mb-6">
              <ThemedText className="mb-3 font-medium text-center">Set Type</ThemedText>
              <DropDownComponent
                value={setType}
                options={SET_TYPES}
                onValueChange={setSetType}
                isOpen={showSetTypeDropdown}
                onToggle={handleDropdownToggle}
                formatLabel={formatSetTypeLabel}
              />
            </View>

            <View className="flex-row justify-between items-center mb-8">
              <View className="flex-1 mr-4">
                <ThemedText className="mb-3 font-medium text-center">Weight</ThemedText>
                <View>
                  <NumberPickerComponent
                    value={weight}
                    onValueChange={setWeight}
                    min={1}
                    max={300}
                    suffix="kg"
                  />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <ThemedText className="mb-3 font-medium text-center">Reps</ThemedText>
                <View>
                  <NumberPickerComponent
                    value={reps}
                    onValueChange={setReps}
                    min={1}
                    max={25}
                    step={1}
                  />
                </View>
              </View>
            </View>
            
            <View className="flex-row justify-between px-2">
              <ThemedButton 
                title="Cancel" 
                className="w-32" 
                textClassName="text-base"
                useNativeWindForText={true}
                size="sm"
                variant="outline"
                onPress={handleClose}
                disabled={isLoading}
              />
              <ThemedButton 
                title="Add"
                className="w-32"
                textClassName="text-base font-semibold"
                useNativeWindForText={true}
                size="sm"
                variant="primary"
                onPress={handleSetSubmit}
                disabled={isLoading}
              />
            </View>
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};