import { API_URL } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const deleteSessionAPI = async (sessionId: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }
    
    const res = await fetch(`${API_URL}/drop/session`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId: sessionId
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to delete session');
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

export const deleteExerciseAPI = async (exerciseId: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    const response = await fetch(`${API_URL}/drop/exercise`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId: exerciseId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete exercise');
    }
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};

export const deleteSetAPI = async (setId: string): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      return;
    }

    const response = await fetch(`${API_URL}/drop/set`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        setId: setId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete set');
    }
  } catch (error) {
    console.error('Error deleting set:', error);
    throw error;
  }
};