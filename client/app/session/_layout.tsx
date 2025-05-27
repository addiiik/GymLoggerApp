import { Stack } from "expo-router";

export default function SessionStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
