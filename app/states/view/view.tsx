import React from 'react';
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

import { StateCardSearch } from '../components/StateCardSearch';
import { StateCardSelectable } from '../components/StateCardSelectable';
import { useStatesViewModel } from './viewmodel';

export default function StatesScreen() {
  const { loading, selectedState, selectState, filteredStates, handleNext, form } =
    useStatesViewModel();
  const insets = useSafeAreaInsets();

  const renderStateItem = ({ item }: { item: State }) => (
    <StateCardSearch
      state={item}
      onPress={() => {
        Keyboard.dismiss();
        selectState(item.code);
      }}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
          <Text style={styles.headerTitle}>Portal da Universidade</Text>
          <Text style={styles.headerSubtitle}>Explore as unidades por estado</Text>

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

        <View style={styles.footer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.loading} />
              <Text style={styles.loadingText}>Carregando informações...</Text>
            </View>
          ) : (
            selectedState && <StateCardSelectable state={selectedState} onNext={handleNext} />
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
    paddingBottom: theme.spacing.l,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
    ...theme.shadows.default,
    zIndex: 10,
  },
  headerTitle: {
    ...theme.text.header,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.text.body,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.l,
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
