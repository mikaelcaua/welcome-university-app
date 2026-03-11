import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FormSelect } from '@/components';
import { theme } from '@/theme';

import { useCourseSubjectViewModel } from './useCourseSubjectViewModel';

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
    goBack,
  } = useCourseSubjectViewModel();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="#C2410C" />

      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>O que você estuda?</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Filtre por curso e disciplina para encontrar as provas exatas.
        </Text>
      </View>

      <View style={styles.formCardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <FormSelect
              control={form.control}
              name="courseId"
              label="SELECIONE O CURSO"
              placeholder={loadingCourses ? 'Carregando cursos...' : 'Toque para escolher...'}
              options={courses}
              disabled={loadingCourses}
              onSelectCallback={onSelectCourse}
              error={form.formState.errors.courseId?.message}
            />
          </View>

          <View style={styles.formSection}>
            <FormSelect
              control={form.control}
              name="subjectId"
              label="SELECIONE A DISCIPLINA"
              placeholder={
                !isCourseSelected
                  ? 'Escolha um curso acima primeiro'
                  : loadingSubjects
                    ? 'Carregando disciplinas...'
                    : 'Toque para escolher...'
              }
              options={subjects}
              disabled={!isCourseSelected || loadingSubjects}
              error={form.formState.errors.subjectId?.message}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button
          title="Ver Provas Disponíveis"
          onPress={onSubmit}
          isLoading={loadingCourses || loadingSubjects}
          style={styles.searchButton}
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
    paddingBottom: theme.spacing.xxl + 20,
    backgroundColor: '#C2410C',
    zIndex: 0,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  backButton: {
    marginRight: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },
  backText: {
    fontSize: 22,
    color: theme.colors.white,
    fontWeight: '500',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FDBA74',
    lineHeight: 22,
    maxWidth: '90%',
  },
  formCardContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -theme.spacing.xl,
    ...theme.shadows.strong,
    paddingTop: theme.spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: 100,
  },
  formSection: {
    marginBottom: theme.spacing.l,
  },
  footer: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  searchButton: {
    height: 56,
    backgroundColor: '#EA580C',
  },
});
