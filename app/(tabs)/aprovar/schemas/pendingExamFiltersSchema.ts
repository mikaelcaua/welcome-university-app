import { z } from 'zod';

export const pendingExamFiltersSchema = z.object({
  stateId: z.number().int().min(1, 'Selecione o estado.'),
  universityId: z.number().int().min(1, 'Selecione a universidade.'),
  courseId: z.number().int().min(1, 'Selecione o curso.'),
  subjectId: z.number().int().min(1, 'Selecione a disciplina.'),
});

export type PendingExamFiltersFormData = z.infer<typeof pendingExamFiltersSchema>;
