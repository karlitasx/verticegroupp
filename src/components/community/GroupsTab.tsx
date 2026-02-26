import { useState } from "react";
import { Users, ArrowRight, Clock, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  gradient: string;
  emoji: string;
  isJoined: boolean;
  comingSoon?: boolean;
}

const mockGroups: Group[] = [
  {
    id: "1",
    name: "Educação Financeira",
    description: "Aprenda a organizar suas finanças, investir com segurança e construir uma vida financeira equilibrada.",
    category: "Finanças",
    members: 697,
    gradient: "from-pink-500 to-purple-600",
    emoji: "💰",
    isJoined: true,
  },
  {
    id: "2",
    name: "Clube do Livro",
    description: "Compartilhe suas leituras favoritas, discuta livros sobre finanças, desenvolvimento pessoal e histórias inspiradoras.",
    category: "Cultura",
    members: 260,
    gradient: "from-violet-500 to-indigo-600",
    emoji: "📚",
    isJoined: true,
  },
  {
    id: "3",
    name: "Divulgue Seu Trabalho",
    description: "Seu espaço para brilhar! Compartilhe seus projetos, serviços e empreendimentos. Faça networking e conecte-se.",
    category: "Networking",
    members: 0,
    gradient: "from-rose-400 to-pink-600",
    emoji: "💼",
    isJoined: false,
    comingSoon: true,
  },
  {
    id: "4",
    name: "Grupo das Empreendedoras",
    description: "Não precisa mais se sentir sozinha nessa jornada! Aprenda estratégias para alavancar seu negócio e faça conexões.",
    category: "Empreendedorismo",
    members: 0,
    gradient: "from-amber-400 to-orange-500",
    emoji: "🚀",
    isJoined: false,
    comingSoon: true,
  },
  {
    id: "5",
    name: "Autocuidado & Bem-estar",
    description: "Troque experiências sobre saúde mental, rotinas de autocuidado e hábitos saudáveis com outras mulheres.",
    category: "Saúde",
    members: 183,
    gradient: "from-emerald-400 to-teal-600",
    emoji: "🧘‍♀️",
    isJoined: false,
  },
  {
    id: "6",
    name: "Metas & Produtividade",
    description: "Defina metas, compartilhe conquistas e mantenha-se motivada com apoio da comunidade.",
    category: "Produtividade",
    members: 312,
    gradient: "from-blue-400 to-cyan-600",
    emoji: "🎯",
    isJoined: false,
  },
];

const GroupCard = ({ group }: { group: Group }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
      {/* Gradient Header */}
      <div className={`relative h-28 bg-gradient-to-br ${group.gradient} p-4 flex flex-col justify-between`}>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
            {group.category}
          </Badge>
          {group.comingSoon && (
            <Badge className="bg-accent text-accent-foreground border-0 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Em Breve
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-bold text-white drop-shadow-sm leading-tight">
          {group.emoji} {group.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {group.description}
        </p>

        {!group.comingSoon && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>{group.members} membros</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          {group.comingSoon ? (
            <p className="text-sm text-muted-foreground italic">
              Este grupo estará disponível em breve! 🎉
            </p>
          ) : group.isJoined ? (
            <>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Participando
              </Button>
              <Button size="sm" className="flex-1 text-xs gap-1">
                Ver Grupo <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" className="w-full text-xs gap-1">
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
    <div className="space-y-4">
      {/* Sub-tabs */}
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="bg-muted/50 w-full sm:w-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Star className="w-3.5 h-3.5 sm:mr-1" />
            <span>Todos</span>
          </TabsTrigger>
          <TabsTrigger value="joined" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-3.5 h-3.5 sm:mr-1" />
            <span>Meus Grupos</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Sparkles className="w-3.5 h-3.5 sm:mr-1" />
            <span>Descobrir</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-foreground mb-1">Nenhum grupo encontrado</h3>
          <p className="text-sm text-muted-foreground">Explore outros grupos disponíveis!</p>
        </div>
      )}
    </div>
  );
};

export default GroupsTab;
