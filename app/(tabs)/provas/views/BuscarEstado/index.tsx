import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormInput } from '@/components';
import { State } from '@/interfaces';
import { theme } from '@/theme';

import { StateCardSearch } from '../../components/State/StateCardSearch';
import { useStatesViewModel } from './useStatesViewModel';

export default function StatesScreen() {
  const { loading, selectState, filteredStates, form } = useStatesViewModel();
  const insets = useSafeAreaInsets();

  const renderStateItem = ({ item }: { item: State }) => (
    <StateCardSearch
      state={item}
      onPress={() => {
        Keyboard.dismiss();
        selectState(item.id);
      }}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor="#1FA866" />

        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
          <Text style={styles.headerTitle}>Olá, Universitário!</Text>
          <Text style={styles.headerSubtitle}>Para começar, encontre seu estado abaixo.</Text>

          <FormInput
            control={form.control}
            name="query"
            placeholder="Buscar estado (ex: SP, Maranhão...)"
            iconName="search"
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textLight}
          />
        </View>

        <View style={styles.content}>
          <FlatList
            data={filteredStates}
            keyExtractor={(item) => item.code}
            renderItem={renderStateItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {!loading && (
                  <Text style={styles.emptyText}>
                    Nenhum estado encontrado.{'\n'}Tente outra busca.
                  </Text>
                )}
              </View>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.white} />
            <Text style={styles.loadingTextOverlay}>Carregando estados...</Text>
          </View>
        )}
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
    backgroundColor: '#1FA866',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.default,
    zIndex: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#86EFAC',
    marginBottom: theme.spacing.l,
    lineHeight: 24,
  },
  searchInput: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#14532D',
    height: 52,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
    paddingTop: theme.spacing.l,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 18, 32, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  loadingTextOverlay: {
    marginTop: theme.spacing.m,
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
