import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSessionStore } from "@/stores/useSessionStore";
import { SessionModal } from "@/components/modals/SessionModalComponent";
import { ChevronRight } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { deleteSessionAPI } from "@/api/deleteAPI";
import { createSessionAPI } from "@/api/postAPI";

interface SessionComponentProps {
  selectedDate: Date;
  viewOnly?: boolean;
}

export function SessionComponent({ selectedDate, viewOnly = false }: SessionComponentProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { sessions, setSessions } = useSessionStore();
  const iconColor = useThemeColor({}, 'icon');

  const isOnSelectedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const selected = new Date(selectedDate);
    
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  }, [selectedDate]);

  const selectedDateSessions = sessions?.filter((session) => isOnSelectedDate(session.time)) || [];

  const getSessionStats = useCallback((session: any) => {
    if (!session.exercises || session.exercises.length === 0) {
      return null;
    }

    const exerciseCount = session.exercises.length;
    const totalSets = session.exercises.reduce((total: number, exercise: any) => {
      return total + (exercise.sets ? exercise.sets.length : 0);
    }, 0);

    return {
      exerciseCount,
      totalSets
    };
  }, []);

  const formatSessionStats = (stats: { exerciseCount: number; totalSets: number } | null) => {
    if (!stats) return '';
    
    const exerciseText = stats.exerciseCount === 1 ? 'exercise' : 'exercises';
    const setText = stats.totalSets === 1 ? 'set' : 'sets';
    
    if (stats.totalSets === 0) {
      return `${stats.exerciseCount} ${exerciseText}`;
    }
    
    return `${stats.exerciseCount} ${exerciseText} • ${stats.totalSets} ${setText}`;
  };

  const handleSessionSubmit = async (sessionName: string) => {
    if (viewOnly) return;
    
    setIsLoading(true);
    
    try {
      const newSession = await createSessionAPI(sessionName, selectedDate);
      setSessions([...(sessions || []), newSession]);
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionPress = (session: any) => {
    if (viewOnly) {
      router.push(`/session/${session.id}?viewOnly=true`);
    } else {
      router.push(`/session/${session.id}`);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (viewOnly) return;
    
    try {
      await deleteSessionAPI(sessionId);
      
      const { deleteSession } = useSessionStore.getState();
      deleteSession(sessionId);
      
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      Alert.alert(
        'Error', 
        'Failed to delete session. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <>
      <ScrollView>
        {selectedDateSessions.length > 0 ? (
          <View className="mt-6">
            {selectedDateSessions.map((session) => {
              const stats = getSessionStats(session);

              const renderRightActions = () => {
                if (viewOnly) return null;
                
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      Alert.alert(
                        "Delete Session",
                        "This action cannot be undone and will affect progress",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => handleDeleteSession(session.id),
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

              const SessionContent = (
                <TouchableOpacity 
                  onPress={() => handleSessionPress(session)}
                  activeOpacity={0.7}
                >
                  <ThemedView 
                    isModal 
                    className="p-4 rounded-xl mb-6 flex-row justify-between items-center"
                  >
                    <View className="flex-1 pl-2">
                      <ThemedText type="subtitle" className="mb-1">{session.name}</ThemedText>
                      {stats && (
                        <ThemedText className="text-sm opacity-70">
                          {formatSessionStats(stats)}
                        </ThemedText>
                      )}
                    </View>
                    <ChevronRight size={20} className="text-white" color={iconColor} />
                  </ThemedView>
                </TouchableOpacity>
              );

              if (viewOnly) {
                return (
                  <View key={session.id}>
                    {SessionContent}
                  </View>
                );
              }

              return (
                <Swipeable
                  key={session.id}
                  renderRightActions={renderRightActions}
                  overshootRight={false}
                >
                  {SessionContent}
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
          title="Add session" 
          className="w-full h-14 mb-14" 
          textClassName="font-medium"
          onPress={() => setModalVisible(true)}
        />
      )}

      {!viewOnly && (
        <SessionModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSessionSubmit={handleSessionSubmit}
          isLoading={isLoading}
        />
      )}
    </>
  );
}