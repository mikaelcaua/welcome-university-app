import { z } from 'zod';

import { ExamType } from '@/interfaces';

export const submitExamSchema = z.object({
  stateId: z.number().min(1, 'Selecione um estado.'),
  universityId: z.number().min(1, 'Selecione uma universidade.'),
  courseId: z.number().min(1, 'Selecione um curso.'),
  subjectId: z.number().min(1, 'Selecione uma disciplina.'),
  name: z.string().trim().min(3, 'Informe o nome da prova.'),
  examYear: z
    .string()
    .trim()
    .refine((value) => /^\d{4}$/.test(value), 'Informe um ano com 4 dígitos.')
    .refine((value) => Number(value) >= 2000, 'O ano da prova deve ser no mínimo 2000.'),
  semester: z
    .string()
    .refine((value) => value === '1' || value === '2', 'Escolha um semestre válido.'),
  type: z.nativeEnum(ExamType),
  pdfUri: z.string().trim().min(1, 'Informe a URI local do PDF.'),
  fileName: z.string().trim().min(1, 'Informe um nome para o arquivo.'),
});

export type SubmitExamFormData = z.infer<typeof submitExamSchema>;
