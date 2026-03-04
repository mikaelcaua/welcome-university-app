import { Stack } from 'expo-router';

export default function ProvasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(state)/(buscarestado)/index" />
      <Stack.Screen name="(university)/(buscaruniversidade)/universities" />
      <Stack.Screen name="(course_and_subject)/(cursoedisciplina)/courses" />
      <Stack.Screen name="(exam)/(listarprovas)/exams" />
    </Stack>
  );
}
