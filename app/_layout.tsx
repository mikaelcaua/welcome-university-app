import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="state/view/view">
      <Stack.Screen name="state/view/view" options={{ headerShown: false }} />
      <Stack.Screen name="university/view/view" options={{ headerShown: false }} />
      <Stack.Screen name="course_and_subject/view/view" options={{ headerShown: false }} />
      <Stack.Screen name="exam/view/view" options={{ headerShown: false }} />
    </Stack>
  );
}
