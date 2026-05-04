import * as FileSystem from 'expo-file-system/legacy';
import { Linking, Platform } from 'react-native';

import { Exam } from '@/interfaces';

import { getErrorMessage } from './offlineCache';
import { showToast } from './toast';

const EXAM_ATTACHMENTS_DIRECTORY = `${FileSystem.cacheDirectory ?? ''}welcome-university/exams/`;

export async function openExamPdfWithCache(exam: Exam) {
  if (!exam.pdfUrl) {
    showToast({
      title: 'PDF indisponível',
      message: 'Esta prova não possui um anexo para abrir.',
      variant: 'error',
    });
    return;
  }

  const localUri = getExamPdfCacheUri(exam);

  try {
    await ensureExamAttachmentsDirectory();
    const downloaded = await FileSystem.downloadAsync(exam.pdfUrl, localUri);

    if (downloaded.status < 200 || downloaded.status >= 300) {
      throw new Error(`Download retornou status ${downloaded.status}.`);
    }

    await openLocalFile(downloaded.uri);
  } catch (error) {
    const cachedFile = await FileSystem.getInfoAsync(localUri);

    if (cachedFile.exists) {
      showToast({
        title: 'Abrindo prova offline',
        message: `Não foi possível baixar a versão mais recente. Abrindo o anexo salvo neste dispositivo. Detalhe: ${getErrorMessage(error)}`,
        variant: 'warning',
      });
      await openLocalFile(localUri);
      return;
    }

    showToast({
      title: 'Erro ao abrir prova',
      message: `Não foi possível baixar o anexo e ainda não existe uma cópia salva neste dispositivo. Detalhe: ${getErrorMessage(error)}`,
      variant: 'error',
    });
  }
}

async function ensureExamAttachmentsDirectory() {
  if (!FileSystem.cacheDirectory) {
    throw new Error('Diretório de cache indisponível nesta plataforma.');
  }

  const info = await FileSystem.getInfoAsync(EXAM_ATTACHMENTS_DIRECTORY);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(EXAM_ATTACHMENTS_DIRECTORY, { intermediates: true });
  }
}

function getExamPdfCacheUri(exam: Exam) {
  const fileName = `${exam.id}-${hashString(exam.pdfUrl)}.pdf`;
  return `${EXAM_ATTACHMENTS_DIRECTORY}${fileName}`;
}

async function openLocalFile(uri: string) {
  const targetUri =
    Platform.OS === 'android' ? await FileSystem.getContentUriAsync(uri) : uri;

  await Linking.openURL(targetUri);
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}
