import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Gamepad2,
  Heart,
  GraduationCap,
  Briefcase,
  Banknote,
  Gift,
} from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: {
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    recurring: boolean;
  }) => void;
}

const categories = [
  { name: "Alimentação", icon: Utensils, color: "#f97316" },
  { name: "Transporte", icon: Car, color: "#3b82f6" },
  { name: "Moradia", icon: Home, color: "#8b5cf6" },
  { name: "Lazer", icon: Gamepad2, color: "#ec4899" },
  { name: "Saúde", icon: Heart, color: "#ef4444" },
  { name: "Educação", icon: GraduationCap, color: "#14b8a6" },
  { name: "Compras", icon: ShoppingBag, color: "#f59e0b" },
  { name: "Salário", icon: Briefcase, color: "#22c55e" },
  { name: "Investimento", icon: Banknote, color: "#6366f1" },
  { name: "Presente", icon: Gift, color: "#a855f7" },
];

const AddTransactionModal = ({
  isOpen,
  onClose,
  onAdd,
}: AddTransactionModalProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [recurring, setRecurring] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (parseInt(value || "0") / 100).toFixed(2);
    setAmount(value);
  };

  const handleSubmit = () => {
    if (!amount || !description || !category) return;

    onAdd({
      description,
      category,
      amount: parseFloat(amount),
      type,
      date,
      recurring,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(new Date());
    setRecurring(false);
    setType("expense");
    onClose();
  };

  const formatDisplayAmount = () => {
    if (!amount) return "R$ 0,00";
    return parseFloat(amount).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900/95 border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "expense"
                  ? "bg-red-500/20 text-red-400 border border-red-400"
                  : "bg-glass hover:bg-white/10"
              }`}
            >
              Despesa
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "income"
                  ? "bg-green-500/20 text-green-400 border border-green-400"
                  : "bg-glass hover:bg-white/10"
              }`}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Valor</Label>
            <div className="relative">
              <Input
                type="text"
                value={formatDisplayAmount()}
                onChange={handleAmountChange}
                className="text-2xl font-bold h-14 bg-glass border-white/20 text-center"
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-glass border-white/20"
              placeholder="Ex: Almoço no restaurante"
            />
          </div>

          {/* Category Grid */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      category === cat.name
                        ? "ring-2 ring-primary bg-white/10"
                        : "bg-glass hover:bg-white/10"
                    }`}
                    title={cat.name}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </button>
                );
              })}
            </div>
            {category && (
              <p className="text-sm text-muted-foreground text-center">
                {category}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-glass border-white/20",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-white/20" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={recurring}
              onCheckedChange={(checked) => setRecurring(checked as boolean)}
            />
            <Label htmlFor="recurring" className="cursor-pointer">
              Transação recorrente (mensal)
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 logo-gradient"
              disabled={!amount || !description || !category}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
