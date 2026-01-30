import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z
      .string({ message: 'Email é obrigatório' })
      .email('Email inválido'),
    password: z
      .string({ message: 'Senha é obrigatória' })
      .min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z
      .string({ message: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
