import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { signInSchema, SignInFormData } from "../../schemas/signIn";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth(); // Usar o hook de autenticação
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const handleSignIn = async (data: SignInFormData) => {
    // Limpar mensagem de erro anterior
    setErrorMessage(null);

    // Chamar a função signIn do contexto
    const result = await signIn(data.email, data.password);

    if (result.success) {
      // Login bem-sucedido - o AuthContext já atualizou o estado do usuário
      // Redirecionar para a home
      navigate({ to: "/home" });
    } else {
      // Login falhou - exibir mensagem de erro
      setErrorMessage(result.errorMessage || "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-700 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta!
        </h1>

        {/* Subtítulo */}
        <p className="text-base text-gray-600 mb-8">
          Entre na sua conta para continuar
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Password Field */}
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="mt-8"
          >
            Entrar
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
