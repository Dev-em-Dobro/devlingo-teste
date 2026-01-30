import { useState, useEffect } from 'react';
import devingoLoader from '../assets/images/devlingo-loader.png';

interface LoadingScreenProps {
  duration?: number;
  isVisible?: boolean;
  onComplete?: () => void;
}

const LoadingScreen = ({ duration = 1500, isVisible = true, onComplete }: LoadingScreenProps) => {
  const [showLoading, setShowLoading] = useState(isVisible);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setShowLoading(false);
      return;
    }

    setShowLoading(true);
    setIsFadingOut(false);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const fadeOutTimer = setTimeout(() => {
        setShowLoading(false);
        // Pequeno delay para garantir renderização do SignIn antes de chamar onComplete
        setTimeout(() => {
          onComplete?.();
        }, 100);
      }, 600); // Duração do fade out em ms

      return () => clearTimeout(fadeOutTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, isVisible, onComplete]);

  if (!showLoading) return null;

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-gradient-to-b from-purple-600 to-purple-700 flex flex-col items-center justify-center z-50 ${
        isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
    >
      {/* Coruja com animação de float */}
      <div className="animate-float">
        <img
          src={devingoLoader}
          alt="Devlingo Loader"
          className="w-32 h-32 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Logo Devlingo */}
      <h1 className="mt-8 text-4xl font-bold text-white tracking-wide drop-shadow-lg">
        Devlingo
      </h1>
    </div>
  );
};

export default LoadingScreen;
