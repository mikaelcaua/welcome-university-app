import { z } from 'zod';

import { ExamType } from '@/interfaces';

export const submitExamSchema = z.object({
  stateId: z.number().min(1, 'Selecione um estado.'),
  universityId: z.number().min(1, 'Selecione uma universidade.'),
  courseId: z.number().min(1, 'Selecione um curso.'),
  subjectId: z.number().min(1, 'Selecione uma disciplina.'),
  examYear: z
    .string()
    .trim()
    .refine((value) => /^\d{4}$/.test(value), 'Informe um ano com 4 dígitos.')
    .refine((value) => Number(value) >= 2000, 'O ano da prova deve ser no mínimo 2000.'),
  semester: z
    .string()
    .refine((value) => value === '1' || value === '2', 'Escolha um semestre válido.'),
  type: z.nativeEnum(ExamType),
  fileUri: z.string().trim().min(1, 'Selecione uma foto ou PDF para anexar.'),
  fileName: z.string().trim().min(1, 'Nenhum arquivo foi selecionado.'),
  fileMimeType: z.string().trim().min(1, 'Não foi possível identificar o tipo do arquivo.'),
  fileKind: z
    .string()
    .refine((value) => value === 'image' || value === 'pdf', 'Selecione uma foto ou PDF.'),
});

export type SubmitExamFormData = z.infer<typeof submitExamSchema>;
