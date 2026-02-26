import { useState } from "react";
import { Users, ArrowRight, Clock, Star, Sparkles, Crown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  emoji: string;
  isJoined: boolean;
  comingSoon?: boolean;
  accent: string;
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Educação Financeira",
    description: "Aprenda a organizar suas finanças, investir com segurança e construir uma vida financeira equilibrada.",
    category: "Finanças",
    members: 697,
    emoji: "💰",
    isJoined: true,
    accent: "hsl(var(--primary))",
  },
  {
    id: "2",
    name: "Clube do Livro",
    description: "Compartilhe suas leituras favoritas, discuta livros sobre finanças, desenvolvimento pessoal e histórias inspiradoras.",
    category: "Cultura",
    members: 260,
    emoji: "📚",
    isJoined: true,
    accent: "hsl(var(--secondary))",
  },
  {
    id: "3",
    name: "Divulgue Seu Trabalho",
    description: "Seu espaço para brilhar! Compartilhe seus projetos, serviços e empreendimentos. Faça networking e conecte-se.",
    category: "Networking",
    members: 0,
    emoji: "💼",
    isJoined: false,
    comingSoon: true,
    accent: "hsl(var(--accent))",
  },
  {
    id: "4",
    name: "Grupo das Empreendedoras",
    description: "Não precisa mais se sentir sozinha nessa jornada! Aprenda estratégias para alavancar seu negócio e faça conexões.",
    category: "Empreendedorismo",
    members: 0,
    emoji: "🚀",
    isJoined: false,
    comingSoon: true,
    accent: "hsl(var(--warning))",
  },
  {
    id: "5",
    name: "Autocuidado & Bem-estar",
    description: "Troque experiências sobre saúde mental, rotinas de autocuidado e hábitos saudáveis com outras mulheres.",
    category: "Saúde",
    members: 183,
    emoji: "🧘‍♀️",
    isJoined: false,
    accent: "hsl(var(--success))",
  },
  {
    id: "6",
    name: "Metas & Produtividade",
    description: "Defina metas, compartilhe conquistas e mantenha-se motivada com apoio da comunidade.",
    category: "Produtividade",
    members: 312,
    emoji: "🎯",
    isJoined: false,
    accent: "hsl(var(--ring))",
  },
];

const GroupCard = ({ group, index }: { group: Group; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent bar */}
      <div
        className="h-1.5 w-full transition-all duration-500"
        style={{
          background: group.accent,
          opacity: hovered ? 1 : 0.6,
        }}
      />

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl transition-transform duration-500 inline-block"
              style={{ transform: hovered ? "scale(1.15) rotate(-5deg)" : "scale(1) rotate(0deg)" }}
            >
              {group.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-base leading-tight truncate">
                {group.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] px-2 py-0 font-medium">
                  {group.category}
                </Badge>
                {group.comingSoon && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0 font-medium gap-1 text-muted-foreground">
                    <Clock className="w-2.5 h-2.5" />
                    Em Breve
                  </Badge>
                )}
                {group.isJoined && (
                  <Crown className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {group.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          {!group.comingSoon && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span className="font-medium">{group.members}</span>
              <span>membros</span>
              {group.members > 500 && (
                <TrendingUp className="w-3 h-3 text-success ml-1" />
              )}
            </div>
          )}

          {group.comingSoon ? (
            <span className="text-xs text-muted-foreground italic ml-auto">Disponível em breve 🎉</span>
          ) : group.isJoined ? (
            <Button size="sm" variant="outline" className="ml-auto text-xs gap-1.5 rounded-full px-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-300">
              Ver Grupo <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          ) : (
            <Button size="sm" className="ml-auto text-xs gap-1.5 rounded-full px-4 transition-all duration-300">
              <Sparkles className="w-3.5 h-3.5" />
              Participar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const GroupsTab = () => {
  const [subTab, setSubTab] = useState("all");

  const joinedGroups = mockGroups.filter((g) => g.isJoined);
  const availableGroups = mockGroups.filter((g) => !g.isJoined && !g.comingSoon);
  const comingSoonGroups = mockGroups.filter((g) => g.comingSoon);

  const getFilteredGroups = () => {
    switch (subTab) {
      case "joined":
        return joinedGroups;
      case "discover":
        return [...availableGroups, ...comingSoonGroups];
      default:
        return mockGroups;
    }
  };

  const filteredGroups = getFilteredGroups();

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="bg-muted/50 w-full sm:w-auto rounded-full p-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <Star className="w-3.5 h-3.5 sm:mr-1.5" />
            <span>Todos</span>
            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0 hidden sm:inline-flex">
              {mockGroups.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="joined" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <Crown className="w-3.5 h-3.5 sm:mr-1.5" />
            <span>Meus Grupos</span>
            {joinedGroups.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0 hidden sm:inline-flex">
                {joinedGroups.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="discover" className="text-xs sm:text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 sm:mr-1.5" />
            <span>Descobrir</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredGroups.map((group, i) => (
          <GroupCard key={group.id} group={group} index={i} />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-16 bg-card rounded-2xl border border-border animate-fade-in">
          <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="font-semibold text-foreground mb-1">Nenhum grupo encontrado</h3>
          <p className="text-sm text-muted-foreground">Explore outros grupos disponíveis!</p>
        </div>
      )}
    </div>
  );
};

export default GroupsTab;
