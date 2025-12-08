import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
