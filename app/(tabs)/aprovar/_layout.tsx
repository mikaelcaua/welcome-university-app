import { Redirect, Stack } from 'expo-router';

import { UserRole } from '@/interfaces';
import { useAuthStore } from '@/store';

export default function AprovarLayout() {
  const { hasHydrated, user } = useAuthStore();
  const hasReviewPermission =
    user?.role === UserRole.APPROVER ||
    user?.role === UserRole.ADMIN ||
    user?.role === UserRole.DEV;

  if (!hasHydrated) {
    return null;
  }

  if (!hasReviewPermission) {
    return <Redirect href="/provas" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
