import { useState, useMemo, useEffect } from "react";
import { Plus, Star, ArrowUpDown } from "lucide-react";
import WishCard, { Wish } from "@/components/wishlist/WishCard";
import AddWishModal from "@/components/wishlist/AddWishModal";
import WishCalculator from "@/components/wishlist/WishCalculator";
import CompletedWishes from "@/components/wishlist/CompletedWishes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STORAGE_KEY = "vidaflow_wishlist";

type SortOption = "priority" | "progress" | "value-asc" | "value-desc" | "date";

interface WishlistTabProps {
  onSavingsTransaction?: (amount: number, wishName: string) => void;
}

const WishlistTab = ({ onSavingsTransaction }: WishlistTabProps) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const withDates = parsed.map((w: Wish & { createdAt: string }) => ({
          ...w,
          createdAt: new Date(w.createdAt),
        }));
        setWishes(withDates);
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    }
  }, [wishes, isLoaded]);

  // Calculations
  const activeWishes = wishes.filter((w) => !w.completed);
  const totalValue = activeWishes.reduce((sum, w) => sum + w.totalValue, 0);
  const totalSaved = activeWishes.reduce((sum, w) => sum + w.savedValue, 0);
  const totalRemaining = totalValue - totalSaved;
  const overallProgress = totalValue > 0 ? (totalSaved / totalValue) * 100 : 0;

  // Sorting
  const sortedWishes = useMemo(() => {
    const active = [...activeWishes];
    
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return active.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case "progress":
        return active.sort(
          (a, b) =>
            b.savedValue / b.totalValue - a.savedValue / a.totalValue
        );
      case "value-asc":
        return active.sort((a, b) => a.totalValue - b.totalValue);
      case "value-desc":
        return active.sort((a, b) => b.totalValue - a.totalValue);
      case "date":
        return active.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      default:
        return active;
    }
  }, [activeWishes, sortBy]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleAddValue = (id: string, value: number) => {
    const wish = wishes.find(w => w.id === id);
    
    setWishes(
      wishes.map((w) => {
        if (w.id === id) {
          const newSaved = w.savedValue + value;
          const isNowCompleted = newSaved >= w.totalValue;
          
          return {
            ...w,
            savedValue: newSaved,
            completed: isNowCompleted,
          };
        }
        return w;
      })
    );

    // Create automatic transaction
    if (onSavingsTransaction && wish) {
      onSavingsTransaction(value, wish.name);
    }

    toast({
      title: "Economia registrada! 💰",
      description: `Você economizou ${formatCurrency(value)} para "${wish?.name}"`,
    });
  };

  const handleSaveWish = (wishData: Omit<Wish, "id" | "createdAt" | "completed">) => {
    if (editingWish) {
      setWishes(
        wishes.map((w) =>
          w.id === editingWish.id
            ? {
                ...w,
                ...wishData,
                completed: wishData.savedValue >= wishData.totalValue,
              }
            : w
        )
      );
      setEditingWish(null);
    } else {
      const newWish: Wish = {
        id: Date.now().toString(),
        ...wishData,
        createdAt: new Date(),
        completed: wishData.savedValue >= wishData.totalValue,
      };
      setWishes([newWish, ...wishes]);
    }
  };

  const handleEdit = (wish: Wish) => {
    setEditingWish(wish);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setWishes(wishes.filter((w) => w.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWish(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl logo-gradient">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Meus Objetivos</h2>
            <p className="text-sm text-muted-foreground">
              {activeWishes.length} objetivos ativos
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="logo-gradient gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Objetivo
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Já Economizado</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(totalSaved)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Falta</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso Geral</span>
            <span className="font-medium">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-glass border-white/20">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Ordenar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border-white/20">
            <DropdownMenuItem
              onClick={() => setSortBy("priority")}
              className={sortBy === "priority" ? "bg-white/10" : ""}
            >
              Por Prioridade
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("progress")}
              className={sortBy === "progress" ? "bg-white/10" : ""}
            >
              Por Progresso
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("value-desc")}
              className={sortBy === "value-desc" ? "bg-white/10" : ""}
            >
              Maior Valor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("value-asc")}
              className={sortBy === "value-asc" ? "bg-white/10" : ""}
            >
              Menor Valor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("date")}
              className={sortBy === "date" ? "bg-white/10" : ""}
            >
              Mais Recentes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Wishes Grid */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedWishes.map((wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                onAddValue={handleAddValue}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {sortedWishes.length === 0 && (
            <div className="glass-card p-12 text-center">
              <span className="text-6xl mb-4 block">🌟</span>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum objetivo ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Adicione seu primeiro objetivo e comece a economizar!
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="logo-gradient"
              >
                Adicionar Objetivo
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WishCalculator totalRemaining={totalRemaining} />
          <CompletedWishes wishes={wishes} />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddWishModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveWish}
        editingWish={editingWish}
      />
    </div>
  );
};

export default WishlistTab;
