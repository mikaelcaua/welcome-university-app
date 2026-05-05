import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';

import { Exam } from '@/interfaces';

import { showToast } from './toast';

const EXAM_ATTACHMENTS_DIRECTORY = `${FileSystem.cacheDirectory ?? ''}welcome-university/exams/`;

export function openExamPdfWithCache(exam: Exam) {
  const pdfUrl = normalizePdfUrl(exam.pdfUrl);

  if (!pdfUrl) {
    showToast({
      title: 'PDF indisponível',
      message: 'Esta prova não possui um anexo para abrir.',
      variant: 'error',
    });
    return;
  }

  router.push({
    pathname: '/pdf-viewer',
    params: {
      pdfUrl,
      fileName: getExamPdfFileName(exam),
    },
  });
}

export async function downloadPdfToCache(pdfUrl: string, fileName: string) {
  const normalizedPdfUrl = normalizePdfUrl(pdfUrl);

  if (!normalizedPdfUrl) {
    throw new Error('URL do PDF indisponível.');
  }

  await ensureExamAttachmentsDirectory();

  const localUri = `${EXAM_ATTACHMENTS_DIRECTORY}${sanitizeFileName(fileName)}`;
  const downloaded = await FileSystem.downloadAsync(normalizedPdfUrl, localUri);

  if (downloaded.status < 200 || downloaded.status >= 300) {
    throw new Error(`Download retornou status ${downloaded.status}.`);
  }

  return downloaded.uri;
}

export function normalizePdfUrl(pdfUrl: string) {
  const trimmedPdfUrl = pdfUrl.trim();

  if (!trimmedPdfUrl) {
    return '';
  }

  return trimmedPdfUrl.replace(/\/(exams-bucket)\/\1\//, '/$1/');
}

function ensureExamAttachmentsDirectory() {
  if (!FileSystem.cacheDirectory) {
    throw new Error('Diretório de cache indisponível nesta plataforma.');
  }

  return FileSystem.getInfoAsync(EXAM_ATTACHMENTS_DIRECTORY).then((info) => {
    if (!info.exists) {
      return FileSystem.makeDirectoryAsync(EXAM_ATTACHMENTS_DIRECTORY, { intermediates: true });
    }

    return undefined;
  });
}

function getExamPdfFileName(exam: Exam) {
  const baseName = exam.name || `${exam.subjectName}-${exam.examYear}.${exam.semester}`;

  return sanitizeFileName(baseName.endsWith('.pdf') ? baseName : `${baseName}.pdf`);
}

function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .trim()
    .replace(/[/:*?"<>|\\]/g, '-')
    .replace(/\s+/g, ' ');

  return sanitized || 'prova.pdf';
}
