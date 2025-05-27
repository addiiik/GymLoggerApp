import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import "../globals.css"

export default function Authayout() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace("/(tabs)");
    }
  }, [token]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{headerShown: false, animation: "none"}} />
      <Stack.Screen name="register" options={{headerShown: false, animation: "none"}} />
    </Stack>

  );
}
