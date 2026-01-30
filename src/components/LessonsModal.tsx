import { X, Check } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import DevlingoChar from '../assets/images/devlingo-char.png';
import { Unit } from '../types/unit';

interface LessonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitTitle: string;
  unitId: string;
  unit?: Unit;
}

const LessonsModal = ({ isOpen, onClose, unitTitle, unit }: LessonsModalProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const lessons = unit?.lessons || [];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      {/* Modal Container */}
      <div className="relative bg-purple-600 w-full max-w-lg rounded-3xl p-8">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-6 h-6"/>
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Escolha uma lição
          </h2>
          <p className="text-white/80 text-sm">{unitTitle}</p>
        </div>

        {/* Lista de Lições */}
        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() =>
                  navigate({
                    to: '/lesson/$lessonId',
                    params: { lessonId: String(lesson.id) },
                  })
                }
                className={`border-2 ${
                  lesson.completed ? 'border-green-400' : 'border-purple-400'
                } bg-purple-700/50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-purple-700/70 transition-colors`}
              >
                {/* Conteúdo Esquerdo */}
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{lesson.title}</h3>
                  <p className="text-white/90 text-sm mb-2">{lesson.description}</p>
                  <span className="text-white/80 text-xs font-semibold">
                    +{lesson.xp} XP
                  </span>
                </div>

                {/* Ícone de Status */}
                <div className="ml-4">
                  {lesson.completed && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/60 text-center py-8">Nenhuma lição disponível</p>
          )}
        </div>

        {/* Mascote (Coruja) */}
        <img
          src={DevlingoChar}
          alt="Mascote Devlingo"
          className="absolute bottom-[-40px] right-[-30px] w-24 h-24 object-contain pointer-events-none"
        />
      </div>
    </div>
  );
};

export default LessonsModal;
