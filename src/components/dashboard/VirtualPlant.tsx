import { useState, useEffect } from "react";
import { Sprout, Leaf, TreeDeciduous, Flower2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlantStage {
  name: string;
  icon: React.ReactNode;
  color: string;
  minProgress: number;
  description: string;
}

const plantStages: PlantStage[] = [
  { 
    name: "Semente", 
    icon: <div className="w-8 h-8 rounded-full bg-amber-800/50 flex items-center justify-center">🌰</div>,
    color: "from-amber-600 to-amber-800",
    minProgress: 0,
    description: "Sua jornada está começando!"
  },
  { 
    name: "Broto", 
    icon: <Sprout className="w-12 h-12" />,
    color: "from-lime-400 to-green-500",
    minProgress: 20,
    description: "Você está crescendo!"
  },
  { 
    name: "Planta Pequena", 
    icon: <Leaf className="w-14 h-14" />,
    color: "from-green-400 to-emerald-600",
    minProgress: 40,
    description: "Continue assim!"
  },
  { 
    name: "Planta Média", 
    icon: <TreeDeciduous className="w-16 h-16" />,
    color: "from-emerald-400 to-teal-600",
    minProgress: 60,
    description: "Você está florescendo!"
  },
  { 
    name: "Planta Florida", 
    icon: <Flower2 className="w-20 h-20" />,
    color: "from-pink-400 via-purple-400 to-indigo-500",
    minProgress: 80,
    description: "Incrível! Sua planta está linda!"
  },
];

const VirtualPlant = () => {
  const [weeklyProgress] = useState(65); // This would come from real data
  const [showSparkle, setShowSparkle] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const getCurrentStage = (progress: number) => {
    for (let i = plantStages.length - 1; i >= 0; i--) {
      if (progress >= plantStages[i].minProgress) {
        return i;
      }
    }
    return 0;
  };

  const currentStageIndex = getCurrentStage(weeklyProgress);
  const currentStage = plantStages[currentStageIndex];
  const nextStage = plantStages[currentStageIndex + 1];
  
  const progressToNextStage = nextStage 
    ? Math.round(((weeklyProgress - currentStage.minProgress) / (nextStage.minProgress - currentStage.minProgress)) * 100)
    : 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(weeklyProgress);
      setShowSparkle(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [weeklyProgress]);

  useEffect(() => {
    if (showSparkle) {
      const timer = setTimeout(() => setShowSparkle(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSparkle]);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-semibold text-lg">Sua Plantinha</h3>
      </div>

      {/* Plant Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex flex-col items-center py-6 cursor-pointer group">
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-t ${currentStage.color} opacity-20 blur-2xl rounded-full`} />
            
            {/* Plant container */}
            <div className={`relative z-10 p-6 rounded-full bg-gradient-to-t ${currentStage.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
              {currentStage.icon}
              
              {/* Sparkle animation */}
              {showSparkle && (
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
              )}
            </div>

            {/* Stage name */}
            <p className="mt-4 font-semibold text-lg">{currentStage.name}</p>
            <p className="text-sm text-muted-foreground">{currentStage.description}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-background/95 backdrop-blur-sm border-white/10">
          <p className="font-medium">Sua planta cresceu {animatedProgress}% esta semana! 🌱</p>
        </TooltipContent>
      </Tooltip>

      {/* Progress to next stage */}
      {nextStage && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{currentStage.name}</span>
            <span>{nextStage.name}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${currentStage.color} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${progressToNextStage}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {100 - progressToNextStage}% para a próxima evolução
          </p>
        </div>
      )}

      {/* Stage indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {plantStages.map((stage, index) => (
          <div 
            key={stage.name}
            className={`w-2 h-2 rounded-full transition-all ${
              index <= currentStageIndex 
                ? `bg-gradient-to-r ${stage.color}` 
                : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VirtualPlant;
