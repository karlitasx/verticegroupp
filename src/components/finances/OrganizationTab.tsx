import { useState } from "react";
import { Settings, Tag, CreditCard, Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { personalCategories, businessCategories, type FinanceCategory } from "@/lib/financeCategories";
import { EmptyState } from "@/components/ui/empty-state";

interface OrganizationTabProps {
  financeType: "personal" | "business";
}

// Define which categories are income vs expense
const incomeCategories = ["Salário", "Investimento", "Presente", "Receita de Vendas", "Serviços Prestados"];

const OrganizationTab = ({ financeType }: OrganizationTabProps) => {
  const [subTab, setSubTab] = useState("categories");

  const categories = financeType === "business" ? businessCategories : personalCategories;

  const receitas = categories.filter((c) => incomeCategories.includes(c.name));
  const despesas = categories.filter((c) => !incomeCategories.includes(c.name));

  // Add default income categories for personal if missing
  const personalReceitas: FinanceCategory[] = financeType === "personal"
    ? [
        ...receitas,
        ...(receitas.find(r => r.name === "Salário") ? [] : []),
        { name: "Freelance", icon: receitas[0]?.icon || DollarSign, color: "#22c55e" },
        { name: "Renda Extra", icon: receitas[0]?.icon || DollarSign, color: "#22c55e" },
        { name: "Outros", icon: receitas[0]?.icon || DollarSign, color: "#22c55e" },
      ].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
    : receitas;

  const displayReceitas = financeType === "personal" ? personalReceitas : receitas;

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

      {/* Sub Tabs */}
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

        {/* Categorias */}
        <TabsContent value="categories" className="space-y-6 mt-6">
          {/* Categorias Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Categorias</h3>
              <p className="text-sm text-muted-foreground">Organize suas transações por categorias</p>
            </div>
            <Button className="btn-gradient gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Nova Categoria
            </Button>
          </div>

          {/* Receitas Section */}
          <CategorySection
            title="Receitas"
            count={displayReceitas.length}
            categories={displayReceitas}
            type="income"
          />

          {/* Despesas Section */}
          <CategorySection
            title="Despesas"
            count={despesas.length}
            categories={despesas}
            type="expense"
          />
        </TabsContent>

        {/* Cartões */}
        <TabsContent value="cards" className="mt-6">
          <EmptyState
            icon={CreditCard}
            title="Cartões em breve"
            description="Gerencie seus cartões de crédito e débito. Disponível em breve!"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CategorySectionProps {
  title: string;
  count: number;
  categories: FinanceCategory[];
  type: "income" | "expense";
}

const CategorySection = ({ title, count, categories, type }: CategorySectionProps) => {
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
          {count}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="glass-card rounded-xl p-4 flex items-center gap-3 group hover:shadow-md transition-all"
              style={{ borderLeft: `3px solid ${cat.color}` }}
            >
              <div
                className="p-2.5 rounded-full"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{cat.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${labelBg}`}>
                  {labelText}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationTab;
