import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Filter, ChevronLeft, ChevronRight, Flame, Target, Loader2 } from "lucide-react";
import { useGlobalRanking, RankingUser, RankingPeriod } from "@/hooks/useGlobalRanking";
import { LEVEL_EMOJIS, UserLevel } from "@/types/achievements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const PodiumCard = ({ 
  user, 
  position 
}: { 
  user: RankingUser | undefined; 
  position: 1 | 2 | 3;
}) => {
  if (!user) return null;

  const configs = {
    1: {
      size: "w-16 h-16",
      ring: "ring-4 ring-yellow-400/50",
      bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
      podiumHeight: "h-28",
      podiumBg: "bg-yellow-500/20",
      icon: <Crown className="w-6 h-6 text-yellow-400 mb-1 animate-bounce" />,
      medalColor: "text-yellow-400",
      medalSize: "w-8 h-8",
      nameClass: "font-bold",
      pointsColor: "text-yellow-500 font-medium",
    },
    2: {
      size: "w-14 h-14",
      ring: "ring-2 ring-gray-400/50",
      bg: "bg-gradient-to-br from-gray-400 to-gray-500",
      podiumHeight: "h-20",
      podiumBg: "bg-gray-500/20",
      icon: null,
      medalColor: "text-gray-400",
      medalSize: "w-6 h-6",
      nameClass: "font-medium text-sm",
      pointsColor: "text-muted-foreground",
    },
    3: {
      size: "w-14 h-14",
      ring: "ring-2 ring-orange-400/50",
      bg: "bg-gradient-to-br from-orange-400 to-orange-500",
      podiumHeight: "h-14",
      podiumBg: "bg-orange-500/20",
      icon: null,
      medalColor: "text-orange-400",
      medalSize: "w-6 h-6",
      nameClass: "font-medium text-sm",
      pointsColor: "text-muted-foreground",
    },
  };

  const config = configs[position];
  const firstName = user.displayName.split(" ")[0];

  return (
    <div className={cn("flex flex-col items-center", position === 1 && "-mt-6")}>
      {config.icon}
      <Link to={`/user/${user.userId}`}>
        <Avatar className={cn(config.size, config.ring, "mb-2 transition-transform hover:scale-105")}>
          <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
          <AvatarFallback className={config.bg}>
            <span className="text-2xl">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </Link>
      <Medal className={cn(config.medalSize, config.medalColor)} />
      <p className={cn("truncate max-w-20 text-foreground", config.nameClass)}>
        {firstName}
        {user.isCurrentUser && " (Você)"}
      </p>
      <p className={cn("text-xs", config.pointsColor)}>
        {user.totalPoints.toLocaleString()} pts
      </p>
      <div className={cn("w-20 rounded-t-lg mt-2", config.podiumHeight, config.podiumBg)} />
    </div>
  );
};

const RankingRow = ({ user }: { user: RankingUser }) => {
  const positionColors = {
    1: "bg-yellow-500 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-500 text-white",
  };

  return (
    <Link
      to={`/user/${user.userId}`}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]",
        user.isCurrentUser 
          ? "bg-primary/20 border border-primary/30" 
          : "bg-muted/50 hover:bg-muted"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
        positionColors[user.position as 1 | 2 | 3] || "bg-muted text-muted-foreground"
      )}>
        {user.position}
      </div>
      
      <Avatar className="w-10 h-10">
        <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
        <AvatarFallback className="bg-primary/30">
          {user.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", user.isCurrentUser && "text-primary")}>
          {user.displayName} {user.isCurrentUser && "(Você)"}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{LEVEL_EMOJIS[user.level]} {user.level}</span>
          {user.currentStreak > 0 && (
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {user.currentStreak}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-foreground">{user.totalPoints.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">pontos</p>
      </div>
    </Link>
  );
};

const GlobalRanking = () => {
  const {
    ranking,
    loading,
    period,
    setPeriod,
    currentPage,
    totalPages,
    goToPage,
    userPosition,
    currentUserData,
    getTopThree,
  } = useGlobalRanking();

  const [topThree, setTopThree] = useState<RankingUser[]>([]);

  useEffect(() => {
    getTopThree().then(setTopThree);
  }, [getTopThree]);

  const periodLabels: Record<RankingPeriod, string> = {
    all: "Geral",
    monthly: "Mensal",
    weekly: "Semanal",
  };

  if (loading && ranking.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(["all", "monthly", "weekly"] as RankingPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105",
              period === p 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-6 text-center text-foreground">🏆 Pódio</h3>
        <div className="flex items-end justify-center gap-4">
          <PodiumCard user={topThree[1]} position={2} />
          <PodiumCard user={topThree[0]} position={1} />
          <PodiumCard user={topThree[2]} position={3} />
        </div>
      </div>

      {/* Current User Card */}
      {currentUserData && userPosition && userPosition > 3 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
              #{userPosition}
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage src={currentUserData.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/50">
                {currentUserData.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-primary">Você</p>
              <p className="text-sm text-muted-foreground">
                {LEVEL_EMOJIS[currentUserData.level]} {currentUserData.level}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {currentUserData.totalPoints.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">pontos</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Ranking */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Ranking Completo</h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        {ranking.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum usuário no ranking ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ranking.map((user) => (
              <RankingRow key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalRanking;
