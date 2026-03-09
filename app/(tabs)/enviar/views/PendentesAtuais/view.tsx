import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components';
import { Exam, ExamType } from '@/interfaces';
import { theme } from '@/theme';

import { useCurrentPendingExamsViewModel } from './useCurrentPendingExamsViewModel';

const examTypeLabels: Record<ExamType, string> = {
  EXAM: 'Exame',
  PROVA1: 'Prova 1',
  PROVA2: 'Prova 2',
  PROVA3: 'Prova 3',
  RECUPERACAO: 'Recuperação',
  FINAL: 'Final',
};

export default function CurrentPendingExamsScreen() {
  const insets = useSafeAreaInsets();
  const { loading, pendingExams, isAuthenticated, loadCurrentPendingExams, goBack } =
    useCurrentPendingExamsViewModel();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>Pendentes Atuais</Text>
          <Text style={styles.subtitle}>Minhas provas pendentes de revisão</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerCard}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Buscando pendências...</Text>
        </View>
      ) : (
        <FlatList
          data={pendingExams}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 96 }]}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            void loadCurrentPendingExams();
          }}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.centerCard}>
              <Text style={styles.emptyTitle}>Sem pendências</Text>
              <Text style={styles.emptyDescription}>
                Você não possui provas pendentes no momento.
              </Text>
              <Button title="Voltar para Enviar" variant="outline" onPress={goBack} />
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.subjectName}>{item.subjectName}</Text>
                <Text style={styles.badge}>{examTypeLabels[item.type]}</Text>
              </View>
              <Text style={styles.metadata}>
                Período {item.examYear}.{item.semester}
              </Text>
              <Text style={styles.metadata}>Status: {item.status}</Text>
              <Text style={styles.metadata}>Enviado em {formatDate(item.createdAt)}</Text>

              <Pressable
                onPress={() => {
                  void openPdf(item);
                }}
                style={({ pressed }) => [
                  styles.openPdfButton,
                  pressed ? styles.openPdfButtonPressed : null,
                ]}
              >
                <Text style={styles.openPdfText}>Abrir PDF</Text>
              </Pressable>
            </View>
          )}
        />
      )}
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
    console.error('Não foi possível abrir o PDF', error);
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'data indisponível';
  }

  return date.toLocaleDateString('pt-BR');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.m,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  backText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '300',
  },
  title: {
    ...theme.text.title,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.text.caption,
  },
  listContent: {
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.m,
    gap: theme.spacing.s,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  subjectName: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.s,
    overflow: 'hidden',
  },
  metadata: {
    ...theme.text.caption,
    color: theme.colors.textLight,
  },
  openPdfButton: {
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    alignSelf: 'flex-start',
  },
  openPdfButtonPressed: {
    backgroundColor: theme.colors.primaryLight,
  },
  openPdfText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  centerCard: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  loadingText: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  emptyTitle: {
    ...theme.text.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  emptyDescription: {
    ...theme.text.caption,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});
