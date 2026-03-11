import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { theme } from '@/theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isPrimary ? styles.primaryContainer : styles.outlineContainer,
        pressed && (isPrimary ? styles.primaryPressed : styles.outlinePressed),
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? theme.colors.textInverted : theme.colors.primary} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.outlineText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
  },
  disabled: {
    opacity: 0.6,
  },
  primaryContainer: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  primaryPressed: {
    backgroundColor: theme.colors.secondary,
  },
  primaryText: {
    color: theme.colors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outlinePressed: {
    backgroundColor: theme.colors.surfaceAlt,
  },
  outlineText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
  },
});
