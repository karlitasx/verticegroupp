import { useState } from "react";
import { Trophy, Users, Settings, Medal, Crown, Star, Filter, Plus, MessageCircle, Target } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSocial } from "@/hooks/useSocial";
import { useAchievementsContext } from "@/contexts/AchievementsContext";
import XPProgressBar from "@/components/achievements/XPProgressBar";
import { LEVEL_COLORS, LEVEL_EMOJIS, UserLevel } from "@/types/achievements";
import { cn } from "@/lib/utils";

type FilterType = "weekly" | "monthly" | "yearly";

const Community = () => {
  const [filter, setFilter] = useState<FilterType>("weekly");
  const [activeTab, setActiveTab] = useState("ranking");
  
  const { groups, getFilteredRanking, getUserPosition

 } = useSocial();
  const { state } = useAchievementsContext();
  
  const ranking = getFilteredRanking(filter);
  const userPosition = getUserPosition();
  const currentUser = ranking.find(u => u.isCurrentUser);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "agora";
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  return (
    <DashboardLayout activeNav="/community">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-3 rounded-xl logo-gradient">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Comunidade</h1>
            <p className="text-sm text-muted-foreground">Ranking, grupos e desafios</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6 animate-slide-up">
          <XPProgressBar 
            currentPoints={state.totalPoints} 
            level={state.level} 
            levelProgress={state.levelProgress} 
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-glass">
            <TabsTrigger value="ranking" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="space-y-6 animate-fade-in">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {(["weekly", "monthly", "yearly"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105",
                    filter === f ? "btn-gradient" : "bg-glass hover:bg-glass-hover text-muted-foreground"
                  )}
                >
                  {f === "weekly" ? "Semanal" : f === "monthly" ? "Mensal" : "Anual"}
                </button>
              ))}
            </div>

            {/* Podium */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-6 text-center">🏆 Pódio</h3>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl mb-2">
                    {ranking[1]?.avatar}
                  </div>
                  <Medal className="w-6 h-6 text-gray-400" />
                  <p className="text-sm font-medium truncate max-w-16">{ranking[1]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{ranking[1]?.points} pts</p>
                  <div className="w-16 h-20 bg-gradient-to-t from-gray-500/30 to-gray-400/30 rounded-t-lg mt-2" />
                </div>

                {/* 1st place */}
                <div className="flex flex-col items-center -mt-6">
                  <Crown className="w-6 h-6 text-yellow-400 mb-1 animate-bounce" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl mb-2 ring-4 ring-yellow-400/30">
                    {ranking[0]?.avatar}
                  </div>
                  <Medal className="w-8 h-8 text-yellow-400" />
                  <p className="font-bold truncate max-w-20">{ranking[0]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-yellow-400 font-medium">{ranking[0]?.points} pts</p>
                  <div className="w-20 h-28 bg-gradient-to-t from-yellow-500/30 to-yellow-400/30 rounded-t-lg mt-2" />
                </div>

                {/* 3rd place */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl mb-2">
                    {ranking[2]?.avatar}
                  </div>
                  <Medal className="w-6 h-6 text-orange-400" />
                  <p className="text-sm font-medium truncate max-w-16">{ranking[2]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{ranking[2]?.points} pts</p>
                  <div className="w-16 h-14 bg-gradient-to-t from-orange-500/30 to-orange-400/30 rounded-t-lg mt-2" />
                </div>
              </div>
            </div>

            {/* Your Position Card */}
            {currentUser && (
              <div className="glass-card p-4 border border-primary/30 bg-primary/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
                    #{userPosition}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">Você</p>
                    <p className="text-sm text-muted-foreground">{LEVEL_EMOJIS[state.level as UserLevel]} {state.level}</p>
                  </div>
                  <p className="text-2xl font-bold">{state.totalPoints}</p>
                </div>
              </div>
            )}

            {/* Full Ranking */}
            <div className="glass-card p-4 space-y-2">
              <h3 className="font-semibold mb-4">Ranking Completo</h3>
              {ranking.slice(0, 10).map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
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
                    <p className="text-xs text-muted-foreground">{user.level}</p>
                  </div>
                  <p className="font-bold">{user.points}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Button className="logo-gradient gap-2">
                <Plus className="w-4 h-4" />
                Criar Grupo
              </Button>
            </div>

            {groups.map((group) => (
              <div key={group.id} className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                      {group.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members.length} membros</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-glass border-white/20">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>

                {/* Financial Goal */}
                {group.financialGoal && (
                  <div className="p-4 rounded-xl bg-glass">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Meta do Grupo</span>
                      <span className="font-medium">
                        R$ {group.financialCurrent?.toLocaleString()} / R$ {group.financialGoal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(group.financialCurrent || 0) / group.financialGoal * 100} className="h-3" />
                  </div>
                )}

                {/* Active Challenge */}
                {group.challenges[0] && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Desafio Ativo</span>
                    </div>
                    <p className="font-medium">{group.challenges[0].name}</p>
                    <Progress 
                      value={group.challenges[0].currentValue / group.challenges[0].targetValue * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                )}

                {/* Recent Activity */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Atividade Recente</h4>
                  {group.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 text-sm">
                      <span className="text-lg">{activity.memberAvatar}</span>
                      <span className="flex-1">
                        <span className="font-medium">{activity.memberName}</span>{" "}
                        <span className="text-muted-foreground">{activity.description}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="animate-fade-in">
            <div className="glass-card p-8 text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Área Administrativa</h3>
              <p className="text-muted-foreground mb-4">
                Funcionalidades de administração disponíveis em breve.
              </p>
              <p className="text-sm text-muted-foreground">
                Gerencie grupos, moderação e configurações avançadas.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;
