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

import { BrazilMap, FormInput } from '@/components';
import { State } from '@/interfaces';
import { theme } from '@/theme';

import { StateCardSearch } from '../components/StateCardSearch';
import { useStatesViewModel } from './viewmodel';

export default function StatesScreen() {
  const { loading, data, selectState, form, filteredStates, isSearching } = useStatesViewModel();

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
          {isSearching ? (
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item.code}
              renderItem={renderStateItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhum estado encontrado.</Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.mapWrapper}>
              <View style={styles.mapContainer}>
                <BrazilMap onSelectState={selectState} />
              </View>
              <Text style={styles.mapHint}>Toque em um estado no mapa</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.loading} />
              <Text style={styles.loadingText}>Carregando informações...</Text>
            </View>
          )}

          {!loading && data && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultLabel}>Estado Selecionado</Text>
                  <Text style={styles.resultTitle}>{data.name}</Text>
                </View>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultBadgeText}>{data.code}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.jsonContainer}>
                <Text style={styles.resultJson}>{JSON.stringify(data, null, 2)}</Text>
              </View>
            </View>
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
  mapWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '90%',
    aspectRatio: 1,
    maxHeight: 400,
  },
  mapHint: {
    ...theme.text.caption,
    marginTop: theme.spacing.m,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    padding: theme.spacing.m,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  loadingText: {
    marginTop: theme.spacing.s,
    color: theme.colors.textLight,
    fontSize: 12,
  },
  resultCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    ...theme.shadows.strong,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: theme.colors.textLight,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  resultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultBadgeText: {
    color: theme.colors.textInverted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  jsonContainer: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
  },
  resultJson: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: theme.colors.secondary,
  },
});
