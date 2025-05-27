import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { useUserStore } from '@/stores/useUserStore';
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

export default function UserScreen() {
  const { user } = useUserStore();
  const { logout } = useAuth();

  const navigateToHistory = () => {
    router.push("/history");
  };

  return (
    <ThemedView className="flex-1 px-8 py-16 justify-between">
      <ThemedView>
        <ThemedText type="title" className="mt-6">
          {user?.firstName} {user?.lastName}
        </ThemedText>
        <ThemedText type="default" className="mt-2" useNativeWind={true}>
          {user?.email}
        </ThemedText>
      </ThemedView>

      <ThemedView>
        <ThemedButton title="History" textClassName="font-medium" onPress={navigateToHistory}/>
        <ThemedButton
          title="Log out"
          onPress={logout}
          className="w-full h-14 mb-14 mt-6"
          textClassName="font-medium text-lg"
          variant="outline"
        />
      </ThemedView>
    </ThemedView>
  );
}
