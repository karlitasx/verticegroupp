import { useState } from "react";
import { Plus, DollarSign, Star, Wallet } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SummaryCards from "@/components/finances/SummaryCards";
import FinanceBarChart from "@/components/finances/FinanceBarChart";
import CategoryDonut from "@/components/finances/CategoryDonut";
import TransactionsList from "@/components/finances/TransactionsList";
import AddTransactionModal from "@/components/finances/AddTransactionModal";
import FinanceFilters from "@/components/finances/FinanceFilters";
import SavingsGoal from "@/components/finances/SavingsGoal";
import WishlistTab from "@/components/finances/WishlistTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useSupabaseFinances } from "@/hooks/useSupabaseFinances";

const Finances = () => {
  const { transactions, isLoaded, stats, addTransaction, deleteTransaction, filterTransactions, getCategoryData } = useSupabaseFinances();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">("all");
  const [activeTab, setActiveTab] = useState("overview");

  const categoryData = getCategoryData();

  const handleAddTransaction = async (transaction: {
    description: string;
    category: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    recurring: boolean;
  }) => {
    await addTransaction({
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  const handleClearFilters = () => {
    setSelectedPeriod("month");
    setSelectedType("all");
    setSelectedCategory(null);
  };

  const handleSavingsTransaction = async (amount: number, wishName: string) => {
    await addTransaction({
      description: `Economia: ${wishName}`,
      category: "Investimento / Objetivo",
      amount,
      type: "expense",
      date: new Date(),
    });
  };

  const filteredTransactions = filterTransactions(selectedType);

  if (!isLoaded) {
    return (
      <DashboardLayout activeNav="/finances">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="/finances">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Finanças</h1>
            <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
          </div>
        </div>

        {activeTab === "overview" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient gap-2"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-muted/50">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="wishlist"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Star className="w-4 h-4 mr-2" />
            Meus Objetivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          {transactions.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Nenhuma transação ainda"
              description="Registre sua primeira receita ou despesa para começar a acompanhar suas finanças."
              action={{
                label: "Adicionar Transação",
                onClick: () => setIsModalOpen(true),
              }}
            />
          ) : (
            <>
              {/* Summary Cards */}
              <SummaryCards balance={stats.balance} income={stats.income} expenses={stats.expenses} />

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
                      current={Math.max(0, stats.balance)}
                      monthlyExpenses={stats.expenses}
                      budgetLimit={4000}
                    />
                  </div>
                </div>

                {/* Right Column - Transactions */}
                <div className="xl:col-span-1">
                  <TransactionsList
                    transactions={filteredTransactions.map(t => ({
                      ...t,
                      date: t.date,
                    }))}
                    onDelete={handleDeleteTransaction}
                    categoryFilter={selectedCategory}
                  />
                </div>
              </div>
            </>
          )}
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
