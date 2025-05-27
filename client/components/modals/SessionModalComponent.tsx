import { useRef, useState, useEffect } from "react";
import { BlurView } from 'expo-blur';
import { ActivityIndicator, Animated, Keyboard, 
  Modal, TextInput, TouchableWithoutFeedback, 
  useColorScheme, View } from "react-native";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";

interface SessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSessionSubmit: (sessionName: string) => void;
  isLoading: boolean;
}

export const SessionModal = ({ visible, onClose, onSessionSubmit, isLoading }: SessionModalProps) => {
  const colorScheme = useColorScheme();
  const [sessionName, setSessionName] = useState("");
  const [errors, setErrors] = useState<{ sessionName?: string }>({});
  const inputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const validateForm = () => {
    let newErrors: { sessionName?: string } = {};

    if (!sessionName) {
      newErrors.sessionName = 'Session name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSessionSubmit = () => {
    if (!validateForm()) {
      triggerShake();
      return;
    }

    Keyboard.dismiss();
    onSessionSubmit(sessionName);
  };

  const handleClose = () => {
    setSessionName("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center px-6 pb-12">
          <BlurView intensity={15} tint={colorScheme === 'dark' ? 'dark' : 'light'} className="absolute inset-0" />

          {isLoading && (
            <View className="absolute inset-0 justify-center items-center bg-[#1a1a1a]/90 z-10">
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
          
          <ThemedView isModal className="rounded-lg py-6 px-8 w-full shadow-lg">
            <ThemedText type="subtitle" className="text-center mb-4">
              Session name
            </ThemedText>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }} className={'w-full'}>
              <TextInput 
                ref={inputRef}
                className={`border-2 rounded-lg h-12 pl-3 
                  ${colorScheme === 'light' 
                    ? `${errors.sessionName ? 'border-red-400' : 'border-black/10'} bg-[#f9f9f9] text-[#11181C]` 
                    : `${errors.sessionName ? 'border-red-400' : 'border-white/10'} bg-[#303132] text-[#ECEDEE]`}`}
                value={sessionName}
                onChangeText={setSessionName}
                placeholder={errors.sessionName ? errors.sessionName : "Name your session"}
                placeholderTextColor={errors.sessionName ? "#f87171" : "#bebebe"}
                autoCapitalize="words"
              />
            </Animated.View>
            
            <View className="flex-row justify-between mt-6 px-2">
              <ThemedButton 
                title="Cancel" 
                className="w-32" 
                textClassName="text-base"
                useNativeWindForText={true}
                size="sm"
                variant="outline"
                onPress={handleClose}
              />
              <ThemedButton 
                title="Add" 
                className="w-32"
                textClassName="text-base font-semibold"
                useNativeWindForText={true}
                size="sm"
                variant="primary"
                onPress={handleSessionSubmit}
              />
            </View>
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};