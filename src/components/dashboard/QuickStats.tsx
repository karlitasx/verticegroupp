import { Target, Wallet, ListTodo, Trophy, TrendingUp, TrendingDown, Flame } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient: string;
}

const StatCard = ({ icon, label, value, subValue, trend, trendValue, gradient }: StatCardProps) => (
  <div className="glass-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer group active:scale-95">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs ${
          trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"
        }`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
          {trendValue}
        </div>
      )}
    </div>
    <p className="text-2xl font-bold group-hover:text-primary transition-colors">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
    {subValue && (
      <p className="text-sm text-primary mt-1 flex items-center gap-1">
        <Flame className="w-3 h-3 animate-pulse" />
        {subValue}
      </p>
    )}
  </div>
);

const QuickStats = () => {
  const stats = {
    habits: { completed: 5, total: 7, streak: 12 },
    finances: { balance: 12450.00, variation: 350.00 },
    tasks: { pending: 4 },
    ranking: { position: 15 },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard
        icon={<Target className="w-5 h-5 text-white" />}
        label="Hábitos hoje"
        value={`${stats.habits.completed}/${stats.habits.total}`}
        subValue={`${stats.habits.streak} dias de streak`}
        gradient="from-purple-500 to-indigo-600"
      />
      
      <StatCard
        icon={<Wallet className="w-5 h-5 text-white" />}
        label="Saldo atual"
        value={`R$ ${stats.finances.balance.toLocaleString("pt-BR")}`}
        trend={stats.finances.variation >= 0 ? "up" : "down"}
        trendValue={`${stats.finances.variation >= 0 ? "+" : ""}R$ ${stats.finances.variation.toLocaleString("pt-BR")}`}
        gradient="from-emerald-500 to-teal-600"
      />
      
      <StatCard
        icon={<ListTodo className="w-5 h-5 text-white" />}
        label="Tarefas pendentes"
        value={stats.tasks.pending}
        trend="neutral"
        trendValue="para hoje"
        gradient="from-orange-500 to-amber-600"
      />
      
      <StatCard
        icon={<Trophy className="w-5 h-5 text-white" />}
        label="Seu ranking"
        value={`#${stats.ranking.position}`}
        trend="up"
        trendValue="+3 posições"
        gradient="from-yellow-500 to-orange-500"
      />
    </div>
  );
};

export default QuickStats;
