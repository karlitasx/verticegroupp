import {
  ShoppingBag, Utensils, Car, Home, Gamepad2, Heart, GraduationCap,
  Briefcase, Banknote, Gift, Building2, Truck, Users, FileText,
  Receipt, Landmark, Package, Wrench, Megaphone, LucideIcon,
} from "lucide-react";

export interface FinanceCategory {
  name: string;
  icon: LucideIcon;
  color: string;
}

export const personalCategories: FinanceCategory[] = [
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

export const businessCategories: FinanceCategory[] = [
  { name: "Receita de Vendas", icon: Banknote, color: "#22c55e" },
  { name: "Serviços Prestados", icon: Wrench, color: "#3b82f6" },
  { name: "Fornecedores", icon: Truck, color: "#f97316" },
  { name: "Folha de Pagamento", icon: Users, color: "#8b5cf6" },
  { name: "Impostos", icon: Landmark, color: "#ef4444" },
  { name: "Aluguel Comercial", icon: Building2, color: "#6366f1" },
  { name: "Marketing", icon: Megaphone, color: "#ec4899" },
  { name: "Materiais/Estoque", icon: Package, color: "#f59e0b" },
  { name: "Nota Fiscal", icon: Receipt, color: "#14b8a6" },
  { name: "Despesas Gerais", icon: FileText, color: "#6b7280" },
];

export const categoryColors: Record<string, string> = {
  // Personal
  "Alimentação": "#f97316",
  "Transporte": "#3b82f6",
  "Moradia": "#8b5cf6",
  "Lazer": "#ec4899",
  "Saúde": "#ef4444",
  "Educação": "#14b8a6",
  "Compras": "#f59e0b",
  "Salário": "#22c55e",
  "Investimento": "#6366f1",
  "Investimento / Objetivo": "#10b981",
  "Presente": "#a855f7",
  // Business
  "Receita de Vendas": "#22c55e",
  "Serviços Prestados": "#3b82f6",
  "Fornecedores": "#f97316",
  "Folha de Pagamento": "#8b5cf6",
  "Impostos": "#ef4444",
  "Aluguel Comercial": "#6366f1",
  "Marketing": "#ec4899",
  "Materiais/Estoque": "#f59e0b",
  "Nota Fiscal": "#14b8a6",
  "Despesas Gerais": "#6b7280",
};
