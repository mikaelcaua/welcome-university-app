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
import { University } from '@/interfaces';
import { theme } from '@/theme';
import { UniversityCard } from '../components/UniversityCard';

import { useUniversityViewModel } from './viewmodel';

export default function UniversitiesScreen() {
  const { loading, filteredUniversities, form, handleSelectUniversity } = useUniversityViewModel();
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
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.m }]}>
          <Text style={styles.headerTitle}>Instituições</Text>
          <Text style={styles.headerSubtitle}>Selecione a universidade de sua preferência</Text>

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
              <ActivityIndicator size="large" color={theme.colors.loading} />
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
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
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
    color: theme.colors.blue[100], 
    marginBottom: theme.spacing.m,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 0,
    ...theme.shadows.soft,
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
    ...theme.text.body,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.text.body,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});
