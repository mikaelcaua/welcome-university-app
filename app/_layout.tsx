import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="states/view/view">
      <Stack.Screen name="states/view/view" options={{ headerShown: false }} />
    </Stack>
  );
}
