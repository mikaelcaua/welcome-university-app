import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { University } from '@/interfaces';
import { theme } from '@/theme';

interface UniversityCardProps {
  university: University;
  onPress: () => void;
}

export function UniversityCard({ university, onPress }: UniversityCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5 name="university" size={18} color={theme.colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{university.name}</Text>
        {university.abbreviation && <Text style={styles.subName}>{university.abbreviation}</Text>}
      </View>

      <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
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
    borderColor: theme.colors.border,
  },
  containerPressed: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.text.title,
    fontSize: 16,
    color: theme.colors.text,
  },
  subName: {
    ...theme.text.caption,
    marginTop: 2,
  },
});
