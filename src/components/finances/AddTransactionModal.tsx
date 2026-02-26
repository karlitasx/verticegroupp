import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { personalCategories, businessCategories, type FinanceCategory } from "@/lib/financeCategories";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  financeType?: "personal" | "business";
  onAdd: (transaction: {
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    recurring: boolean;
    finance_type?: "personal" | "business";
    cnpj?: string;
    invoice_number?: string;
    cost_center?: string;
  }) => void;
}

const AddTransactionModal = ({
  isOpen,
  onClose,
  onAdd,
  financeType = "personal",
}: AddTransactionModalProps) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [recurring, setRecurring] = useState(false);
  // Business fields
  const [cnpj, setCnpj] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [costCenter, setCostCenter] = useState("");

  const categories: FinanceCategory[] = financeType === "business" ? businessCategories : personalCategories;
  const isBusiness = financeType === "business";

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
      finance_type: financeType,
      ...(isBusiness && cnpj ? { cnpj } : {}),
      ...(isBusiness && invoiceNumber ? { invoice_number: invoiceNumber } : {}),
      ...(isBusiness && costCenter ? { cost_center: costCenter } : {}),
    });

    setAmount("");
    setDescription("");
    setCategory("");
    setDate(new Date());
    setRecurring(false);
    setType("expense");
    setCnpj("");
    setInvoiceNumber("");
    setCostCenter("");
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
      <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isBusiness ? "Nova Transação Empresarial" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "expense"
                  ? "bg-destructive/20 text-destructive border border-destructive"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Despesa
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                type === "income"
                  ? "bg-green-500/20 text-green-500 border border-green-500"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input
              type="text"
              value={formatDisplayAmount()}
              onChange={handleAmountChange}
              className="text-2xl font-bold h-14 text-center"
              placeholder="R$ 0,00"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isBusiness ? "Ex: Pagamento fornecedor" : "Ex: Almoço no restaurante"}
            />
          </div>

          {/* Business-specific fields */}
          {isBusiness && (
            <div className="space-y-3 p-3 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dados Empresariais</p>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label>Nº Nota Fiscal</Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Ex: NF-001234"
                />
              </div>
              <div className="space-y-2">
                <Label>Centro de Custo</Label>
                <Input
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="Ex: Marketing, Operações"
                />
              </div>
            </div>
          )}

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
                        ? "ring-2 ring-primary bg-primary/10"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    title={cat.name}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </button>
                );
              })}
            </div>
            {category && (
              <p className="text-sm text-muted-foreground text-center">{category}</p>
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
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 btn-gradient"
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
