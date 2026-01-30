import { X } from 'lucide-react';

interface ErrorPopUpProps {
  onContinue: () => void;
  onReport?: () => void;
}

const ErrorPopUp = ({ onContinue, onReport }: ErrorPopUpProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#ffdfe0] border-t-2 border-[#ffdfe0] z-50 animate-slide-up">
      <div className="max-w-screen-lg mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Lado Esquerdo: Status e Ícone */}
        <div className="flex items-center gap-4">
          {/* Ícone de X */}
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center">
              <X className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Textos */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-red-700">
              Incorreto
            </h2>
            <button
              onClick={onReport}
              className="text-sm font-bold text-red-600/60 uppercase hover:text-red-600 transition-colors text-left"
            >
              REPORTAR
            </button>
          </div>
        </div>

        {/* Lado Direito: Botão Continuar */}
        <button
          onClick={onContinue}
          className="w-full md:w-auto px-10 py-3 bg-[#ff4b4b] hover:bg-[#ff4b4b]/90 text-white font-bold uppercase rounded-2xl border-b-4 border-red-600 transition-all hover:border-b-2 hover:translate-y-[2px] active:border-b-0 active:translate-y-1"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default ErrorPopUp;
