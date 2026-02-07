import { useState } from "react";
import { Trophy, Users, Settings, Medal, Crown, Filter, Plus, MessageCircle, Target, Flame } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSocial } from "@/hooks/useSocial";
import { useAchievementsContext } from "@/contexts/AchievementsContext";
import { useSupabaseChallenges } from "@/hooks/useSupabaseChallenges";
import XPProgressBar from "@/components/achievements/XPProgressBar";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import CreateChallengeModal from "@/components/challenges/CreateChallengeModal";
import ChallengeLeaderboard from "@/components/challenges/ChallengeLeaderboard";
import { Challenge } from "@/types/challenges";
import { LEVEL_EMOJIS, UserLevel } from "@/types/achievements";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "weekly" | "monthly" | "yearly";

const Community = () => {
  const [filter, setFilter] = useState<FilterType>("weekly");
  const [activeTab, setActiveTab] = useState("challenges");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const { groups, getFilteredRanking, getUserPosition } = useSocial();
  const { state } = useAchievementsContext();
  const { 
    challenges, 
    loading: challengesLoading, 
    createChallenge, 
    joinChallenge, 
    leaveChallenge,
    getActiveChallenges,
    getAvailableChallenges,
  } = useSupabaseChallenges();
  
  const ranking = getFilteredRanking(filter);
  const userPosition = getUserPosition();
  const currentUser = ranking.find(u => u.isCurrentUser);

  const activeChallenges = getActiveChallenges();
  const availableChallenges = getAvailableChallenges();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "agora";
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  const handleViewLeaderboard = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowLeaderboard(true);
  };

  return (
    <DashboardLayout activeNav="/community">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-3 rounded-xl bg-primary">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comunidade</h1>
            <p className="text-sm text-muted-foreground">Desafios, ranking e grupos</p>
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
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
            <TabsTrigger value="challenges" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Target className="w-4 h-4 mr-2" />
              Desafios
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Grupos
            </TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Desafio
              </Button>
            </div>

            {challengesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : (
              <>
                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      Seus Desafios Ativos
                    </h3>
                    <div className="space-y-4">
                      {activeChallenges.map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          onJoin={joinChallenge}
                          onLeave={leaveChallenge}
                          onViewLeaderboard={handleViewLeaderboard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Challenges */}
                {availableChallenges.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Desafios Disponíveis
                    </h3>
                    <div className="space-y-4">
                      {availableChallenges.map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          onJoin={joinChallenge}
                          onLeave={leaveChallenge}
                          onViewLeaderboard={handleViewLeaderboard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {challenges.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Nenhum desafio ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie o primeiro desafio e convide amigos para participar!
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Desafio
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

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
                    filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  {f === "weekly" ? "Semanal" : f === "monthly" ? "Mensal" : "Anual"}
                </button>
              ))}
            </div>

            {/* Podium */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-6 text-center text-foreground">🏆 Pódio</h3>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-2xl mb-2">
                    {ranking[1]?.avatar}
                  </div>
                  <Medal className="w-6 h-6 text-gray-400" />
                  <p className="text-sm font-medium truncate max-w-16 text-foreground">{ranking[1]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{ranking[1]?.points} pts</p>
                  <div className="w-16 h-20 bg-gray-500/20 rounded-t-lg mt-2" />
                </div>

                {/* 1st place */}
                <div className="flex flex-col items-center -mt-6">
                  <Crown className="w-6 h-6 text-yellow-400 mb-1 animate-bounce" />
                  <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-3xl mb-2 ring-4 ring-yellow-400/30">
                    {ranking[0]?.avatar}
                  </div>
                  <Medal className="w-8 h-8 text-yellow-400" />
                  <p className="font-bold truncate max-w-20 text-foreground">{ranking[0]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-yellow-500 font-medium">{ranking[0]?.points} pts</p>
                  <div className="w-20 h-28 bg-yellow-500/20 rounded-t-lg mt-2" />
                </div>

                {/* 3rd place */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-2xl mb-2">
                    {ranking[2]?.avatar}
                  </div>
                  <Medal className="w-6 h-6 text-orange-400" />
                  <p className="text-sm font-medium truncate max-w-16 text-foreground">{ranking[2]?.name.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{ranking[2]?.points} pts</p>
                  <div className="w-16 h-14 bg-orange-500/20 rounded-t-lg mt-2" />
                </div>
              </div>
            </div>

            {/* Your Position Card */}
            {currentUser && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
                    #{userPosition}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/50 flex items-center justify-center text-2xl">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">Você</p>
                    <p className="text-sm text-muted-foreground">{LEVEL_EMOJIS[state.level as UserLevel]} {state.level}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{state.totalPoints}</p>
                </div>
              </div>
            )}

            {/* Full Ranking */}
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <h3 className="font-semibold mb-4 text-foreground">Ranking Completo</h3>
              {ranking.slice(0, 10).map((user, index) => (
                <div
                  key={user.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all",
                    user.isCurrentUser ? "bg-primary/20 border border-primary/30" : "bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-yellow-500 text-white" :
                    index === 1 ? "bg-gray-400 text-white" :
                    index === 2 ? "bg-orange-500 text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-medium truncate", user.isCurrentUser && "text-primary")}>
                      {user.name} {user.isCurrentUser && "(Você)"}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.level}</p>
                  </div>
                  <p className="font-bold text-foreground">{user.points}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Grupo
              </Button>
            </div>

            {groups.map((group) => (
              <div key={group.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-2xl">
                      {group.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members.length} membros</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>

                {/* Financial Goal */}
                {group.financialGoal && (
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Meta do Grupo</span>
                      <span className="font-medium text-foreground">
                        R$ {group.financialCurrent?.toLocaleString()} / R$ {group.financialGoal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(group.financialCurrent || 0) / group.financialGoal * 100} className="h-3" />
                  </div>
                )}

                {/* Active Challenge */}
                {group.challenges[0] && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-foreground">Desafio Ativo</span>
                    </div>
                    <p className="font-medium text-foreground">{group.challenges[0].name}</p>
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
                        <span className="font-medium text-foreground">{activity.memberName}</span>{" "}
                        <span className="text-muted-foreground">{activity.description}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateChallengeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createChallenge}
      />

      <ChallengeLeaderboard
        challenge={selectedChallenge}
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </DashboardLayout>
  );
};

export default Community;
