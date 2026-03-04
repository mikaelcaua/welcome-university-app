import { z } from 'zod';

export const authFormSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email('Informe um email válido.'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
});

export type AuthFormData = z.infer<typeof authFormSchema>;
