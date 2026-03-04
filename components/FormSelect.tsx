import { theme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Option {
  id: number | string;
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
  onSelectCallback?: (id: Option["id"]) => void;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione...",
  options,
  disabled = false,
  error,
  onSelectCallback,
}: FormSelectProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  function handleClose() {
    setModalVisible(false);
    setSearchQuery("");
  }

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
              {/* O Input "Trigger" */}
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
                  numberOfLines={1}
                >
                  {selectedOption ? selectedOption.name : placeholder}
                </Text>

                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={disabled ? theme.colors.textLight : theme.colors.text}
                />
              </Pressable>

              {/* O Modal Bottom Sheet */}
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleClose}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : undefined}
                  style={{ flex: 1 }}
                >
                  <Pressable style={styles.modalOverlay} onPress={handleClose}>
                    <Pressable
                      style={styles.modalContent}
                      onPress={(e) => e.stopPropagation()}
                    >
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                          {label || "Selecione uma opção"}
                        </Text>
                        <TouchableOpacity
                          onPress={handleClose}
                          style={styles.closeButton}
                        >
                          <MaterialIcons
                            name="close"
                            size={24}
                            color={theme.colors.textLight}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.searchContainer}>
                        <MaterialIcons
                          name="search"
                          size={20}
                          color={theme.colors.textLight}
                          style={styles.searchIcon}
                        />
                        <TextInput
                          style={styles.searchInput}
                          placeholder="Filtrar opções..."
                          placeholderTextColor={theme.colors.textLight}
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                        />
                      </View>

                      <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => String(item.id)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                          <Text style={styles.emptyText}>
                            Nenhuma opção encontrada
                          </Text>
                        }
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.optionItem,
                              value === item.id && styles.selectedOptionItem,
                            ]}
                            onPress={() => {
                              onChange(item.id);
                              if (onSelectCallback) onSelectCallback(item.id);
                              handleClose();
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
                            {value === item.id && (
                              <MaterialIcons
                                name="check"
                                size={20}
                                color={theme.colors.primary}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                      />
                    </Pressable>
                  </Pressable>
                </KeyboardAvoidingView>
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
    width: "100%",
  },
  label: {
    ...theme.text.body,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  // Estilos do Input Trigger
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    height: 50, // Altura confortável
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...theme.shadows.soft,
  },
  disabledInput: {
    backgroundColor: theme.colors.slate[100],
    borderColor: theme.colors.slate[200],
    opacity: 0.7,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  inputText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1, // Para o texto não sobrepor o ícone
  },
  placeholderText: {
    color: theme.colors.textLight,
  },
  disabledText: {
    color: theme.colors.textLight,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  chevron: {
    marginLeft: theme.spacing.s,
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Mais escuro para foco
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.l,
    borderTopRightRadius: theme.borderRadius.l,
    height: "70%", // Ocupa 70% da tela
    paddingBottom: theme.spacing.xl,
    ...theme.shadows.strong,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.text.title,
    fontSize: 18,
  },
  closeButton: {
    padding: 4, // Área de toque maior
  },

  // Estilos da Busca
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    margin: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: theme.colors.text,
    fontSize: 14,
  },

  // Estilos da Lista
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  optionItem: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.slate[100],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOptionItem: {
    backgroundColor: theme.colors.primaryLight,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.l,
    color: theme.colors.textLight,
  },
});
