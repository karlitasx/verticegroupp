import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: NewHabit) => void;
}

export interface NewHabit {
  name: string;
  emoji: string;
  category: string;
  frequency: string;
  reminderTime?: string;
}

const categories = [
  { id: "health", name: "Saúde", color: "bg-green-500", emoji: "💪" },
  { id: "productivity", name: "Produtividade", color: "bg-blue-500", emoji: "⚡" },
  { id: "spiritual", name: "Espiritual", color: "bg-purple-500", emoji: "🧘" },
  { id: "financial", name: "Financeiro", color: "bg-yellow-500", emoji: "💰" },
  { id: "selfcare", name: "Autocuidado", color: "bg-pink-500", emoji: "🌸" },
];

const frequencies = [
  { id: "daily", name: "Diário" },
  { id: "weekly", name: "Semanal" },
  { id: "custom", name: "Personalizado" },
];

const emojis = ["💧", "🏃", "📚", "🧘", "💰", "🎯", "💪", "🌙", "☀️", "🍎", "✍️", "🎨", "🌸", "💆", "🧠", "❤️"];

const AddHabitModal = ({ isOpen, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [category, setCategory] = useState("health");
  const [frequency, setFrequency] = useState("daily");
  const [reminderTime, setReminderTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      emoji,
      category,
      frequency,
      reminderTime: reminderTime || undefined,
    });

    // Reset form
    setName("");
    setEmoji("🎯");
    setCategory("health");
    setFrequency("daily");
    setReminderTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-glass-hover transition-all duration-300"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h2 className="text-xl font-bold mb-6">Novo Hábito</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Emoji selector */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Ícone
            </label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-300",
                    emoji === e
                      ? "bg-primary/30 ring-2 ring-primary scale-110"
                      : "bg-glass hover:bg-glass-hover hover:scale-105"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Nome do hábito
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Beber 2L de água"
              className="w-full px-4 py-3 glass-input"
            />
          </div>

          {/* Category selector - Now with 5 categories */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300",
                    category === cat.id
                      ? `${cat.color}/30 ring-2 ring-current`
                      : "bg-glass hover:bg-glass-hover"
                  )}
                  style={{
                    color: category === cat.id 
                      ? cat.id === "selfcare" ? "rgb(236, 72, 153)" // pink-500
                      : cat.id === "health" ? "rgb(34, 197, 94)" // green-500
                      : cat.id === "productivity" ? "rgb(59, 130, 246)" // blue-500
                      : cat.id === "spiritual" ? "rgb(168, 85, 247)" // purple-500
                      : "rgb(234, 179, 8)" // yellow-500
                      : undefined,
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency selector */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Frequência
            </label>
            <div className="flex gap-2">
              {frequencies.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFrequency(freq.id)}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    frequency === freq.id
                      ? "btn-gradient"
                      : "bg-glass hover:bg-glass-hover text-muted-foreground"
                  )}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder time */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Horário de lembrete (opcional)
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full px-4 py-3 glass-input"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-glass hover:bg-glass-hover transition-all duration-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 btn-gradient font-medium"
            >
              Criar Hábito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
