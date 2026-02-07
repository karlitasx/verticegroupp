import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAchievementsContext } from "@/contexts/AchievementsContext";
import { useThemeContext } from "@/contexts/ThemeContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
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
  Heart,
  Loader2
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

const Profile = () => {
  const { user, signOut } = useAuth();
  const { 
    profile, 
    stats: dbStats, 
    isLoading, 
    isUploading, 
    displayName, 
    getInitials, 
    updateProfile, 
    uploadAvatar 
  } = useProfile();
  const { state, getUnlockedCount, getTotalCount } = useAchievementsContext();
  const { theme, setTheme } = useThemeContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  
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
  const totalPoints = dbStats?.total_points || state.totalPoints;
  const levelProgress = state.levelProgress;

  // Computed stats
  const achievementsUnlocked = getUnlockedCount();
  const totalAchievements = getTotalCount();
  const currentStreak = dbStats?.current_streak || 0;
  const longestStreak = dbStats?.longest_streak || 0;
  const habitsCompleted = dbStats?.habits_completed || 0;
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('pt-BR') 
    : 'Recentemente';

  // Update edited name when profile loads
  useEffect(() => {
    if (displayName) {
      setEditedName(displayName);
    }
  }, [displayName]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('vidaflow_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleSaveName = async () => {
    if (editedName.trim()) {
      await updateProfile({ display_name: editedName.trim() });
      setIsEditingName(false);
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

  const StatCard = ({ icon: Icon, label, value, subValue }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    subValue?: string;
  }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xl font-semibold text-foreground truncate">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {subValue && <p className="text-xs text-accent">{subValue}</p>}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout activeNav="/profile">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNav="/profile">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Profile Header */}
        <Card className="bg-card border-border overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary/80 to-secondary/80" />
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="absolute -top-10 left-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-4 border-card shadow-lg">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-foreground" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="ml-28 pt-2">
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="h-8 w-48 bg-muted border-border"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveName} className="h-8 w-8">
                      <Check className="w-4 h-4 text-success" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)} className="h-8 w-8">
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-semibold text-foreground">{displayName}</h1>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingName(true)} className="h-8 w-8">
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary text-sm font-medium">
                  {LEVEL_EMOJIS[currentLevel]} {currentLevel}
                </span>
                <span className="text-xs text-muted-foreground">
                  Membro desde {memberSince}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XP Progress */}
        <Card className="bg-card border-border">
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
          <TabsList className="bg-card border border-border p-1 w-full">
            <TabsTrigger value="stats" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard 
                icon={Target} 
                label="Hábitos completados" 
                value={habitsCompleted}
              />
              <StatCard 
                icon={Flame} 
                label="Streak atual" 
                value={`${currentStreak} dias`}
                subValue={longestStreak > 0 ? `Recorde: ${longestStreak} dias` : undefined}
              />
              <StatCard 
                icon={Trophy} 
                label="Conquistas" 
                value={`${achievementsUnlocked}/${totalAchievements}`}
              />
              <StatCard 
                icon={Star} 
                label="XP Total" 
                value={totalPoints.toLocaleString()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Progresso de Hábitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total completados</span>
                    <span className="font-medium">{habitsCompleted}</span>
                  </div>
                  <Progress value={Math.min((habitsCompleted / 100) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Continue completando hábitos para subir de nível!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desbloqueadas</span>
                    <span className="font-medium">{achievementsUnlocked} de {totalAchievements}</span>
                  </div>
                  <Progress value={(achievementsUnlocked / totalAchievements) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Complete ações para desbloquear conquistas!
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="animate-fade-in">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Preferências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Moon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tema</p>
                        <p className="text-xs text-muted-foreground">Aparência do app</p>
                      </div>
                    </div>
                    <select 
                      value={theme}
                      onChange={(e) => {
                        const newTheme = e.target.value as 'dark' | 'light' | 'system';
                        setTheme(newTheme);
                        setPreferences(p => ({ ...p, theme: newTheme }));
                        toast.success("Tema atualizado!");
                      }}
                      className="bg-muted border border-border text-foreground px-3 py-1.5 rounded-md text-sm"
                    >
                      <option value="dark">Escuro</option>
                      <option value="light">Claro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Idioma</p>
                        <p className="text-xs text-muted-foreground">Idioma da interface</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.language}
                      onChange={(e) => {
                        const newLang = e.target.value as 'pt-BR' | 'en-US' | 'es';
                        setPreferences(p => ({ ...p, language: newLang }));
                        updateProfile({ language: newLang });
                      }}
                      className="bg-muted border border-border text-foreground px-3 py-1.5 rounded-md text-sm"
                    >
                      <option value="pt-BR">Português (BR)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Moeda</p>
                        <p className="text-xs text-muted-foreground">Moeda para exibição</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.currency}
                      onChange={(e) => {
                        const newCurrency = e.target.value as 'BRL' | 'USD' | 'EUR';
                        setPreferences(p => ({ ...p, currency: newCurrency }));
                        updateProfile({ currency: newCurrency });
                      }}
                      className="bg-muted border border-border text-foreground px-3 py-1.5 rounded-md text-sm"
                    >
                      <option value="BRL">R$ (BRL)</option>
                      <option value="USD">$ (USD)</option>
                      <option value="EUR">€ (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
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
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Lembretes de Hábitos</p>
                      <p className="text-xs text-muted-foreground">Receber lembretes</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.habits}
                    onCheckedChange={(v) => updateNotificationPreference('habits', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Alertas Financeiros</p>
                      <p className="text-xs text-muted-foreground">Gastos e metas</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.finances}
                    onCheckedChange={(v) => updateNotificationPreference('finances', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Conquistas</p>
                      <p className="text-xs text-muted-foreground">Novas conquistas</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.achievements}
                    onCheckedChange={(v) => updateNotificationPreference('achievements', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Flame className="w-4 h-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Streaks em Risco</p>
                      <p className="text-xs text-muted-foreground">Aviso de streak</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notifications.streaks}
                    onCheckedChange={(v) => updateNotificationPreference('streaks', v)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Comunidade</p>
                      <p className="text-xs text-muted-foreground">Grupos e desafios</p>
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
