import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  balance: number;
  income: number;
  expenses: number;
}

const SummaryCards = ({ balance, income, expenses }: SummaryCardsProps) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white/20">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-white/80">Saldo Total</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold">{formatCurrency(balance)}</p>
          <p className="text-sm text-white/60 mt-2">Atualizado agora</p>
        </div>
      </div>

      {/* Income Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-white/80">Receitas do Mês</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold">{formatCurrency(income)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80">+12% vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white/20">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-white/80">Despesas do Mês</span>
          </div>
          <p className="text-3xl md:text-4xl font-bold">{formatCurrency(expenses)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingDown className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80">-5% vs mês anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
