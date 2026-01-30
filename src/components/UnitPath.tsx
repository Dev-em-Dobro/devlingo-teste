import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import LessonsModal from "./LessonsModal";
import { getUnits } from "../services/unitsService";
import { Unit } from "../types/unit";

const UnitPath = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const loadUnits = async () => {
    const data = await getUnits();
    setUnits(data);
    setIsFirstLoad(false);
  };

  // Carregar unidades do banco de dados
  useEffect(() => {
    loadUnits();
     
  }, []);

  // Padrão de offsets para criar o caminho sinuoso
  const offsetPattern = [0, -40, -60, -40, 0];

  const getOffset = (index: number) => {
    return offsetPattern[index % offsetPattern.length];
  };

  const getStarImage = (state: 'locked' | 'available' | 'completed') => {
    if (state === "locked" || state === "available") {
      return "./src/assets/images/gray-star.png";
    }
    return "./src/assets/images/green-star.png";
  };

  const handleUnitClick = (unitId: string, status: 'locked' | 'available' | 'completed') => {
    if (status !== "locked") {
      setSelectedUnitId(unitId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedUnitId(null);
    // Recarregar unidades após fechar modal para atualizar status
    await loadUnits();
  };

  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  return (
    <>
      <div className="relative py-8 flex flex-col items-center gap-4 min-h-[400px]">
        {isFirstLoad ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader className="w-12 h-12 text-purple-300 animate-spin" />
            <p className="text-white/70 text-sm mt-4">Carregando unidades...</p>
          </div>
        ) : (
          units.map((unit, index) => (
            <div
              key={unit.id}
              className="relative flex items-center justify-center"
              style={{
                transform: `translateX(${getOffset(index)}px)`,
              }}
            >
              {/* Estrela (Unidade) - apenas a imagem */}
              <img
                src={getStarImage(unit.status)}
                alt={unit.title}
                className={`w-20 h-20 object-contain transition-transform ${
                  unit.status === 'locked' 
                    ? 'cursor-not-allowed opacity-60' 
                    : 'cursor-pointer hover:scale-105'
                }`}
                onClick={() => handleUnitClick(unit.id, unit.status)}
              />

              {/* Mascote - Aparece apenas na terceira unidade e quando está disponível */}
              {unit.status === "available" && index === 2 && (
                <img
                  src="./src/assets/images/devlingo-char.png"
                  alt="Mascote Devlingo"
                  className="absolute -right-26 top-1/2 -translate-y-1/2 w-32 h-32 object-contain animate-bounce"
                  style={{ animationDuration: "2s" }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de Lições */}
      <LessonsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        unitTitle={selectedUnit?.title || ""}
        unitId={selectedUnitId || ""}
        unit={selectedUnit}
      />
    </>
  );
};

export default UnitPath;
