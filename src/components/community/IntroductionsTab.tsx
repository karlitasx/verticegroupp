import { useState } from "react";
import { Plus, Edit2, Clock, TrendingUp, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useIntroductions, type Introduction } from "@/hooks/useIntroductions";
import { useAuth } from "@/hooks/useAuth";
import { FollowButton } from "@/components/social/FollowButton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type SortMode = "recent" | "popular";

const IntroductionsTab = () => {
  const { introductions, myIntroduction, loading, createOrUpdateIntroduction, refetch } = useIntroductions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  const handleOpenModal = () => {
    setContent(myIntroduction?.content || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await createOrUpdateIntroduction(content.trim());
    setIsModalOpen(false);
  };

  if (loading) {
    return <ContentSkeleton type="card" count={4} />;
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 via-primary/60 to-accent/50 p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.3),transparent_70%)]" />
        <div className="relative z-10 space-y-4">
          <div className="text-5xl mb-2">😊</div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Apresentações da comunidade
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto text-sm md:text-base">
            Conheça outros membros, compartilhe seus objetivos e mostre pra comunidade que você chegou pra ficar!
          </p>
          <Button
            onClick={handleOpenModal}
            variant="secondary"
            className="gap-2 bg-background/90 hover:bg-background text-foreground"
          >
            {myIntroduction ? (
              <>
                <Edit2 className="w-4 h-4" />
                Editar apresentação
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Faça sua apresentação
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Apresentações recentes</h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setSortMode("recent")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                sortMode === "recent"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              Recentes
            </button>
            <button
              onClick={() => setSortMode("popular")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                sortMode === "popular"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Populares
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Introductions Grid */}
      {introductions.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Nenhuma apresentação ainda"
          description="Seja o primeiro a se apresentar para a comunidade!"
          action={{
            label: "Fazer apresentação",
            onClick: handleOpenModal,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {introductions.map((intro) => (
            <IntroductionCard
              key={intro.id}
              introduction={intro}
              isOwn={intro.user_id === user?.id}
              onNavigate={(userId) => navigate(`/user/${userId}`)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {myIntroduction ? "Editar sua apresentação" : "Faça sua apresentação"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Conte um pouco sobre você, seus objetivos e o que te trouxe até aqui!
            </p>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Olá, meu nome é... Tenho X anos e meus objetivos são..."
              className="min-h-[150px] bg-input border-border resize-none"
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {content.length}/1000 caracteres
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="btn-gradient"
                >
                  {myIntroduction ? "Salvar" : "Publicar"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Card component
interface IntroductionCardProps {
  introduction: Introduction;
  isOwn: boolean;
  onNavigate: (userId: string) => void;
}

const IntroductionCard = ({ introduction, isOwn, onNavigate }: IntroductionCardProps) => {
  const displayName = introduction.profile?.display_name || "Usuário";
  const avatarUrl = introduction.profile?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => onNavigate(introduction.user_id)}
        >
          <Avatar className="h-11 w-11 border-2 border-primary/20 shrink-0">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(introduction.created_at), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        {!isOwn && (
          <FollowButton targetUserId={introduction.user_id} size="sm" />
        )}
      </div>

      {/* Content */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Sobre mim:
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line line-clamp-5">
          {introduction.content}
        </p>
      </div>
    </div>
  );
};

export default IntroductionsTab;
