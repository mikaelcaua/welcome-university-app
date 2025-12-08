import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/theme';

interface Option {
  id: number;
  name: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  error?: string;   
  onSelectCallback?: (id: number) => void;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Selecione...',
  options,
  disabled = false,
  error,
  onSelectCallback,
}: FormSelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => {
          const selectedOption = options.find((opt) => opt.id === value);

          return (
            <>
              <Pressable
                style={[
                  styles.input,
                  disabled && styles.disabledInput,
                  error ? styles.inputError : null,
                ]}
                onPress={() => !disabled && setModalVisible(true)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !selectedOption && styles.placeholderText,
                    disabled && styles.disabledText,
                  ]}
                >
                  {selectedOption ? selectedOption.name : placeholder}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </Pressable>

              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>{label || 'Selecione'}</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButton}>Fechar</Text>
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={options}
                      keyExtractor={(item) => String(item.id)}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.optionItem}
                          onPress={() => {
                            onChange(item.id);
                            if (onSelectCallback) onSelectCallback(item.id);
                            setModalVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              value === item.id && styles.selectedOptionText,
                            ]}
                          >
                            {item.name}
                          </Text>
                          {value === item.id && <Text style={styles.checkIcon}>✓</Text>}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>
            </>
          );
        }}
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
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInput: {
    backgroundColor: theme.colors.gray,
    borderColor: theme.colors.gray,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.textLight,
  },
  disabledText: {
    color: theme.colors.black,
  },
  chevron: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    maxHeight: '60%',
    paddingBottom: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.text.title,
  },
  closeButton: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  optionItem: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceAlt,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    ...theme.text.body,
    fontSize: 16,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  checkIcon: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
