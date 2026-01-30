import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAchievementsContext } from "@/contexts/AchievementsContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Camera, 
  Trophy, 
  Target, 
  DollarSign, 
  Flame, 
  Bell, 
  Moon, 
  Globe, 
  LogOut,
  Edit3,
  Check,
  X,
  Star,
  TrendingUp,
  Heart
} from "lucide-react";
import { toast } from "sonner";
import XPProgressBar from "@/components/achievements/XPProgressBar";
import { LEVEL_EMOJIS } from "@/types/achievements";

interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'pt-BR' | 'en-US' | 'es';
  currency: 'BRL' | 'USD' | 'EUR';
  notifications: {
    habits: boolean;
    finances: boolean;
    achievements: boolean;
    streaks: boolean;
    community: boolean;
  };
}

interface UserStats {
  totalHabits: number;
  habitsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalSaved: number;
  wishesCompleted: number;
  totalXP: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  memberSince: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { state, getAllAchievements, getUnlockedCount, getTotalCount } = useAchievementsContext();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('vidaflow_preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      language: 'pt-BR',
      currency: 'BRL',
      notifications: {
        habits: true,
        finances: true,
        achievements: true,
        streaks: true,
        community: true
      }
    };
  });

  // Get level info from state
  const currentLevel = state.level;
  const totalPoints = state.totalPoints;
  const levelProgress = state.levelProgress;

  const [profileStats, setProfileStats] = useState<UserStats>(() => {
    // Load stats from various localStorage sources
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const transactions = JSON.parse(localStorage.getItem('vidaflow_transactions') || '[]');
    const wishes = JSON.parse(localStorage.getItem('vidaflow_wishes') || '[]');
    
    const completedHabits = habits.filter((h: any) => h.completedToday).length;
    const completedWishes = wishes.filter((w: any) => w.completed).length;
    const totalSaved = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    return {
      totalHabits: habits.length,
      habitsCompleted: completedHabits,
      currentStreak: parseInt(localStorage.getItem('vidaflow_streak') || '0'),
      longestStreak: parseInt(localStorage.getItem('vidaflow_longest_streak') || '0'),
      totalSaved,
      wishesCompleted: completedWishes,
      totalXP: state.totalPoints,
      achievementsUnlocked: getUnlockedCount(),
      totalAchievements: getTotalCount(),
      memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Recém chegada'
    };
  });

  // Get user display name
  const userName = user?.user_metadata?.full_name 
    || user?.email?.split('@')[0] 
    || "Usuário";

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('vidaflow_avatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
    setEditedName(userName);
  }, [userName]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('vidaflow_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAvatarUrl(dataUrl);
        localStorage.setItem('vidaflow_avatar', dataUrl);
        toast.success("Avatar atualizado com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      // In a real app, this would update the user metadata
      localStorage.setItem('vidaflow_display_name', editedName);
      setIsEditingName(false);
      toast.success("Nome atualizado com sucesso!");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Até logo! 👋");
  };

  const updateNotificationPreference = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    toast.success("Preferência salva!");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const StatCard = ({ icon: Icon, label, value, color, subValue }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    color: string;
    subValue?: string;
  }) => (
    <div className="glass-card p-4 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {subValue && <p className="text-xs text-primary">{subValue}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout activeNav="/profile">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Header */}
        <Card className="glass-card border-glass-border overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src={avatarUrl || undefined} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="ml-32 pt-2">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="glass-input h-8 w-48"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveName}>
                      <Check className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)}>
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingName(true)}>
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {LEVEL_EMOJIS[currentLevel]} {currentLevel}
                </span>
                <span className="text-sm text-muted-foreground">
                  Membro desde {profileStats.memberSince}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XP Progress */}
        <Card className="glass-card border-glass-border">
          <CardContent className="pt-6">
            <XPProgressBar 
              currentPoints={totalPoints} 
              level={currentLevel}
              levelProgress={levelProgress}
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className="glass-card border-glass-border p-1 w-full">
            <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={Target} 
                label="Hábitos ativos" 
                value={profileStats.totalHabits}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard 
                icon={Flame} 
                label="Streak atual" 
                value={`${profileStats.currentStreak} dias`}
                color="bg-gradient-to-br from-orange-500 to-red-500"
                subValue={`Recorde: ${profileStats.longestStreak} dias`}
              />
              <StatCard 
                icon={Trophy} 
                label="Conquistas" 
                value={`${profileStats.achievementsUnlocked}/${profileStats.totalAchievements}`}
                color="bg-gradient-to-br from-yellow-500 to-amber-500"
              />
              <StatCard 
                icon={Star} 
                label="XP Total" 
                value={totalPoints.toLocaleString()}
                color="bg-gradient-to-br from-primary to-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card border-glass-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Hábitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completados hoje</span>
                    <span className="font-medium">{profileStats.habitsCompleted}/{profileStats.totalHabits}</span>
                  </div>
                  <Progress value={(profileStats.habitsCompleted / Math.max(profileStats.totalHabits, 1)) * 100} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de conclusão</span>
                    <span className="text-primary font-medium">
                      {profileStats.totalHabits > 0 
                        ? Math.round((profileStats.habitsCompleted / profileStats.totalHabits) * 100) 
                        : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-glass-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Finanças
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total economizado</span>
                    <span className="font-medium text-green-500">
                      R$ {profileStats.totalSaved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Objetivos alcançados</span>
                    <span className="font-medium">{profileStats.wishesCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Média de economia/mês</span>
                    <span className="text-primary font-medium">
                      R$ {(profileStats.totalSaved / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="animate-fade-in">
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle className="text-lg">Preferências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Tema</p>
                        <p className="text-sm text-muted-foreground">Aparência do aplicativo</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.theme}
                      onChange={(e) => setPreferences(p => ({ ...p, theme: e.target.value as any }))}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Idioma</p>
                        <p className="text-sm text-muted-foreground">Idioma da interface</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.language}
                      onChange={(e) => setPreferences(p => ({ ...p, language: e.target.value as any }))}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="pt-BR">Português (BR)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Moeda</p>
                        <p className="text-sm text-muted-foreground">Moeda para exibição</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.currency}
                      onChange={(e) => setPreferences(p => ({ ...p, currency: e.target.value as any }))}
                      className="glass-input px-3 py-2 rounded-lg"
                    >
                      <option value="BRL">R$ (BRL)</option>
                      <option value="USD">$ (USD)</option>
                      <option value="EUR">€ (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-glass-border">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="animate-fade-in">
            <Card className="glass-card border-glass-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Lembretes de Hábitos</p>
                      <p className="text-sm text-muted-foreground">Receber lembretes para completar hábitos</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.habits}
                    onCheckedChange={(v) => updateNotificationPreference('habits', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Alertas Financeiros</p>
                      <p className="text-sm text-muted-foreground">Notificações sobre gastos e metas</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.finances}
                    onCheckedChange={(v) => updateNotificationPreference('finances', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Conquistas</p>
                      <p className="text-sm text-muted-foreground">Alertas de novas conquistas desbloqueadas</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.achievements}
                    onCheckedChange={(v) => updateNotificationPreference('achievements', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Streaks em Risco</p>
                      <p className="text-sm text-muted-foreground">Aviso quando seu streak está prestes a zerar</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.streaks}
                    onCheckedChange={(v) => updateNotificationPreference('streaks', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Comunidade</p>
                      <p className="text-sm text-muted-foreground">Atualizações de grupos e desafios</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.community}
                    onCheckedChange={(v) => updateNotificationPreference('community', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
