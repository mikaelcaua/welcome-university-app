import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { State } from '@/interfaces';
import { theme } from '@/theme';

interface StateCardSearchProps {
  state: State;
  onPress: () => void;
}

export function StateCardSearch({ state, onPress }: StateCardSearchProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{state.code}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{state.name}</Text>

        <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  containerPressed: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.primary,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  badgeText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...theme.text.title,
    fontSize: 16,
    color: theme.colors.text,
  },
});
