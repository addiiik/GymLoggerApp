import { Stack } from "expo-router";
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
        <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        <Stack.Screen name="session" options={{headerShown: false}} />
        <Stack.Screen name="history" options={{headerShown: false}} />
      </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}