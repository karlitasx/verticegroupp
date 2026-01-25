import { useState } from "react";
import { Check, Flame, Clock, MoreVertical, Edit, Trash2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: string;
  categoryColor: string;
  streak: number;
  reminderTime?: string;
  completed: boolean;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStats: (id: string) => void;
}

const HabitCard = ({ habit, onToggle, onEdit, onDelete, onStats }: HabitCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (!habit.completed) {
      setIsAnimating(true);
      
      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#a855f7", "#ec4899", "#3b82f6"],
      });

      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggle(habit.id);
  };

  const categoryColors: Record<string, string> = {
    health: "bg-green-500/20 text-green-400 border-green-500/30",
    productivity: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    spiritual: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    financial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const categoryNames: Record<string, string> = {
    health: "Saúde",
    productivity: "Produtividade",
    spiritual: "Espiritual",
    financial: "Financeiro",
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-2xl border transition-all duration-300 group",
        habit.completed
          ? "bg-green-500/10 border-green-400/30"
          : "bg-glass border-glass-border hover:scale-[1.02] hover:shadow-xl",
        isAnimating && "animate-pulse"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={cn(
            "relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            habit.completed
              ? "bg-green-500 border-green-500"
              : "border-muted-foreground hover:border-primary hover:scale-110"
          )}
        >
          {habit.completed && (
            <Check className="w-5 h-5 text-white animate-scale-in" />
          )}
          {/* Ripple effect */}
          {isAnimating && (
            <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping" />
          )}
        </button>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{habit.emoji}</span>
            <h3
              className={cn(
                "font-medium truncate transition-all",
                habit.completed && "line-through text-muted-foreground"
              )}
            >
              {habit.name}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                categoryColors[habit.category]
              )}
            >
              {categoryNames[habit.category]}
            </span>
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <Flame className="w-3 h-3" />
                <span className="text-xs font-medium">{habit.streak}</span>
              </div>
            )}
            {habit.reminderTime && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{habit.reminderTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-glass-hover transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 glass-card py-1 z-20 animate-scale-in">
                <button
                  onClick={() => {
                    onStats(habit.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-glass-hover transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Estatísticas
                </button>
                <button
                  onClick={() => {
                    onEdit(habit.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-glass-hover transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(habit.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-glass-hover transition-colors text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Deletar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
