import { Gem, Target } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import DevlingoChar from '../assets/images/devlingo-char.png';

const SuccessScreen = () => {
  const navigate = useNavigate();
  
  // Ler search params da URL
  const searchParams = useSearch({ from: '/success' });
  const xp = searchParams?.xp || 10;
  const accuracy = searchParams?.accuracy || 100;

  const handleContinue = () => {
    navigate({ to: '/home' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 gap-10">
      {/* Mascote e Título */}
      <div className="flex flex-col items-center gap-6 text-center">
        <img
          src={DevlingoChar}
          alt="Mascote Devlingo"
          className="w-40 h-40 object-contain"
        />
        <h1 className="text-4xl font-bold text-yellow-400">
          Lição concluída!
        </h1>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {/* Card XP */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 flex flex-col items-center gap-3">
          <span className="text-xs uppercase text-slate-500 font-bold tracking-wide">
            TOTAL DE XP
          </span>
          <div className="flex items-center gap-2">
            <Gem className="w-6 h-6 text-blue-500" fill="currentColor" />
            <span className="text-2xl font-bold text-yellow-600">
              {xp}
            </span>
          </div>
        </div>

        {/* Card Precisão */}
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 flex flex-col items-center gap-3">
          <span className="text-xs uppercase text-slate-500 font-bold tracking-wide">
            BOA
          </span>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-green-600">
              {accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={handleContinue}
        className="w-full max-w-md px-10 py-4 bg-[#58cc02] hover:bg-[#58cc02]/90 text-white font-bold uppercase rounded-2xl border-b-4 border-green-600 transition-all hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-1 text-lg"
      >
        CONTINUAR
      </button>
    </div>
  );
};

export default SuccessScreen;
