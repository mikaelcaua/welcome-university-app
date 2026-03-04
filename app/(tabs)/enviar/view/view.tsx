import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, FormInput, FormSelect } from '@/components';
import { theme } from '@/theme';

import { useExamSubmissionViewModel } from './useExamSubmissionViewModel';

export default function ExamSubmissionScreen() {
  const insets = useSafeAreaInsets();
  const {
    form,
    user,
    states,
    subjects,
    courses,
    universities,
    loadingCascade,
    isSubmitting,
    isAuthenticated,
    semesterOptions,
    examTypeOptions,
    handleStateSelect,
    handleUniversitySelect,
    handleCourseSelect,
    goToProfile,
    onSubmit,
    hasSelectedState,
    hasSelectedUniversity,
    hasSelectedCourse,
  } = useExamSubmissionViewModel();

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />
        <View style={styles.lockedWrapper}>
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>ENVIAR</Text>
            <Text style={styles.title}>Envio protegido por autenticação</Text>
            <Text style={styles.subtitle}>
              Apenas usuários autenticados podem anexar provas em PDF. Faça
              login na tab `Perfil` para liberar o formulário completo.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Caso de uso coberto</Text>
            <Text style={styles.infoText}>
              A submissão envia nome, ano, semestre, tipo, disciplina e arquivo
              PDF. A API cria a prova com status `PENDING`.
            </Text>
          </View>

          <Button title="Ir para Perfil" onPress={goToProfile} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>ENVIAR</Text>
          <Text style={styles.title}>Submeta uma prova em PDF</Text>
          <Text style={styles.subtitle}>
            Sessão ativa para {user?.name || 'usuário autenticado'}. Preencha os
            campos e envie o PDF para revisão.
          </Text>
        </View>

        <View style={styles.formCard}>
          <FormSelect
            control={form.control}
            name="stateId"
            label="Estado"
            placeholder="Selecione o estado"
            options={states}
            disabled={loadingCascade}
            error={form.formState.errors.stateId?.message}
            onSelectCallback={handleStateSelect}
          />

          <FormSelect
            control={form.control}
            name="universityId"
            label="Universidade"
            placeholder="Selecione a universidade"
            options={universities}
            disabled={!hasSelectedState || loadingCascade}
            error={form.formState.errors.universityId?.message}
            onSelectCallback={handleUniversitySelect}
          />

          <FormSelect
            control={form.control}
            name="courseId"
            label="Curso"
            placeholder="Selecione o curso"
            options={courses}
            disabled={!hasSelectedUniversity || loadingCascade}
            error={form.formState.errors.courseId?.message}
            onSelectCallback={handleCourseSelect}
          />

          <FormSelect
            control={form.control}
            name="subjectId"
            label="Disciplina"
            placeholder="Selecione a disciplina"
            options={subjects}
            disabled={!hasSelectedCourse || loadingCascade}
            error={form.formState.errors.subjectId?.message}
          />

          <FormInput
            control={form.control}
            name="name"
            label="Nome da prova"
            placeholder="Ex: Cálculo II - P2"
            iconName="description"
            error={form.formState.errors.name?.message}
          />

          <FormInput
            control={form.control}
            name="examYear"
            label="Ano"
            placeholder="2025"
            keyboardType="numeric"
            iconName="calendar-today"
            error={form.formState.errors.examYear?.message}
          />

          <FormSelect
            control={form.control}
            name="semester"
            label="Semestre"
            placeholder="Selecione o semestre"
            options={semesterOptions}
            disabled={loadingCascade}
            error={form.formState.errors.semester?.message}
          />

          <FormSelect
            control={form.control}
            name="type"
            label="Tipo"
            placeholder="Selecione o tipo"
            options={examTypeOptions}
            disabled={loadingCascade}
            error={form.formState.errors.type?.message}
          />

          <FormInput
            control={form.control}
            name="fileName"
            label="Nome do arquivo"
            placeholder="prova-calculo-2-p2.pdf"
            iconName="attach-file"
            error={form.formState.errors.fileName?.message}
          />

          <FormInput
            control={form.control}
            name="pdfUri"
            label="URL ou URI do PDF"
            placeholder="https://.../arquivo.pdf"
            iconName="link"
            autoCapitalize="none"
            error={form.formState.errors.pdfUri?.message}
          />
        </View>

        <Button
          title={isSubmitting ? 'Enviando prova...' : 'Enviar prova'}
          onPress={onSubmit}
          isLoading={isSubmitting}
        />

        {loadingCascade ? (
          <View style={styles.loadingInline}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Atualizando filtros...</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.l,
    paddingBottom: 132,
    gap: theme.spacing.l,
  },
  lockedWrapper: {
    flex: 1,
    padding: theme.spacing.l,
    justifyContent: 'center',
    gap: theme.spacing.l,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.s,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.text.body,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.s,
  },
  infoTitle: {
    ...theme.text.title,
    fontSize: 18,
  },
  infoText: {
    ...theme.text.body,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  loadingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s,
  },
  loadingText: {
    color: theme.colors.textLight,
  },
});
