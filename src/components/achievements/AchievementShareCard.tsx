import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AchievementShare } from "@/types/achievement-sharing";
import { Achievement, RARITY_COLORS, RARITY_LABELS } from "@/types/achievements";
import { cn } from "@/lib/utils";

interface AchievementShareCardProps {
  share: AchievementShare;
  achievement?: Achievement;
}

export const AchievementShareCard = ({
  share,
  achievement,
}: AchievementShareCardProps) => {
  if (!achievement) return null;

  const timeAgo = formatDistanceToNow(new Date(share.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="border-border/50 hover:border-border transition-colors overflow-hidden">
      {/* Gradient header based on rarity */}
      <div
        className={cn(
          "h-1 bg-gradient-to-r",
          RARITY_COLORS[achievement.rarity]
        )}
      />
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={share.author_avatar || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {share.author_name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">
                {share.author_name}
              </span>
              <span className="text-muted-foreground text-sm">
                desbloqueou uma conquista
              </span>
              <span className="text-xs text-muted-foreground">
                • {timeAgo}
              </span>
            </div>

            {/* Achievement Card */}
            <div className="mt-3 p-3 rounded-xl bg-muted/50 flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br shrink-0",
                  RARITY_COLORS[achievement.rarity]
                )}
              >
                {achievement.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {achievement.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full bg-gradient-to-r text-white",
                      RARITY_COLORS[achievement.rarity]
                    )}
                  >
                    {RARITY_LABELS[achievement.rarity]}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    +{achievement.points} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Optional message */}
            {share.message && (
              <p className="mt-3 text-foreground">{share.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
