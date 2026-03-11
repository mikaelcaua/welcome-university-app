import { z } from 'zod';

export const authFormSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email('Informe um email válido.'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

export const registerAuthFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo.'),
  email: z.string().trim().email('Informe um email válido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
      'A senha deve conter letra, número e caractere especial.',
    ),
});

export type AuthFormData = z.infer<typeof authFormSchema>;
