import { Stack } from 'expo-router';

export default function EnviarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(enviarexame)/view" />
    </Stack>
  );
}
