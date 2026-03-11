import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme";

import { Button } from "./Button";

interface AttachmentPreviewModalProps {
  visible: boolean;
  fileKind: "image" | "pdf" | "";
  fileUri: string;
  fileName: string;
  title?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onClose: () => void;
}

export function AttachmentPreviewModal({
  visible,
  fileKind,
  fileUri,
  fileName,
  title = "Anexo selecionado",
  actionLabel,
  onActionPress,
  onClose,
}: AttachmentPreviewModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={20} color={theme.colors.text} />
            </Pressable>
          </View>

          {fileKind === "image" && fileUri ? (
            <Image
              source={{ uri: fileUri }}
              style={styles.previewImage}
              contentFit="contain"
            />
          ) : (
            <View style={styles.previewPdfCard}>
              <MaterialIcons
                name="picture-as-pdf"
                size={40}
                color={theme.colors.pdf}
              />
              <Text style={styles.previewPdfTitle}>Arquivo PDF anexado</Text>
              <Text style={styles.previewPdfName} numberOfLines={2}>
                {fileName}
              </Text>
            </View>
          )}

          {actionLabel && onActionPress ? (
            <Button title={actionLabel} onPress={onActionPress} />
          ) : null}

          <Button title="Fechar visualização" variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.82)",
    justifyContent: "center",
    padding: theme.spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.l,
    padding: theme.spacing.l,
    gap: theme.spacing.m,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...theme.text.title,
    fontSize: 20,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: 320,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.background,
  },
  previewPdfCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.surfaceAlt,
    padding: theme.spacing.l,
    alignItems: "center",
    gap: theme.spacing.s,
  },
  previewPdfTitle: {
    ...theme.text.body,
    fontWeight: "700",
  },
  previewPdfName: {
    ...theme.text.caption,
    color: theme.colors.textLight,
    textAlign: "center",
  },
});
