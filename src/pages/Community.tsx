import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Star, Flame, Target, Heart, Leaf, Filter } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

// Level definitions
const levels = [
  { name: "Iniciante", minPoints: 0, maxPoints: 100, color: "from-gray-400 to-gray-500" },
  { name: "Intermediária", minPoints: 101, maxPoints: 500, color: "from-green-400 to-green-600" },
  { name: "Avançada", minPoints: 501, maxPoints: 1000, color: "from-blue-400 to-blue-600" },
  { name: "Expert", minPoints: 1001, maxPoints: 2000, color: "from-purple-400 to-purple-600" },
  { name: "Mestre", minPoints: 2001, maxPoints: Infinity, color: "from-yellow-400 to-orange-500" },
];

// Badge definitions
const badges = [
  { id: "consistent", name: "Consistente", description: "7 dias seguidos", icon: Flame, color: "from-orange-400 to-red-500" },
  { id: "financial", name: "Financeira", description: "Meta de economia", icon: Target, color: "from-green-400 to-emerald-500" },
  { id: "social", name: "Social", description: "Top 10 ranking", icon: Heart, color: "from-pink-400 to-rose-500" },
  { id: "plant", name: "Plantinha Verde", description: "Planta florida", icon: Leaf, color: "from-lime-400 to-green-500" },
];

// Mock ranking data
const mockRanking = [
  { id: "1", name: "Ana Silva", avatar: "👩", points: 2450, badges: ["consistent", "financial", "plant"] },
  { id: "2", name: "Carlos Lima", avatar: "👨", points: 2100, badges: ["consistent", "social"] },
  { id: "3", name: "Maria Santos", avatar: "👧", points: 1850, badges: ["financial", "plant"] },
  { id: "4", name: "João Pedro", avatar: "🧑", points: 1620, badges: ["consistent"] },
  { id: "5", name: "Lucia Ferreira", avatar: "👩‍🦰", points: 1450, badges: ["social", "plant"] },
  { id: "6", name: "Pedro Costa", avatar: "👴", points: 1200, badges: ["financial"] },
  { id: "7", name: "Você", avatar: "😊", points: 980, badges: ["consistent", "plant"], isCurrentUser: true },
  { id: "8", name: "Fernanda Luz", avatar: "👩‍🦱", points: 850, badges: [] },
  { id: "9", name: "Roberto Dias", avatar: "🧔", points: 720, badges: ["social"] },
  { id: "10", name: "Julia Mendes", avatar: "👱‍♀️", points: 650, badges: ["plant"] },
];

type FilterType = "weekly" | "monthly" | "yearly";

