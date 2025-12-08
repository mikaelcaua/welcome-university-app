import z from 'zod';

const searchUniversitySchema = z.object({
  query: z.string(),
});

export type SearchFormData = z.infer<typeof searchUniversitySchema>;
