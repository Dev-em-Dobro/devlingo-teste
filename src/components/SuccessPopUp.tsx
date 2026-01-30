import { Check } from 'lucide-react';

interface SuccessPopUpProps {
  onContinue: () => void;
  onReport?: () => void;
}

const SuccessPopUp = ({ onContinue, onReport }: SuccessPopUpProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#d7ffb8] border-t-2 border-[#d7ffb8] z-50 animate-slide-up">
      <div className="max-w-screen-lg mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Lado Esquerdo: Status e Ícone */}
        <div className="flex items-center gap-4">
          {/* Ícone de Check */}
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-8 h-8 text-[#58cc02]" strokeWidth={3} />
          </div>

          {/* Textos */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-green-800">
              Na mosca!
            </h2>
            <button
              onClick={onReport}
              className="text-sm font-bold text-green-700/60 uppercase hover:text-green-700 transition-colors text-left"
            >
              REPORTAR
            </button>
          </div>
        </div>

        {/* Lado Direito: Botão Continuar */}
        <button
          onClick={onContinue}
          className="w-full md:w-auto px-10 py-3 bg-[#58cc02] hover:bg-[#58cc02]/90 text-white font-bold uppercase rounded-2xl border-b-4 border-green-600 transition-all hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-1"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default SuccessPopUp;
