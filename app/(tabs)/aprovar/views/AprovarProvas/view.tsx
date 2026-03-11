import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AttachmentPreviewModal, Button, FormSelect } from "@/components";
import { Exam, ExamType } from "@/interfaces";
import { theme } from "@/theme";

import { useExamReviewViewModel } from "./useExamReviewViewModel";

const examTypeLabels: Record<ExamType, string> = {
  EXAM: "Exame",
  PROVA1: "Prova 1",
  PROVA2: "Prova 2",
  PROVA3: "Prova 3",
  RECUPERACAO: "Recuperação",
  FINAL: "Final",
};

export default function AprovarProvasScreen() {
  const insets = useSafeAreaInsets();
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const {
    form,
    states,
    universities,
    courses,
    subjects,
    loadingCascade,
    loading,
    pendingExams,
    isAuthenticated,
    hasReviewPermission,
    hasAppliedFilters,
    onSubmitFilters,
    handleStateSelect,
    handleUniversitySelect,
    handleCourseSelect,
    handleSubjectSelect,
    handleRefreshPending,
    setReviewNote,
    getReviewNote,
    isReviewing,
    handleApprove,
    handleReject,
    hasSelectedState,
    hasSelectedUniversity,
    hasSelectedCourse,
  } = useExamReviewViewModel();

  const contentPaddingBottom = insets.bottom + 128;

  if (!isAuthenticated || !hasReviewPermission) {
    return null;
  }

  const previewFileName = previewExam
    ? previewExam.name ||
      `${previewExam.subjectName} - ${previewExam.examYear}.${previewExam.semester}`
    : "";

  const filtersCard = (
    <View style={styles.filterCard}>
      <FormSelect
        control={form.control}
        name="stateId"
        label="Estado"
        placeholder="Selecione o estado"
        options={states}
        disabled={loadingCascade || loading}
        error={form.formState.errors.stateId?.message}
        onSelectCallback={handleStateSelect}
      />

      <FormSelect
        control={form.control}
        name="universityId"
        label="Universidade"
        placeholder="Selecione a universidade"
        options={universities}
        disabled={!hasSelectedState || loadingCascade || loading}
        error={form.formState.errors.universityId?.message}
        onSelectCallback={handleUniversitySelect}
      />

      <FormSelect
        control={form.control}
        name="courseId"
        label="Curso"
        placeholder="Selecione o curso"
        options={courses}
        disabled={!hasSelectedUniversity || loadingCascade || loading}
        error={form.formState.errors.courseId?.message}
        onSelectCallback={handleCourseSelect}
      />

      <FormSelect
        control={form.control}
        name="subjectId"
        label="Disciplina"
        placeholder="Selecione a disciplina"
        options={subjects}
        disabled={!hasSelectedCourse || loadingCascade || loading}
        error={form.formState.errors.subjectId?.message}
        onSelectCallback={handleSubjectSelect}
      />

      <Button
        title={loading ? "Buscando pendências..." : "Buscar pendências"}
        onPress={onSubmitFilters}
        isLoading={loading}
        disabled={loadingCascade}
      />

      {loadingCascade ? (
        <View style={styles.loadingInline}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Atualizando filtros...</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Aprovar Provas</Text>
        <Text style={styles.subtitle}>Revisão de submissões pendentes</Text>
      </View>

      {hasAppliedFilters ? (
        <FlatList
          data={pendingExams}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: contentPaddingBottom },
          ]}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            void handleRefreshPending();
          }}
          refreshing={loading}
          ListHeaderComponent={
            <View style={styles.listHeaderContent}>
              {filtersCard}
              <View style={styles.listWrapper}>
                <Text style={styles.listTitle}>Pendências encontradas</Text>
                <Text style={styles.listSubtitle}>
                  Puxe para baixo para atualizar após novas submissões.
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.centerCard}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Carregando pendências...</Text>
              </View>
            ) : (
              <View style={styles.centerCard}>
                <Text style={styles.emptyTitle}>Sem pendências</Text>
                <Text style={styles.emptyDescription}>
                  Não há provas pendentes para revisão no momento.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const reviewing = isReviewing(item.id);

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.subjectName}>{item.subjectName}</Text>
                  <Text style={styles.badge}>{examTypeLabels[item.type]}</Text>
                </View>

                <Text style={styles.metadata}>
                  Período {item.examYear}.{item.semester}
                </Text>
                <Text style={styles.metadata}>
                  Enviado por {item.uploadedBy.name}
                </Text>
                <Text style={styles.metadata}>
                  Em {formatDate(item.createdAt)}
                </Text>

                <Button
                  title="Visualizar anexo"
                  variant="outline"
                  onPress={() => setPreviewExam(item)}
                />

                <TextInput
                  value={getReviewNote(item.id)}
                  onChangeText={(note) => setReviewNote(item.id, note)}
                  style={styles.noteInput}
                  placeholder="Observação da revisão (opcional)"
                  placeholderTextColor={theme.colors.textLight}
                  multiline
                  textAlignVertical="top"
                  editable={!reviewing}
                />

                <View style={styles.actionsRow}>
                  <Button
                    title="Rejeitar"
                    variant="outline"
                    onPress={() => {
                      void handleReject(item.id);
                    }}
                    isLoading={reviewing}
                    disabled={reviewing}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Aprovar"
                    onPress={() => {
                      void handleApprove(item.id);
                    }}
                    isLoading={reviewing}
                    disabled={reviewing}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            );
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filtersCard}
        </ScrollView>
      )}

      <AttachmentPreviewModal
        visible={Boolean(previewExam)}
        title="Anexo para revisão"
        fileKind="pdf"
        fileUri={previewExam?.pdfUrl ?? ""}
        fileName={previewFileName}
        actionLabel="Abrir PDF no dispositivo"
        onActionPress={() => {
          if (!previewExam) {
            return;
          }

          void openPdf(previewExam);
        }}
        onClose={() => setPreviewExam(null)}
      />
    </View>
  );
}

