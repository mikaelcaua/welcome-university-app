import {
  ActivityIndicator,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/theme';

import { ExamCard } from '../components/ExamCard';
import { useExamsViewModel } from './viewmodel';

export default function ExamsScreen() {
  const { loading, sections, goBack } = useExamsViewModel();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.s }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Provas e Exames</Text>
          <Text style={styles.headerSubtitle}>Material de estudo disponível</Text>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.loading} />
            <Text style={styles.loadingText}>Buscando provas...</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            renderItem={({ item, index }) => <ExamCard exam={item} index={index} />}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionLine} />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Nenhuma prova encontrada para esta disciplina.</Text>
              </View>
            }
          />
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    zIndex: 10,
  },
  backButton: {
    marginRight: theme.spacing.m,
    padding: theme.spacing.xs,
  },
  backText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '300',
  },
  headerTitle: {
    ...theme.text.title,
    fontSize: 18,
  },
  headerSubtitle: {
    ...theme.text.caption,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  // Estilos da Seção (Divisor de Anos)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  sectionTitle: {
    ...theme.text.title,
    fontSize: 14,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.s,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.s,
    color: theme.colors.textLight,
  },
  emptyText: {
    ...theme.text.body,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});
