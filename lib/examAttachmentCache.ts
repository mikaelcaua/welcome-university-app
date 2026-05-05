import * as FileSystem from 'expo-file-system/legacy';
import { router } from 'expo-router';

import { Exam, ExamAttachmentKind } from '@/interfaces';

import { showToast } from './toast';

const EXAM_ATTACHMENTS_DIRECTORY = `${FileSystem.cacheDirectory ?? ''}welcome-university/exams/`;

export function openExamPdfWithCache(exam: Exam) {
  const attachmentUrl = normalizePdfUrl(exam.pdfUrl);

  if (!attachmentUrl) {
    showToast({
      title: 'Anexo indisponível',
      message: 'Esta prova não possui um anexo para abrir.',
      variant: 'error',
    });
    return;
  }

  router.push({
    pathname: '/pdf-viewer',
    params: {
      pdfUrl: attachmentUrl,
      fileName: getExamAttachmentFileName(exam),
      fileKind: getExamAttachmentKind(attachmentUrl),
    },
  });
}

export async function downloadPdfToCache(pdfUrl: string, fileName: string) {
  return downloadExamAttachmentToCache(pdfUrl, fileName);
}

export async function downloadExamAttachmentToCache(attachmentUrl: string, fileName: string) {
  const normalizedAttachmentUrl = normalizePdfUrl(attachmentUrl);

  if (!normalizedAttachmentUrl) {
    throw new Error('URL do anexo indisponível.');
  }

  await ensureExamAttachmentsDirectory();

  const localUri = `${EXAM_ATTACHMENTS_DIRECTORY}${sanitizeFileName(fileName)}`;
  const downloaded = await FileSystem.downloadAsync(normalizedAttachmentUrl, localUri);

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

export function getExamAttachmentKind(attachmentUrlOrName: string): ExamAttachmentKind {
  const normalized = getUrlPath(attachmentUrlOrName).toLowerCase();

  return normalized.endsWith('.pdf') ? ExamAttachmentKind.PDF : ExamAttachmentKind.IMAGE;
}

export function getAttachmentMimeType(kind: ExamAttachmentKind, fileName: string) {
  if (kind === ExamAttachmentKind.PDF) {
    return 'application/pdf';
  }

  const normalized = fileName.toLowerCase();

  if (normalized.endsWith('.png')) {
    return 'image/png';
  }

  if (normalized.endsWith('.webp')) {
    return 'image/webp';
  }

  if (normalized.endsWith('.heic')) {
    return 'image/heic';
  }

  return 'image/jpeg';
}

export function getAttachmentUti(kind: ExamAttachmentKind, fileName: string) {
  if (kind === ExamAttachmentKind.PDF) {
    return 'com.adobe.pdf';
  }

  const normalized = fileName.toLowerCase();

  if (normalized.endsWith('.png')) {
    return 'public.png';
  }

  if (normalized.endsWith('.heic')) {
    return 'public.heic';
  }

  return 'public.jpeg';
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

function getExamAttachmentFileName(exam: Exam) {
  const baseName = exam.name || `${exam.subjectName}-${exam.examYear}.${exam.semester}`;
  const urlExtension = getFileExtension(exam.pdfUrl);

  if (getFileExtension(baseName)) {
    return sanitizeFileName(baseName);
  }

  return sanitizeFileName(`${baseName}${urlExtension || '.pdf'}`);
}

function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .trim()
    .replace(/[/:*?"<>|\\]/g, '-')
    .replace(/\s+/g, ' ');

  return sanitized || 'prova.pdf';
}

function getFileExtension(value: string) {
  const path = getUrlPath(value);
  const match = path.match(/(\.[a-z0-9]+)$/i);

  return match?.[1] ?? '';
}

function getUrlPath(value: string) {
  try {
    return decodeURIComponent(new URL(value).pathname);
  } catch {
    return value.split('?')[0] ?? value;
  }
}