async function openPdf(exam: Exam) {
  if (!exam.pdfUrl) {
    return;
  }

  try {
    await Linking.openURL(exam.pdfUrl);
  } catch (error) {
    console.error("Não foi possível abrir o PDF", error);
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "data indisponível";
  }

  return date.toLocaleDateString("pt-BR");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 0,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.text.title,
    fontSize: 20,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.text.caption,
    marginTop: theme.spacing.xs,
    color: theme.colors.textLight,
  },
  content: {
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  filterCard: {
    backgroundColor: "#172554",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.s,
  },
  filterTitle: {
    ...theme.text.title,
    color: theme.colors.text,
  },
  filterSubtitle: {
    ...theme.text.caption,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.s,
  },
  loadingInline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.s,
    marginTop: theme.spacing.s,
  },
  listWrapper: {
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  listTitle: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: "700",
  },
  listSubtitle: {
    ...theme.text.caption,
    color: theme.colors.textLight,
  },
  listContent: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.s,
    gap: theme.spacing.m,
  },
  listHeaderContent: {
    gap: theme.spacing.m,
  },
  card: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    gap: theme.spacing.s,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.s,
  },
  subjectName: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.s,
    overflow: "hidden",
  },
  metadata: {
    ...theme.text.caption,
    color: theme.colors.textLight,
  },
  noteInput: {
    minHeight: 84,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    color: theme.colors.text,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: theme.spacing.s,
  },
  actionButton: {
    flex: 1,
  },
  centerCard: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    alignItems: "center",
    gap: theme.spacing.s,
  },
  loadingText: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  emptyTitle: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: "700",
  },
  emptyDescription: {
    ...theme.text.caption,
    color: theme.colors.textLight,
    textAlign: "center",
  },
});
