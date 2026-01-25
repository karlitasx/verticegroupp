import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";

interface HabitStatsProps {
  habitId: string;
}

const HabitStats = ({ habitId }: HabitStatsProps) => {
  // Mock data - last 90 days
  const heatmapData = Array.from({ length: 90 }, () => Math.random());
  const monthlyData = [65, 70, 75, 68, 82, 78, 85, 88, 92, 86, 90, 94];

  const currentStreak = 12;
  const bestStreak = 21;
  const totalDays = 156;
  const completionRate = 87;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Flame className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">Streak Atual</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold">{bestStreak}</p>
          <p className="text-xs text-muted-foreground">Melhor Streak</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{totalDays}</p>
          <p className="text-xs text-muted-foreground">Dias Totais</p>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold">{completionRate}%</p>
          <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
        </div>
      </div>

      {/* Heat Map */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Últimos 90 dias</h3>
        <div className="grid grid-cols-15 gap-1">
          {heatmapData.map((value, index) => (
            <div
              key={index}
              className="aspect-square rounded-sm transition-all hover:scale-125"
              style={{
                backgroundColor:
                  value > 0.7
                    ? "rgb(34, 197, 94)"
                    : value > 0.4
                    ? "rgb(134, 239, 172)"
                    : value > 0
                    ? "rgb(187, 247, 208)"
                    : "rgba(255, 255, 255, 0.1)",
                opacity: value > 0 ? 0.5 + value * 0.5 : 0.3,
              }}
              title={`Dia ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-1">
            {[0.1, 0.3, 0.5, 0.7, 1].map((opacity) => (
              <div
                key={opacity}
                className="w-3 h-3 rounded-sm bg-green-500"
                style={{ opacity }}
              />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="glass-card p-6">
        <h3 className="font-semibold mb-4">Taxa de Conclusão Mensal</h3>
        <div className="h-40 flex items-end gap-2">
          {monthlyData.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-primary to-accent transition-all hover:opacity-100 opacity-70"
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitStats;
