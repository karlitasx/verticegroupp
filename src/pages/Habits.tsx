import { useState } from "react";
import { Target, Plus, Filter, BarChart3, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HabitCard, { Habit } from "@/components/habits/HabitCard";
import AddHabitModal, { NewHabit } from "@/components/habits/AddHabitModal";
import HabitStats from "@/components/habits/HabitStats";
import { cn } from "@/lib/utils";

const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Beber 2L de água",
    emoji: "💧",
    category: "health",
    categoryColor: "green",
    streak: 12,
    reminderTime: "08:00",
    completed: false,
  },
  {
    id: "2",
    name: "Meditação 10 minutos",
    emoji: "🧘",
    category: "spiritual",
    categoryColor: "purple",
    streak: 5,
    reminderTime: "06:30",
    completed: true,
  },
  {
    id: "3",
    name: "Ler 30 páginas",
    emoji: "📚",
    category: "productivity",
    categoryColor: "blue",
    streak: 8,
    reminderTime: "21:00",
    completed: false,
  },
  {
    id: "4",
    name: "Registrar despesas",
    emoji: "💰",
    category: "financial",
    categoryColor: "yellow",
    streak: 3,
    completed: false,
  },
  {
    id: "5",
    name: "Exercício 30min",
    emoji: "🏃",
    category: "health",
    categoryColor: "green",
    streak: 15,
    reminderTime: "07:00",
    completed: true,
  },
];

type FilterType = "all" | "completed" | "pending" | string;

const filters = [
  { id: "all", name: "Todos" },
  { id: "completed", name: "Concluídos" },
  { id: "pending", name: "Pendentes" },
];

const categoryFilters = [
  { id: "health", name: "Saúde", emoji: "💪" },
  { id: "productivity", name: "Produtividade", emoji: "⚡" },
  { id: "spiritual", name: "Espiritual", emoji: "🧘" },
  { id: "financial", name: "Financeiro", emoji: "💰" },
];

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredHabits = habits.filter((habit) => {
    if (filter === "completed") return habit.completed;
    if (filter === "pending") return !habit.completed;
    if (["health", "productivity", "spiritual", "financial"].includes(filter)) {
      return habit.category === filter;
    }
    return true;
  });

  const handleToggle = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completed: !h.completed, streak: h.completed ? h.streak : h.streak + 1 }
          : h
      )
    );
  };

  const handleAdd = (newHabit: NewHabit) => {
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      emoji: newHabit.emoji,
      category: newHabit.category,
      categoryColor: newHabit.category,
      streak: 0,
      reminderTime: newHabit.reminderTime,
      completed: false,
    };
    setHabits((prev) => [habit, ...prev]);
  };

  const handleDelete = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleStats = (id: string) => {
    setSelectedHabitId(id);
    setShowStats(true);
  };

  return (
    <DashboardLayout activeNav="/habits">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl logo-gradient">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Meus Hábitos</h1>
              <p className="text-sm text-muted-foreground">
                {completedCount} de {totalCount} concluídos hoje
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-gradient px-5 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Novo Hábito</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-4 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso do dia</span>
            <span className="font-semibold">{progressPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-glass overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-slide-up animation-delay-100">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                filter === f.id
                  ? "btn-gradient"
                  : "bg-glass hover:bg-glass-hover text-muted-foreground"
              )}
            >
              {f.name}
            </button>
          ))}

          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                ["health", "productivity", "spiritual", "financial"].includes(filter)
                  ? "btn-gradient"
                  : "bg-glass hover:bg-glass-hover text-muted-foreground"
              )}
            >
              <Filter className="w-4 h-4" />
              Categoria
            </button>

            {showCategoryFilter && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCategoryFilter(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-48 glass-card py-2 z-20 animate-scale-in">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilter(cat.id);
                        setShowCategoryFilter(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-glass-hover transition-colors",
                        filter === cat.id && "text-primary"
                      )}
                    >
                      <span>{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Stats Toggle */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={cn(
              "ml-auto px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              showStats
                ? "btn-gradient"
                : "bg-glass hover:bg-glass-hover text-muted-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Estatísticas
          </button>
        </div>

        {/* Stats Section */}
        {showStats && (
          <div className="mb-6">
            <HabitStats habitId={selectedHabitId || "all"} />
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-3">
          {filteredHabits.length === 0 ? (
            <div className="glass-card p-8 text-center animate-fade-in">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Nenhum hábito encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filter === "all"
                  ? "Comece adicionando seu primeiro hábito!"
                  : "Tente mudar os filtros"}
              </p>
              {filter === "all" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-gradient px-5 py-2 rounded-xl inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Hábito
                </button>
              )}
            </div>
          ) : (
            filteredHabits.map((habit, index) => (
              <div
                key={habit.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <HabitCard
                  habit={habit}
                  onToggle={handleToggle}
                  onEdit={(id) => console.log("Edit", id)}
                  onDelete={handleDelete}
                  onStats={handleStats}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </DashboardLayout>
  );
};

export default Habits;
