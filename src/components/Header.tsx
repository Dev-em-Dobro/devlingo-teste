import { LogOut } from "lucide-react";
import { IoDiamond, IoHeart } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";

const Header = () => {
  const { signOut, getUserXP } = useAuth();
  const navigate = useNavigate();
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    const loadUserXP = async () => {
      const xp = await getUserXP();
      setUserXP(xp);
    };
    loadUserXP();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/signin" });
  };

  return (
    <>
      <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-md bg-yellow-400 flex items-center justify-center">
          <span className="text-black font-bold">JS</span>
        </div>

        {/* Status e Ações */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <IoDiamond className="text-blue-500 text-xl" />
            <span className="text-gray-900 font-semibold">{userXP}</span>
          </div>

          <div className="flex items-center gap-2">
            <IoHeart className="text-red-500 text-xl" />
            <span className="text-gray-900 font-semibold">∞</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" onClick={() => handleSignOut()} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </header>

      <main className="px-4 pt-4">
        <div className="bg-purple-600 rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
            Começar unidade
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            Fundamentos de JavaScript
          </h2>
        </div>
      </main>
    </>
  );
};

export default Header;
