import z from 'zod';

export const courseSubjectSchema = z.object({
  courseId: z
    .number({
      message: 'Selecione um curso',
    })
    .min(1, 'Selecione um curso'),

  subjectId: z
    .number({
      message: 'Selecione uma disciplina',
    })
    .min(1, 'Selecione uma disciplina'),
});

export type CourseSubjectFormData = z.infer<typeof courseSubjectSchema>;
