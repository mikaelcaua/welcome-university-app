import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormInput } from '@/components';
import { University } from '@/interfaces';
import { theme } from '@/theme';

import { UniversityCard } from '../../components/University/UniversityCard';
import { useUniversityViewModel } from './useUniversityViewModel';

export default function UniversitiesScreen() {
  const { loading, filteredUniversities, form, handleSelectUniversity, goBack } =
    useUniversityViewModel();
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: University }) => (
    <UniversityCard
      university={item}
      onPress={() => {
        Keyboard.dismiss();
        handleSelectUniversity(item.id);
      }}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0D9488" />

        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Instituições</Text>
          </View>
          <Text style={styles.headerSubtitle}>Selecione a universidade onde você estuda.</Text>

          <FormInput
            control={form.control}
            name="query"
            placeholder="Buscar universidade (Ex: UFMA, USP...)"
            iconName="search"
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textLight}
          />
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Buscando instituições...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredUniversities}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma universidade encontrada.</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
    backgroundColor: '#0D9488',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.default,
    zIndex: 10,
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
    fontSize: 28,
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#99F6E4',
    marginBottom: theme.spacing.l,
  },
  searchInput: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#134E4A',
    height: 52,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
    paddingTop: theme.spacing.l,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.m,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});
