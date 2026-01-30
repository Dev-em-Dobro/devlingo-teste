import { useState, useEffect } from 'react';
import { X, Heart, Loader } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { getLessonById, completeLessonWithSuccess } from '../services/lessonsService';
import { LessonQuestion } from '../types/lesson';
import SuccessPopUp from './SuccessPopUp';
import ErrorPopUp from './ErrorPopUp';

const LessonScreen = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams({ from: '/lesson/$lessonId' });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [questions, setQuestions] = useState<LessonQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  useEffect(() => {
    const loadLesson = async () => {
      setIsLoading(true);
      const lesson = await getLessonById(lessonId);
      if (lesson?.lesson_questions) {
        setQuestions(lesson.lesson_questions);
      }
      setIsLoading(false);
    };

    loadLesson();
  }, [lessonId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader className="w-12 h-12 text-purple-600 animate-spin" />
        <p className="text-slate-600 text-lg mt-4">Carregando lição...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-slate-600 text-lg mb-4">Nenhuma questão disponível</p>
        <button
          onClick={() => navigate({ to: '/home' })}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      navigate({ to: '/home' });
    }
  };

  const handleVerify = () => {
    if (selectedOption) {
      const selectedOpt = currentQuestion.lesson_question_options.find(
        (opt) => opt.id === selectedOption,
      );

      if (selectedOpt?.is_correct) {
        // Resposta correta - incrementar contador e mostrar popup de sucesso
        setCorrectAnswers(prev => prev + 1);
        setShowSuccessPopup(true);
      } else {
        // Resposta incorreta - incrementar contador e mostrar popup de erro
        setIncorrectAnswers(prev => prev + 1);
        setShowErrorPopup(true);
      }
    }
  };

  const handleContinue = async () => {
    setShowSuccessPopup(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Próxima questão
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Fim da lição
      const totalQuestions = correctAnswers + 1; // +1 pois ainda não incrementamos o último acerto
      const finalCorrect = correctAnswers + 1;
      const accuracy = Math.round((finalCorrect / totalQuestions) * 100);
      
      // Se acertou todas, salvar no banco e ir para tela de sucesso
      if (incorrectAnswers === 0) {
        const xpEarned = 10; // XP da lição
        
        // Salvar progresso no banco de dados
        await completeLessonWithSuccess(lessonId, xpEarned);
        
        navigate({ 
          to: '/success',
          search: {
            xp: xpEarned,
            accuracy
          }
        });
      } else {
        // Se errou alguma, vai para tela de resultado
        navigate({ 
          to: '/result',
          search: {
            correctAnswers: finalCorrect,
            incorrectAnswers,
            lessonId
          }
        });
      }
    }
  };

  const handleErrorContinue = () => {
    setShowErrorPopup(false);
    setSelectedOption(null);
    
    // Perder uma vida
    if (lives > 1) {
      setLives(lives - 1);
    } else {
      // Fim da lição (sem vidas) - navegar para tela de resultado
      navigate({ 
        to: '/result',
        search: {
          correctAnswers,
          incorrectAnswers,
          lessonId
        }
      });
    }
  };

  const handleClose = () => {
    navigate({ to: '/home' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 gap-6">
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Barra de Progresso */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-700 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Vidas */}
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span className="text-gray-900 font-bold text-lg">{lives}</span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center px-6 pt-12">
        <div className="w-full max-w-2xl">
          {/* Pergunta */}
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            {currentQuestion.question_text}
          </h1>

          {/* Opções */}
          <div className="flex flex-col space-y-4">
            {currentQuestion.lesson_question_options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={`flex items-center justify-between p-5 border-2 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-blue-100 border-blue-400 text-blue-900'
                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <span className="text-lg font-medium">{option.option_text}</span>
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold ${
                      isSelected
                        ? 'bg-white border border-blue-400 text-blue-900'
                        : 'bg-white border border-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Botão Pular */}
          <button
            onClick={handleSkip}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold uppercase rounded-xl hover:bg-gray-300 transition-colors"
          >
            Pular
          </button>

          {/* Botão Verificar */}
          <button
            onClick={handleVerify}
            disabled={!selectedOption}
            className={`px-8 py-3 font-bold uppercase rounded-xl transition-colors ${
              selectedOption
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-green-500 text-white opacity-50 cursor-not-allowed'
            }`}
          >
            Verificar
          </button>
        </div>
      </footer>

      {/* Popup de Sucesso */}
      {showSuccessPopup && <SuccessPopUp onContinue={handleContinue} />}
      
      {/* Popup de Erro */}
      {showErrorPopup && <ErrorPopUp onContinue={handleErrorContinue} />}
    </div>
  );
};

export default LessonScreen;
