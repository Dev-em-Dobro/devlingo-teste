import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { CreateUserData, CreateUserResponse } from "../types/user";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; errorMessage?: string }>; // Função para fazer login
  signUp: (data: CreateUserData) => Promise<CreateUserResponse>;
  signOut: () => Promise<void>;
  getUserXP: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    try {
      // Tentar fazer login no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Se houver erro, retornar mensagem de erro
      if (error) {
        // Traduzir mensagens de erro comuns do Supabase para português
        let errorMessage = "Erro ao fazer login.";

        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor, confirme seu email antes de fazer login.";
        } else {
          errorMessage = error.message || "Erro ao fazer login.";
        }

        return {
          success: false,
          errorMessage,
        };
      }

      // Se não houver erro e o usuário foi autenticado, retornar sucesso
      // O estado do usuário será atualizado automaticamente pelo onAuthStateChange
      if (data.user) {
        return { success: true };
      }

      return {
        success: false,
        errorMessage: "Erro ao fazer login.",
      };
    } catch (error) {
      // Capturar erros inesperados
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao fazer login.",
      };
    }
  };

  const signUp = async (data: CreateUserData): Promise<CreateUserResponse> => {
    try {
      const { name, email, password } = data;

      // 1. Verificar se o email já existe
      const { data: existingUser, error: checkError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar email:", checkError);
        return {
          success: false,
          message: "Erro ao verificar credenciais. Tente novamente.",
        };
      }

      if (existingUser) {
        return {
          success: false,
          message: "Este e-mail já está cadastrado",
        };
      }

      // Criar usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: { name },
          },
        },
      );

      if (signUpError || !authData.user) {
        return {
          success: false,
          message: signUpError?.message || "Erro ao criar conta.",
        };
      }

      // 3. Inserir novo usuário
      const { data: newUser, error: insertError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: authData.user.id,
            name,
            email,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao criar usuário:", insertError);
        return {
          success: false,
          message: "Erro ao criar conta. Tente novamente.",
        };
      }

      return {
        success: true,
        message: "Conta criada com sucesso!",
        userId: newUser.id,
      };
    } catch (error) {
      console.error("Erro inesperado:", error);
      return {
        success: false,
        message: "Erro inesperado. Tente novamente mais tarde.",
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut(); // Remove a sessão do Supabase
      setIsAuthenticated(false); // Limpa o estado do usuário
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpar estado local
      setIsAuthenticated(false); // Limpa o estado do usuário
    }
  };

  const getUserXP = async (): Promise<number> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return 0;
      }

      // Buscar soma total de XP de todas as lições completadas
      const { data, error } = await supabase
        .from("user_lessons")
        .select("xp_earned")
        .eq("user_id", user.id)
        .eq("is_completed", true);

      if (error) {
        console.error("Erro ao buscar XP do usuário:", error);
        return 0;
      }

      // Somar todo o XP ganho
      const totalXP =
        data?.reduce((sum, lesson) => sum + (lesson.xp_earned || 0), 0) || 0;
      return totalXP;
    } catch (error) {
      console.error("Erro ao calcular XP:", error);
      return 0;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signIn, signUp, signOut, getUserXP }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
