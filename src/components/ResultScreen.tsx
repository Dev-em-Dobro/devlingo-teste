import { Check, X } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import DevlingoChar from '../assets/images/devlingo-char.png';

const ResultScreen = () => {
  const navigate = useNavigate();
  
  // Ler search params da URL
  const searchParams = useSearch({ from: '/result' });
  const correctAnswers = (searchParams as any)?.correctAnswers || 0;
  const incorrectAnswers = (searchParams as any)?.incorrectAnswers || 0;
  const lessonId = (searchParams as any)?.lessonId || '';

  // Calcular precisão
  const totalQuestions = correctAnswers + incorrectAnswers;
  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  const handleGoHome = () => {
    navigate({ to: '/home' });
  };

  const handleRetry = () => {
    if (lessonId) {
      navigate({ 
        to: '/lesson/$lessonId', 
        params: { lessonId } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 gap-8">
      {/* Cabeçalho: Mascote e Título */}
      <div className="flex flex-col items-center gap-4 text-center">
        <img
          src={DevlingoChar}
          alt="Mascote Devlingo"
          className="w-40 h-40 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Você quase conseguiu!
          </h1>
          <p className="text-base text-gray-500">
            Continue praticando para melhorar
          </p>
        </div>
      </div>

      {/* Card de Estatísticas */}
      <div className="w-full max-w-sm border border-gray-200 rounded-2xl p-6">
        <div className="flex flex-col gap-4">
          {/* Linha: Respostas Corretas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
              </div>
              <span className="text-slate-700 font-medium">Respostas corretas</span>
            </div>
            <span className="text-green-600 font-bold text-lg">
              {correctAnswers}
            </span>
          </div>

          {/* Linha: Respostas Incorretas */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" strokeWidth={2.5} />
              </div>
              <span className="text-slate-700 font-medium">Respostas incorretas</span>
            </div>
            <span className="text-red-500 font-bold text-lg">
              {incorrectAnswers}
            </span>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-100" />

          {/* Linha: Precisão */}
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Precisão</span>
            <span className="text-slate-800 font-bold text-lg">
              {accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Rodapé: Botões */}
      <div className="flex gap-4 w-full max-w-sm">
        {/* Botão Voltar */}
        <button
          onClick={handleGoHome}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold uppercase rounded-xl hover:bg-gray-300 transition-colors"
        >
          VOLTAR
        </button>

        {/* Botão Tentar Novamente */}
        <button
          onClick={handleRetry}
          className="flex-1 px-6 py-3 bg-[#58cc02] text-white font-bold uppercase rounded-xl border-b-4 border-[#46a302] hover:bg-[#58cc02]/90 transition-all hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-1"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