const Community = () => {
  const [ranking, setRanking] = useState(mockRanking);
  const [filter, setFilter] = useState<FilterType>("weekly");
  const [userPoints, setUserPoints] = useState(980);
  const [userPosition, setUserPosition] = useState(7);

  // Load from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("vidaflow_points");
    if (savedPoints) {
      const points = parseInt(savedPoints);
      setUserPoints(points);
      
      // Update ranking with user points
      const updatedRanking = [...mockRanking];
      const userIndex = updatedRanking.findIndex(u => u.isCurrentUser);
      if (userIndex !== -1) {
        updatedRanking[userIndex].points = points;
        // Re-sort ranking
        updatedRanking.sort((a, b) => b.points - a.points);
        setRanking(updatedRanking);
        setUserPosition(updatedRanking.findIndex(u => u.isCurrentUser) + 1);
      }
    }
  }, []);

  // Get user level
  const getUserLevel = (points: number) => {
    return levels.find(l => points >= l.minPoints && points <= l.maxPoints) || levels[0];
  };

  const currentLevel = getUserLevel(userPoints);
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progressToNextLevel = nextLevel 
    ? Math.round(((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100)
    : 100;

  const currentUser = ranking.find(u => u.isCurrentUser);

  return (
    <DashboardLayout activeNav="/community">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl logo-gradient">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Comunidade</h1>
              <p className="text-sm text-muted-foreground">Ranking e conquistas</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["weekly", "monthly", "yearly"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105",
                  filter === f
                    ? "btn-gradient"
                    : "bg-glass hover:bg-glass-hover text-muted-foreground"
                )}
              >
                {f === "weekly" ? "Semanal" : f === "monthly" ? "Mensal" : "Anual"}
              </button>
            ))}
          </div>
        </div>

        {/* Your Position Card */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                  {currentUser?.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold border-2 border-primary">
                  #{userPosition}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Você</h2>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${currentLevel.color} text-white`}>
                  <Star className="w-3 h-3" />
                  {currentLevel.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gradient">{userPoints}</p>
              <p className="text-sm text-muted-foreground">pontos</p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextLevel && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{currentLevel.name}</span>
                <span>{nextLevel.name}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentLevel.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Faltam {nextLevel.minPoints - userPoints} pontos para {nextLevel.name}
              </p>
            </div>
          )}

          {/* User badges */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-glass-border">
            <span className="text-sm text-muted-foreground">Suas conquistas:</span>
            {currentUser?.badges.map(badgeId => {
              const badge = badges.find(b => b.id === badgeId);
              if (!badge) return null;
              const Icon = badge.icon;
              return (
                <div
                  key={badgeId}
                  className={`p-2 rounded-lg bg-gradient-to-br ${badge.color}`}
                  title={badge.name}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Points System Info */}
        <div className="glass-card p-4 mb-6 animate-slide-up animation-delay-100">
          <h3 className="font-semibold mb-3">Sistema de Pontos</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-glass">
              <p className="text-2xl font-bold text-gradient">10</p>
              <p className="text-xs text-muted-foreground">por hábito</p>
            </div>
            <div className="p-3 rounded-xl bg-glass">
              <p className="text-2xl font-bold text-gradient">50</p>
              <p className="text-xs text-muted-foreground">meta diária</p>
            </div>
            <div className="p-3 rounded-xl bg-glass">
              <p className="text-2xl font-bold text-gradient">100</p>
              <p className="text-xs text-muted-foreground">streak 7 dias</p>
            </div>
          </div>
        </div>

        {/* Podium - Top 3 */}
        <div className="glass-card p-6 mb-6 animate-slide-up animation-delay-200">
          <h3 className="font-semibold mb-6 text-center">Pódio</h3>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-3xl mb-2 hover:scale-110 transition-transform">
                {ranking[1]?.avatar}
              </div>
              <Medal className="w-8 h-8 text-gray-400 mb-1" />
              <p className="text-sm font-medium truncate max-w-20">{ranking[1]?.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{ranking[1]?.points} pts</p>
              <div className="w-20 h-24 bg-gradient-to-t from-gray-500/30 to-gray-400/30 rounded-t-lg mt-2" />
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center -mt-8">
              <Crown className="w-8 h-8 text-yellow-400 mb-1 animate-bounce" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl mb-2 ring-4 ring-yellow-400/30 hover:scale-110 transition-transform">
                {ranking[0]?.avatar}
              </div>
              <Medal className="w-10 h-10 text-yellow-400 mb-1" />
              <p className="text-sm font-bold truncate max-w-24">{ranking[0]?.name.split(" ")[0]}</p>
              <p className="text-xs text-yellow-400 font-medium">{ranking[0]?.points} pts</p>
              <div className="w-24 h-32 bg-gradient-to-t from-yellow-500/30 to-yellow-400/30 rounded-t-lg mt-2" />
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl mb-2 hover:scale-110 transition-transform">
                {ranking[2]?.avatar}
              </div>
              <Medal className="w-8 h-8 text-orange-400 mb-1" />
              <p className="text-sm font-medium truncate max-w-20">{ranking[2]?.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">{ranking[2]?.points} pts</p>
              <div className="w-20 h-16 bg-gradient-to-t from-orange-500/30 to-orange-400/30 rounded-t-lg mt-2" />
            </div>
          </div>
        </div>

        {/* Full Ranking List */}
        <div className="glass-card p-6 animate-slide-up animation-delay-300">
          <h3 className="font-semibold mb-4">Ranking Completo</h3>
          <div className="space-y-3">
            {ranking.map((user, index) => {
              const userLevel = getUserLevel(user.points);
              return (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.02]",
                    user.isCurrentUser ? "bg-primary/20 border border-primary/30" : "bg-glass hover:bg-glass-hover"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-yellow-500 text-white" :
                    index === 1 ? "bg-gray-400 text-white" :
                    index === 2 ? "bg-orange-500 text-white" :
                    "bg-glass text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium truncate", user.isCurrentUser && "text-primary")}>
                      {user.name} {user.isCurrentUser && "(Você)"}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${userLevel.color} text-white`}>
                      {userLevel.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {user.badges.slice(0, 3).map(badgeId => {
                      const badge = badges.find(b => b.id === badgeId);
                      if (!badge) return null;
                      const Icon = badge.icon;
                      return (
                        <div
                          key={badgeId}
                          className={`p-1.5 rounded-lg bg-gradient-to-br ${badge.color}`}
                          title={badge.name}
                        >
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                      );
                    })}
                  </div>

                  <p className="font-bold text-lg">{user.points}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Legend */}
        <div className="glass-card p-6 mt-6 animate-slide-up animation-delay-300">
          <h3 className="font-semibold mb-4">Conquistas Disponíveis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(badge => {
              const Icon = badge.icon;
              const hasBadge = currentUser?.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "p-4 rounded-xl text-center transition-all hover:scale-105",
                    hasBadge ? "bg-glass border border-primary/30" : "bg-glass/50 opacity-60"
                  )}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
