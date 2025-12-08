import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { BrazilMap, FormInput } from '@/components';
import { State } from '@/interfaces';
import { theme } from '@/theme';

import { useStatesViewModel } from './viewmodel';

export default function StatesScreen() {
  const { loading, data, selectState, form, filteredStates, isSearching } = useStatesViewModel();

  const renderStateItem = ({ item }: { item: State }) => (
    <Pressable
      style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
      onPress={() => {
        Keyboard.dismiss();
        selectState(item.code);
      }}
    >
      <View style={styles.codeBadge}>
        <Text style={styles.codeText}>{item.code}</Text>
      </View>
      <Text style={styles.stateName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bem-vindo à Universidade</Text>
          <Text style={styles.headerSubtitle}>Selecione um estado no mapa ou busque abaixo</Text>

          <FormInput
            control={form.control}
            name="query"
            placeholder="Buscar estado (Ex: SP, Bahia...)"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.content}>
          {isSearching ? (
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item.code}
              renderItem={renderStateItem}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum estado encontrado.</Text>}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.mapContainer}>
              <BrazilMap onSelectState={selectState} />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {loading && <ActivityIndicator size="large" color={theme.colors.loading} />}

          {!loading && data && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>{data.name}</Text>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultBadgeText}>{data.code}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.resultJson}>{JSON.stringify(data, null, 2)}</Text>
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
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 10,
  },
  headerTitle: {
    ...theme.text.title,
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...theme.text.body,
    color: '#666',
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    backgroundColor: '#F0F2F5',
    borderWidth: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  mapContainer: {
    width: '100%',
    aspectRatio: 0.95,
    maxHeight: 500,
    alignSelf: 'center',
  },
  listContent: {
    padding: theme.spacing.m,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    elevation: 2,
  },
  listItemPressed: {
    backgroundColor: '#F0F0F0',
  },
  codeBadge: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  codeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  stateName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
  footer: {
    padding: theme.spacing.m,
  },
  resultCard: {
    backgroundColor: '#FFF',
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  resultBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultBadgeText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: theme.spacing.s,
  },
  resultJson: {
    ...theme.text.body,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#555',
  },
});
