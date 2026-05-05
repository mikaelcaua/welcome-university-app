import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { downloadPdfToCache, normalizePdfUrl } from '@/lib/examAttachmentCache';
import { getErrorMessage } from '@/lib/offlineCache';
import { showToast } from '@/lib/toast';
import { theme } from '@/theme';

export default function PdfViewerScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ pdfUrl?: string; fileName?: string }>();
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const pdfUrl = useMemo(() => normalizePdfUrl(params.pdfUrl ?? ''), [params.pdfUrl]);
  const fileName = params.fileName?.trim() || 'prova.pdf';

  async function sharePdf() {
    if (!pdfUrl || sharing) {
      return;
    }

    try {
      setSharing(true);
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        throw new Error('Compartilhamento indisponível neste dispositivo.');
      }

      const localUri = await downloadPdfToCache(pdfUrl, fileName);

      await Sharing.shareAsync(localUri, {
        dialogTitle: fileName,
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      showToast({
        title: 'Erro ao compartilhar PDF',
        message: getErrorMessage(error),
        variant: 'error',
      });
    } finally {
      setSharing(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.s }]}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={theme.colors.text} />
        </Pressable>

        <Text style={styles.title} numberOfLines={1}>
          {fileName}
        </Text>

        <Pressable
          style={[styles.iconButton, sharing ? styles.iconButtonDisabled : null]}
          onPress={sharePdf}
          disabled={sharing || !pdfUrl}
        >
          {sharing ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <MaterialIcons name="ios-share" size={22} color={theme.colors.text} />
          )}
        </Pressable>
      </View>

      {pdfUrl ? (
        <View style={styles.viewer}>
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.loading} />
            </View>
          ) : null}

          <Pdf
            source={{ uri: pdfUrl, cache: true }}
            style={styles.pdf}
            trustAllCerts={false}
            onLoadComplete={() => setLoading(false)}
            onError={(error) => {
              setLoading(false);
              showToast({
                title: 'Erro ao abrir PDF',
                message: getErrorMessage(error),
                variant: 'error',
              });
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="picture-as-pdf" size={42} color={theme.colors.pdf} />
          <Text style={styles.emptyTitle}>PDF indisponível</Text>
          <Text style={styles.emptyMessage}>A URL deste anexo não foi encontrada.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.s,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.s,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
  },
  iconButtonDisabled: {
    opacity: 0.6,
  },
  title: {
    ...theme.text.title,
    flex: 1,
    fontSize: 16,
  },
  viewer: {
    flex: 1,
    backgroundColor: theme.colors.slate[950],
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.slate[950],
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.s,
    padding: theme.spacing.l,
  },
  emptyTitle: {
    ...theme.text.title,
  },
  emptyMessage: {
    ...theme.text.body,
    textAlign: 'center',
  },
});
