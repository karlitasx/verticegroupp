import { useState, useEffect, useCallback } from "react";
import { useAchievementsContext } from "@/contexts/AchievementsContext";

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  recurring?: boolean;
}

interface FinanceStats {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
}

const TRANSACTIONS_KEY = "vidaflow_transactions";
const BASE_BALANCE = 12450;

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

export const useFinances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const getStats = useCallback((): FinanceStats => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = BASE_BALANCE + income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return { income, expenses, balance, savingsRate };
  }, [transactions]);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    incrementStat("transactionsLogged");
    return newTransaction;
  }, [incrementStat]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const filterTransactions = useCallback(
    (type: "all" | "income" | "expense") => {
      if (type === "all") return transactions;
      return transactions.filter((t) => t.type === type);
    },
    [transactions]
  );

  const getCategoryData = useCallback(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    const colors: Record<string, string> = {
      "Alimentação": "#f97316",
      "Transporte": "#3b82f6",
      "Moradia": "#8b5cf6",
      "Lazer": "#ec4899",
      "Saúde": "#ef4444",
      "Educação": "#14b8a6",
      "Investimento / Objetivo": "#10b981",
    };

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "#6b7280",
    }));
  }, [transactions]);

  return {
    transactions,
    isLoaded,
    stats: getStats(),
    addTransaction,
    deleteTransaction,
    filterTransactions,
    getCategoryData,
  };
};
