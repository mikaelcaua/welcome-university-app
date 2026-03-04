import { Stack } from 'expo-router';

export default function ProvasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="universities" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="exams" />
    </Stack>
  );
}
