import React from 'react';
import {
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

import { StateCardSearch } from '../components/StateCardSearch';
import { useStatesViewModel } from './viewmodel';

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
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
          <Text style={styles.headerTitle}>Olá, Universitário!</Text>
          <Text style={styles.headerSubtitle}>Antes de começar, por favor escolha seu estado</Text>

          <FormInput
            control={form.control}
            name="query"
            placeholder="Buscar estado (ex: SP, Amazonas...)"
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
                {!loading && <Text style={styles.emptyText}>Nenhum estado encontrado.</Text>}
              </View>
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
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
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.default,
    zIndex: 10,
  },
  headerTitle: {
    ...theme.text.header,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.text.body,
    color: theme.colors.white,
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.m,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.default,
    marginBottom: theme.spacing.m,
  },
  loadingText: {
    marginTop: theme.spacing.s,
    color: theme.colors.textLight,
    fontSize: 12,
  },
});
