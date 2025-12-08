import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components';
import { State } from '@/interfaces';
import { theme } from '@/theme';

interface StateCardSelectableProps {
  state: State;
  onNext: () => void;
}

export function StateCardSelectable({ state, onNext }: StateCardSelectableProps) {
  return (
    <View style={styles.container}>
      {/* Header do Card */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Estado Selecionado</Text>
          <Text style={styles.name}>{state.name}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{state.code}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Button title="Confirmar e Avançar" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    ...theme.shadows.strong,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: theme.colors.textLight,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  name: {
    ...theme.text.header,
    fontSize: 22,
    color: theme.colors.text,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.l,
  },
});
