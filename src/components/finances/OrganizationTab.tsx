import { useState } from "react";
import {
  Settings, Tag, CreditCard, Plus, Pencil, Trash2, DollarSign, X, Check,
  ShoppingBag, Utensils, Car, Home, Gamepad2, Heart, GraduationCap,
  Briefcase, Banknote, Gift, Truck, Users, FileText, Receipt, Landmark,
  Package, Wrench, Megaphone, Building2, Target, Wallet, Star, type LucideIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { personalCategories, businessCategories, type FinanceCategory } from "@/lib/financeCategories";
import { useFinanceCategories, type FinanceCategoryRecord } from "@/hooks/useFinanceCategories";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrganizationTabProps {
  financeType: "personal" | "business";
}

// Icon map for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Tag, ShoppingBag, Utensils, Car, Home, Gamepad2, Heart, GraduationCap,
  Briefcase, Banknote, Gift, Truck, Users, FileText, Receipt, Landmark,
  Package, Wrench, Megaphone, Building2, Target, Wallet, Star, CreditCard,
  DollarSign, Settings,
};

const availableIcons = Object.keys(iconMap);

const availableColors = [
  "#f97316", "#3b82f6", "#8b5cf6", "#ec4899", "#ef4444",
  "#14b8a6", "#f59e0b", "#22c55e", "#6366f1", "#a855f7",
  "#6b7280", "#10b981",
];

const incomeCategories = ["Salário", "Investimento", "Presente", "Freelance", "Renda Extra", "Outros", "Receita de Vendas", "Serviços Prestados"];

const OrganizationTab = ({ financeType }: OrganizationTabProps) => {
  const [subTab, setSubTab] = useState("categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<FinanceCategoryRecord | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("Tag");
  const [formColor, setFormColor] = useState("#6b7280");
  const [formType, setFormType] = useState<"income" | "expense">("expense");

  const { categories: customCategories, isLoaded, addCategory, updateCategory, deleteCategory } =
    useFinanceCategories(financeType);

  // Merge default + custom categories
  const defaultCats = financeType === "business" ? businessCategories : personalCategories;

  const allCategories: (FinanceCategory & { id?: string; isCustom?: boolean })[] = [
    ...defaultCats.map((c) => ({ ...c, isCustom: false })),
    ...customCategories.map((c) => ({
      name: c.name,
      icon: iconMap[c.icon_name] || Tag,
      color: c.color,
      id: c.id,
      isCustom: true,
      _type: c.type,
    })),
  ];

  const receitas = allCategories.filter((c) => {
    if ((c as any)._type) return (c as any)._type === "income";
    return incomeCategories.includes(c.name);
  });

  const despesas = allCategories.filter((c) => {
    if ((c as any)._type) return (c as any)._type === "expense";
    return !incomeCategories.includes(c.name);
  });

  const openCreateModal = () => {
    setEditingCat(null);
    setFormName("");
    setFormIcon("Tag");
    setFormColor("#6b7280");
    setFormType("expense");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: FinanceCategoryRecord) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormIcon(cat.icon_name);
    setFormColor(cat.color);
    setFormType(cat.type);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    if (editingCat) {
      await updateCategory(editingCat.id, {
        name: formName.trim(),
        icon_name: formIcon,
        color: formColor,
        type: formType,
      });
      toast.success("Categoria atualizada!");
    } else {
      await addCategory({
        name: formName.trim(),
        icon_name: formIcon,
        color: formColor,
        type: formType,
        finance_type: financeType,
      });
      toast.success("Categoria criada!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    toast.success("Categoria excluída!");
  };

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-muted">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Organização</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas categorias e cartões</p>
        </div>
      </div>

      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
          >
            <Tag className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Cartões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Categorias</h3>
              <p className="text-sm text-muted-foreground">Organize suas transações por categorias</p>
            </div>
            <Button onClick={openCreateModal} className="btn-gradient gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          </div>

          <CategorySection
            title="Receitas"
            categories={receitas}
            type="income"
            onEdit={openEditModal}
            onDelete={handleDelete}
            customCategories={customCategories}
          />

          <CategorySection
            title="Despesas"
            categories={despesas}
            type="expense"
            onEdit={openEditModal}
            onDelete={handleDelete}
            customCategories={customCategories}
          />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <EmptyState
            icon={CreditCard}
            title="Cartões em breve"
            description="Gerencie seus cartões de crédito e débito. Disponível em breve!"
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCat ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Name */}
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Alimentação"
                maxLength={50}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormType("income")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formType === "income"
                      ? "bg-green-500/20 text-green-600 border border-green-500"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Receita
                </button>
                <button
                  onClick={() => setFormType("expense")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    formType === "expense"
                      ? "bg-red-500/20 text-red-600 border border-red-500"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Despesa
                </button>
              </div>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label>Ícone</Label>
              <div className="grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto">
                {availableIcons.map((iconName) => {
                  const Icon = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => setFormIcon(iconName)}
                      className={`p-2 rounded-lg transition-all ${
                        formIcon === iconName
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <Icon className="w-4 h-4" style={{ color: formColor }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Prévia</Label>
              <div
                className="glass-card rounded-xl p-4 flex items-center gap-3"
                style={{ borderLeft: `3px solid ${formColor}` }}
              >
                <div className="p-2.5 rounded-full" style={{ backgroundColor: `${formColor}20` }}>
                  {(() => {
                    const PreviewIcon = iconMap[formIcon] || Tag;
                    return <PreviewIcon className="w-5 h-5" style={{ color: formColor }} />;
                  })()}
                </div>
                <div>
                  <p className="font-medium text-sm">{formName || "Nome da categoria"}</p>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      formType === "income" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {formType === "income" ? "Receita" : "Despesa"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1 btn-gradient" disabled={!formName.trim()}>
                <Check className="w-4 h-4 mr-1" />
                {editingCat ? "Salvar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Category Section ---

interface CategorySectionProps {
  title: string;
  categories: (FinanceCategory & { id?: string; isCustom?: boolean })[];
  type: "income" | "expense";
  onEdit: (cat: FinanceCategoryRecord) => void;
  onDelete: (id: string) => void;
  customCategories: FinanceCategoryRecord[];
}

const CategorySection = ({ title, categories, type, onEdit, onDelete, customCategories }: CategorySectionProps) => {
  const titleColor = type === "income" ? "text-green-500" : "text-red-500";
  const badgeColor = type === "income" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500";
  const labelBg = type === "income" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600";
  const labelText = type === "income" ? "Receita" : "Despesa";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <DollarSign className={`w-4 h-4 ${titleColor}`} />
        <h4 className={`font-semibold ${titleColor}`}>{title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
          {categories.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const isCustom = cat.isCustom;
          const customRecord = isCustom
            ? customCategories.find((c) => c.id === cat.id)
            : null;

          return (
            <div
              key={cat.id || `default-${idx}`}
              className="glass-card rounded-xl p-4 flex items-center gap-3 group hover:shadow-md transition-all"
              style={{ borderLeft: `3px solid ${cat.color}` }}
            >
              <div className="p-2.5 rounded-full" style={{ backgroundColor: `${cat.color}20` }}>
                <Icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{cat.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${labelBg}`}>
                  {labelText}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isCustom && customRecord && (
                  <>
                    <button
                      onClick={() => onEdit(customRecord)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(customRecord.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {!isCustom && (
                  <span className="text-[10px] text-muted-foreground italic px-1">padrão</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationTab;
