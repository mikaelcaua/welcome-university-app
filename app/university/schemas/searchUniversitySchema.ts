import z from 'zod';

export const searchUniversitySchema = z.object({
  query: z.string(),
});

export type SearchUniversityFormData = z.infer<typeof searchUniversitySchema>;
