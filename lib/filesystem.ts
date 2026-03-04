import * as ImagePicker from 'expo-image-picker';

export type LocalAttachmentKind = 'image' | 'pdf';

export interface LocalAttachment {
  uri: string;
  name: string;
  mimeType: string;
  kind: LocalAttachmentKind;
}

export async function pickImageFromLibrary(): Promise<LocalAttachment | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permita acesso à galeria para anexar uma foto da prova.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
    allowsMultipleSelection: false,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    name: normalizeFileName(asset.fileName, asset.uri, 'anexo-prova.jpg'),
    mimeType: asset.mimeType ?? detectMimeType(asset.fileName ?? asset.uri),
    kind: 'image',
  };
}

export async function pickPdfDocument(): Promise<LocalAttachment | null> {
  const DocumentPicker = await loadDocumentPicker();

  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    name: normalizeFileName(asset.name, asset.uri, 'prova.pdf'),
    mimeType: asset.mimeType ?? 'application/pdf',
    kind: 'pdf',
  };
}

function normalizeFileName(
  preferredName: string | null | undefined,
  uri: string,
  fallback: string,
) {
  const trimmed = preferredName?.trim();

  if (trimmed) {
    return trimmed;
  }

  const uriSegments = uri.split('/');
  const lastSegment = uriSegments[uriSegments.length - 1]?.trim();

  return lastSegment || fallback;
}

function detectMimeType(fileName: string) {
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

  if (normalized.endsWith('.pdf')) {
    return 'application/pdf';
  }

  return 'image/jpeg';
}

async function loadDocumentPicker() {
  try {
    return await import('expo-document-picker');
  } catch (error) {
    throw new Error(
      'O seletor de PDF não está disponível nesta build. Gere uma nova build de desenvolvimento após instalar o módulo expo-document-picker.',
      { cause: error },
    );
  }
}
