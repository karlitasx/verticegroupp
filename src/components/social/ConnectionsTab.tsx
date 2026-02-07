import { useState } from "react";
import { Users, Briefcase, Sparkles, X, Check, Loader2 } from "lucide-react";
import { useConnections, UserProfile } from "@/hooks/useConnections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CONNECTION_TYPES = [
  { value: "friendship", label: "Amizade", icon: Users, color: "text-pink-500" },
  { value: "work", label: "Trabalho", icon: Briefcase, color: "text-blue-500" },
  { value: "networking", label: "Networking", icon: Sparkles, color: "text-purple-500" },
] as const;

export const ConnectionsTab = () => {
  const {
    discoverProfiles,
    matches,
    loading,
    currentFilter,
    setCurrentFilter,
    connect,
    skip,
  } = useConnections();

  const [activeTab, setActiveTab] = useState<"discover" | "matches">("discover");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConnect = async (userId: string) => {
    setProcessingId(userId);
    await connect(userId, currentFilter);
    setProcessingId(null);
  };

  const handleSkip = async (userId: string) => {
    setProcessingId(userId);
    await skip(userId);
    setProcessingId(null);
  };

  const ProfileCard = ({ profile }: { profile: UserProfile }) => (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary text-2xl">
            {getInitials(profile.display_name || "U")}
          </AvatarFallback>
        </Avatar>

        <h3 className="text-lg font-semibold text-foreground mb-1">
          {profile.display_name || "Usuário"}
        </h3>

        {profile.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {profile.bio}
          </p>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSkip(profile.user_id)}
            disabled={processingId === profile.user_id}
            className="w-14 h-14 rounded-full p-0 border-2 hover:border-destructive hover:bg-destructive/10"
          >
            {processingId === profile.user_id ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <X className="w-6 h-6 text-muted-foreground" />
            )}
          </Button>
          <Button
            size="lg"
            onClick={() => handleConnect(profile.user_id)}
            disabled={processingId === profile.user_id}
            className="w-14 h-14 rounded-full p-0 bg-primary hover:bg-primary/90"
          >
            {processingId === profile.user_id ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Check className="w-6 h-6" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Connection Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CONNECTION_TYPES.map(({ value, label, icon: Icon, color }) => (
          <Button
            key={value}
            variant={currentFilter === value ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentFilter(value)}
            className={cn(
              "gap-2 whitespace-nowrap",
              currentFilter === value && "bg-primary"
            )}
          >
            <Icon className={cn("w-4 h-4", currentFilter !== value && color)} />
            {label}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "discover" | "matches")}>
        <TabsList className="w-full bg-card border border-border">
          <TabsTrigger value="discover" className="flex-1">
            Descobrir
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex-1">
            Conexões ({matches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : discoverProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum perfil disponível no momento.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Volte mais tarde para descobrir novas conexões!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discoverProfiles.map((profile) => (
                <ProfileCard key={profile.user_id} profile={profile} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Você ainda não tem conexões.
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Conecte-se com pessoas para criar matches!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <Card key={match.user.user_id} className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/30">
                      <AvatarImage src={match.user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(match.user.display_name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {match.user.display_name || "Usuário"}
                      </h4>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {CONNECTION_TYPES.find(t => t.value === match.connectionType)?.label || "Conexão"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
