import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FormSelect } from '@/components';
import { theme } from '@/theme';
import { useCourseSubjectViewModel } from './viewmodel';

export default function CourseSubjectScreen() {
  const {
    form,
    courses,
    subjects,
    onSelectCourse,
    onSubmit,
    isCourseSelected,
    loadingCourses,
    loadingSubjects,
  } = useCourseSubjectViewModel();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
        <Text style={styles.headerTitle}>O que você deseja estudar?</Text>
        <Text style={styles.headerSubtitle}>
          Estamos quase lá universitário! Selecione o curso e a matéria para encontrar as provas.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <FormSelect
          control={form.control}
          name="courseId"
          label="Curso"
          placeholder={loadingCourses ? 'Carregando cursos...' : 'Selecione o curso'}
          options={courses}
          disabled={loadingCourses}
          onSelectCallback={onSelectCourse}
          error={form.formState.errors.courseId?.message}
        />
        <FormSelect
          control={form.control}
          name="subjectId"
          label="Disciplina"
          placeholder={
            !isCourseSelected
              ? 'Selecione um curso primeiro'
              : loadingSubjects
              ? 'Carregando disciplinas...'
              : 'Selecione a disciplina'
          }
          options={subjects}
          disabled={!isCourseSelected || loadingSubjects}
          error={form.formState.errors.subjectId?.message}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Buscar Provas"
          onPress={onSubmit}
          isLoading={loadingCourses || loadingSubjects}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.default,
    zIndex: 10,
    marginBottom: theme.spacing.m,
  },
  headerTitle: {
    ...theme.text.header,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  content: {
    padding: theme.spacing.l,
  },
  footer: {
    padding: theme.spacing.l,
    backgroundColor: 'transparent',
  },
});
