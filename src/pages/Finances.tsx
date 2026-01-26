import { useState, useEffect } from "react";
import { Plus, DollarSign, Star } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SummaryCards from "@/components/finances/SummaryCards";
import FinanceBarChart from "@/components/finances/FinanceBarChart";
import CategoryDonut from "@/components/finances/CategoryDonut";
import TransactionsList, { Transaction } from "@/components/finances/TransactionsList";
import AddTransactionModal from "@/components/finances/AddTransactionModal";
import FinanceFilters from "@/components/finances/FinanceFilters";
import SavingsGoal from "@/components/finances/SavingsGoal";
import WishlistTab from "@/components/finances/WishlistTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAchievementsContext } from "@/contexts/AchievementsContext";

const TRANSACTIONS_KEY = "vidaflow_transactions";

// Mock initial data
const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salário",
    category: "Salário",
    amount: 8500,
    type: "income",
    date: new Date(2025, 0, 5),
  },
  {
    id: "2",
    description: "Aluguel",
    category: "Moradia",
    amount: 1800,
    type: "expense",
    date: new Date(2025, 0, 10),
  },
  {
    id: "3",
    description: "Supermercado",
    category: "Alimentação",
    amount: 650,
    type: "expense",
    date: new Date(2025, 0, 12),
  },
  {
    id: "4",
    description: "Uber",
    category: "Transporte",
    amount: 85,
    type: "expense",
    date: new Date(2025, 0, 15),
  },
  {
    id: "5",
    description: "Cinema",
    category: "Lazer",
    amount: 120,
    type: "expense",
    date: new Date(2025, 0, 18),
  },
  {
    id: "6",
    description: "Farmácia",
    category: "Saúde",
    amount: 95,
    type: "expense",
    date: new Date(2025, 0, 20),
  },
  {
    id: "7",
    description: "Curso online",
    category: "Educação",
    amount: 197,
    type: "expense",
    date: new Date(2025, 0, 22),
  },
  {
    id: "8",
    description: "Freelance",
    category: "Salário",
    amount: 1500,
    type: "income",
    date: new Date(2025, 0, 23),
  },
];

const categoryData = [
  { name: "Alimentação", value: 850, color: "#f97316" },
  { name: "Transporte", value: 320, color: "#3b82f6" },
  { name: "Moradia", value: 1800, color: "#8b5cf6" },
  { name: "Lazer", value: 420, color: "#ec4899" },
  { name: "Saúde", value: 180, color: "#ef4444" },
  { name: "Educação", value: 350, color: "#14b8a6" },
];

const Finances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { incrementStat } = useAchievementsContext();

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRANSACTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const withDates = parsed.map((t: Transaction & { date: string }) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(withDates);
      } else {
        setTransactions(initialTransactions);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions(initialTransactions);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = 12450 + income - expenses;

  const handleAddTransaction = (transaction: {
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    recurring: boolean;
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update achievements
    incrementStat('transactionsLogged');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleClearFilters = () => {
    setSelectedPeriod("month");
    setSelectedType("all");
    setSelectedCategory(null);
  };

  // Handle savings from wishlist
  const handleSavingsTransaction = (amount: number, wishName: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: `Economia: ${wishName}`,
      category: "Investimento / Objetivo",
      amount,
      type: "expense", // It's technically an expense (money going out to savings)
      date: new Date(),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update achievements
    incrementStat('transactionsLogged');
  };

  // Filter transactions by type
  const filteredTransactions = transactions.filter((t) => {
    if (selectedType === "all") return true;
    return t.type === selectedType;
  });

  return (
    <DashboardLayout activeNav="/finances">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl logo-gradient">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Finanças</h1>
            <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
          </div>
        </div>

        {activeTab === "overview" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="logo-gradient gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-glass">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="wishlist"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            Meus Objetivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <SummaryCards balance={balance} income={income} expenses={expenses} />

          {/* Filters */}
          <FinanceFilters
            selectedPeriod={selectedPeriod}
            selectedType={selectedType}
            onPeriodChange={setSelectedPeriod}
            onTypeChange={setSelectedType}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="xl:col-span-2 space-y-6">
              <FinanceBarChart />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryDonut
                  data={categoryData}
                  selectedCategory={selectedCategory}
                  onCategoryClick={setSelectedCategory}
                />
                <SavingsGoal
                  goal={10000}
                  current={4300}
                  monthlyExpenses={expenses}
                  budgetLimit={4000}
                />
              </div>
            </div>

            {/* Right Column - Transactions */}
            <div className="xl:col-span-1">
              <TransactionsList
                transactions={filteredTransactions}
                onDelete={handleDeleteTransaction}
                categoryFilter={selectedCategory}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="animate-fade-in">
          <WishlistTab onSavingsTransaction={handleSavingsTransaction} />
        </TabsContent>
      </Tabs>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </DashboardLayout>
  );
};

export default Finances;
