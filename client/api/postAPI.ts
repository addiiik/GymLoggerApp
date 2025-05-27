import { API_URL } from "@/constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const createSessionAPI = async (sessionName: string, sessionDate?: Date): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      throw new Error('Authentication token not found');
    }

    const requestBody: { sessionName: string; sessionDate?: string } = {
      sessionName
    };

    if (sessionDate) {
      requestBody.sessionDate = sessionDate.toISOString();
    }

    const res = await fetch(`${API_URL}/push/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to create session');
    }

    return data.session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const createExerciseAPI = async (sessionId: string, exerciseName: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      throw new Error('Authentication token not found');
    }

    const res = await fetch(`${API_URL}/push/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId: sessionId,
        exerciseName: exerciseName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to add exercise');
    }

    return data.exercise;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const createSetAPI = async (exerciseId: string, setType: string, weight: number, reps: number): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found');
      throw new Error('Authentication token not found');
    }

    const res = await fetch(`${API_URL}/push/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        exerciseId: exerciseId,
        setType: setType,
        weight: weight,
        reps: reps,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to add set');
    }

    return data.set;
  } catch (error) {
    console.error('Error creating set:', error);
    throw error;
  }
};