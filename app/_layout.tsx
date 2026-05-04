import { Stack } from 'expo-router';

import { ToastProvider } from '@/lib/toast';

export default function Layout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ToastProvider>
  );
}
