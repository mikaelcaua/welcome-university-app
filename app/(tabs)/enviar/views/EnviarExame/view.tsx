import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, FormInput, FormSelect } from "@/components";
import { theme } from "@/theme";

import { useExamSubmissionViewModel } from "./useExamSubmissionViewModel";

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
    handlePickImage,
    handlePickPdf,
    clearSelectedFile,
    goToProfile,
    onSubmit,
    hasSelectedState,
    hasSelectedUniversity,
    hasSelectedCourse,
    hasSelectedAttachment,
    selectedFileName,
    selectedFileKind,
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
            <Text style={styles.subtitle}>
              Apenas usuários autenticados podem anexar provas em foto ou PDF.
              Faça login na tab `Perfil` para liberar o formulário completo.
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
          <Text style={styles.title}>Submeta uma prova</Text>
          <Text style={styles.subtitle}>
            Sessão ativa para {user?.name || "usuário autenticado"}. Preencha os
            campos e anexe uma foto da galeria ou um PDF para revisão.
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

          <View style={styles.attachmentSection}>
            <Text style={styles.attachmentLabel}>Anexo</Text>
            <Text style={styles.attachmentDescription}>
              Escolha uma foto da galeria ou um PDF do dispositivo.
            </Text>

            <View style={styles.attachmentActions}>
              <Button
                title="Escolher foto"
                variant="outline"
                onPress={handlePickImage}
              />
              <Button
                title="Escolher PDF"
                variant="outline"
                onPress={handlePickPdf}
              />
            </View>

            {hasSelectedAttachment ? (
              <View style={styles.attachmentCard}>
                <View style={styles.attachmentMeta}>
                  <MaterialIcons
                    name={
                      selectedFileKind === "pdf" ? "picture-as-pdf" : "image"
                    }
                    size={22}
                    color={
                      selectedFileKind === "pdf"
                        ? theme.colors.pdf
                        : theme.colors.primary
                    }
                  />
                  <View style={styles.attachmentTextWrapper}>
                    <Text style={styles.attachmentName}>
                      {selectedFileName}
                    </Text>
                    <Text style={styles.attachmentHint}>
                      {selectedFileKind === "pdf"
                        ? "PDF selecionado para envio"
                        : "Imagem selecionada para envio"}
                    </Text>
                  </View>
                </View>

                <Button
                  title="Remover anexo"
                  variant="outline"
                  onPress={clearSelectedFile}
                />
              </View>
            ) : (
              <View style={styles.attachmentEmptyState}>
                <MaterialIcons
                  name="attach-file"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text style={styles.attachmentEmptyText}>
                  Nenhum arquivo anexado ainda.
                </Text>
              </View>
            )}

            {form.formState.errors.fileUri?.message ? (
              <Text style={styles.attachmentError}>
                {form.formState.errors.fileUri.message}
              </Text>
            ) : null}
          </View>
        </View>

        <Button
          title={isSubmitting ? "Enviando prova..." : "Enviar prova"}
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
    justifyContent: "center",
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
    fontWeight: "700",
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
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
  attachmentSection: {
    gap: theme.spacing.s,
  },
  attachmentLabel: {
    ...theme.text.body,
    fontWeight: "600",
    color: theme.colors.text,
  },
  attachmentDescription: {
    ...theme.text.caption,
  },
  attachmentActions: {
    gap: theme.spacing.s,
  },
  attachmentCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.surfaceAlt,
    padding: theme.spacing.m,
    gap: theme.spacing.m,
  },
  attachmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s,
  },
  attachmentTextWrapper: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  attachmentName: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  attachmentHint: {
    ...theme.text.caption,
  },
  attachmentEmptyState: {
    minHeight: 56,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  attachmentEmptyText: {
    color: theme.colors.textLight,
  },
  attachmentError: {
    color: theme.colors.error,
    fontSize: 12,
    marginLeft: theme.spacing.xs,
  },
  loadingInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s,
  },
  loadingText: {
    color: theme.colors.textLight,
  },
});
