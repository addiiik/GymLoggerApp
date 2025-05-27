import { ExerciseModal } from "@/components/modals/ExerciseModalComponent";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useCallback, useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSessionStore } from "@/stores/useSessionStore";
import { useFocusEffect } from "expo-router";

interface ProgressDataPoint {
  sessionId: string;
  date: string;
  weight: number;
  formattedDate: string;
}

export default function ProgressScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([]);

  const { sessions } = useSessionStore();
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const screenWidth = Dimensions.get("window").width;
  
  useFocusEffect(
  useCallback(() => {
    return () => {
      setSelectedExercise(null);
    };
  }, [])
);

  const processProgressData = (exerciseName: string): ProgressDataPoint[] => {
    if (!sessions) return [];

    const result: ProgressDataPoint[] = [];

    sessions.forEach(session => {
      const sessionDate = new Date(session.time);
      const formattedDate = sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let sessionMaxWeight: number | null = null;

      session.exercises.forEach(exercise => {
        if (exercise.name === exerciseName && exercise.sets?.length) {
          const maxWeight = Math.max(...exercise.sets.map((set: any) => set.weight || 0));
          sessionMaxWeight = sessionMaxWeight !== null ? Math.max(sessionMaxWeight, maxWeight) : maxWeight;
        }
      });

      if (sessionMaxWeight !== null) {
        result.push({
          sessionId: session.id || session.time,
          date: sessionDate.toISOString(),
          weight: sessionMaxWeight,
          formattedDate,
        });
      }
    });

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    const data = processProgressData(exerciseName);
    setProgressData(data);
    setModalVisible(false);
  };

  const formatExerciseName = (exerciseName: string) =>
    exerciseName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  const renderChart = () => {
    if (progressData.length === 0) {
      return (
        <View className="flex-1 justify-center">
          <ThemedText className="text-center opacity-70">
            No data available for this exercise
          </ThemedText>
        </View>
      );
    }

    if (progressData.length === 1) {
      return (
        <View className="flex-1 justify-center">
          <ThemedText className="text-center opacity-70">
            Need more data to show progress
          </ThemedText>
        </View>
      );
    }

    const chartData = {
      labels: progressData.map(p => p.formattedDate),
      datasets: [
        {
          data: progressData.map(p => p.weight),
          color: (opacity = 1) => `rgba(192, 192, 192, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };

    return (
      <View className="mt-8">
        <ThemedText type="subtitle" className="mb-8 text-center">
          {formatExerciseName(selectedExercise!)}
        </ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 64, progressData.length * 60)}
            height={280}
            yAxisLabel=""
            yAxisSuffix="kg"
            yAxisInterval={2.5}
            fromZero={false}
            chartConfig={{
              backgroundColor,
              backgroundGradientFrom: backgroundColor,
              backgroundGradientTo: backgroundColor,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(192, 192, 192, ${opacity})`,
              labelColor: (opacity = 1) => textColor,
              style: { borderRadius: 16 },
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#C0C0C0" },
              propsForLabels: { fontSize: 12 },
            }}
          />
        </ScrollView>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <View className="px-8 pt-16 pb-4">
        <ThemedText type="title" className="mt-6">
          Progress
        </ThemedText>
      </View>

      <View className="flex-1 px-8">
        {selectedExercise ? renderChart() : (
          <View className="flex-1 justify-center">
            <ThemedText className="text-center opacity-70 mb-8">
              Select an exercise to view your progress
            </ThemedText>
          </View>
        )}
      </View>

      <View className="px-8 pb-14 mb-16">
        <ThemedButton
          title={selectedExercise ? "Change Exercise" : "Select Exercise"}
          className="w-full h-14"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <ExerciseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectExercise={handleSelectExercise}
      />
    </ThemedView>
  );
}
