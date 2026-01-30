import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório' })
    .email('Email inválido'),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
