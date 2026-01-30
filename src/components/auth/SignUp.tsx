import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { signUpSchema, SignUpFormData } from '../../schemas/signUp';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setErrorMessage(null);
      
      const result = await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        // Redirecionar para /home
        navigate({ to: '/home' });
      } else {
        // Mostrar erro
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setErrorMessage('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-700 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Criar conta
        </h1>

        {/* Subtítulo */}
        <p className="text-base text-gray-600 mb-8">
          Cadastre-se para começar sua jornada
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
          {/* Mensagem de Erro Global */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-1 duration-200">
              {errorMessage}
            </div>
          )}

          {/* Name Field */}
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome completo"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password Field */}
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Confirm Password Field */}
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="mt-8"
          >
            Criar conta
          </Button>
        </form>

        {/* Divisor "ou" */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">ou</span>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/signin"
              className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
