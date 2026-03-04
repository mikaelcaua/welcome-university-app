import { z } from 'zod';

export const searchStateSchema = z.object({
  query: z.string(),
});

export type SearchStateFormData = z.infer<typeof searchStateSchema>;
