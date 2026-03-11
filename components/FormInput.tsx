import { MaterialIcons } from '@expo/vector-icons';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '@/theme';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'style'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  error,
  style,
  iconName,
  ...rest
}: FormInputProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={[
              styles.inputContainer,
              error ? styles.inputError : null,
              style, // Agora o TS sabe que isso é um ViewStyle
            ]}
          >
            {iconName && (
              <MaterialIcons
                name={iconName}
                size={20}
                color={theme.colors.textLight}
                style={styles.icon}
              />
            )}

            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.colors.textLight}
              {...rest}
            />
          </View>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    width: '100%',
  },
  label: {
    ...theme.text.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 50,
    paddingHorizontal: theme.spacing.m,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    height: '100%',
  },
  icon: {
    marginRight: theme.spacing.s,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
