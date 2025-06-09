import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    // Envuelve toda tu navegación con SafeAreaProvider
    <SafeAreaProvider>
      <Stack >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}