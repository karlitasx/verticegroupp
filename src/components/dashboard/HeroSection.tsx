import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

const motivationalQuotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Sua única limitação é aquela que você impõe à sua própria mente.",
  "Cada dia é uma nova oportunidade para mudar sua vida.",
  "A disciplina é a ponte entre metas e realizações.",
  "Foco no progresso, não na perfeição.",
  "Você é mais forte do que imagina.",
  "Grandes conquistas começam com pequenos passos.",
  "Acredite em você e tudo será possível.",
  "O melhor momento para começar é agora.",
  "Transforme seus sonhos em metas e suas metas em realidade.",
  "A persistência realiza o impossível.",
  "Sua atitude determina sua altitude.",
  "Não espere por oportunidades, crie-as.",
  "O sucesso não é final, o fracasso não é fatal.",
  "Faça hoje o que outros não farão, tenha amanhã o que outros não terão.",
  "A jornada de mil milhas começa com um único passo.",
  "Seja a mudança que você quer ver no mundo.",
  "Desafios são oportunidades disfarçadas.",
  "Quem tem um porquê enfrenta qualquer como.",
  "A excelência não é um ato, mas um hábito.",
  "Sonhe grande, comece pequeno, aja agora.",
  "Você não precisa ser perfeito para começar.",
  "O único limite é a sua imaginação.",
  "Cada pequena vitória conta.",
  "Você está mais perto do que pensa.",
  "A consistência supera o talento.",
  "Sua história de sucesso começa hoje.",
  "Seja paciente, as grandes coisas levam tempo.",
  "O impossível é apenas uma opinião.",
  "Você nasceu para brilhar.",
  "Acredite no processo.",
  "A melhor versão de você está sendo construída.",
  "Seja imparável.",
  "Cada esforço importa.",
  "O futuro pertence aos que acreditam.",
  "Você é capaz de mais do que imagina.",
  "A mudança começa dentro de você.",
  "Não desista, o melhor está por vir.",
  "Sua dedicação é sua força.",
  "Transforme obstáculos em trampolins.",
  "O sucesso é uma escolha diária.",
  "Você é o autor da sua história.",
  "A disciplina é liberdade.",
  "Seja grato e determinado.",
  "O esforço de hoje é o resultado de amanhã.",
  "Você merece o sucesso que busca.",
  "A vitória ama a preparação.",
  "Nunca subestime seu potencial.",
  "O caminho é feito ao caminhar.",
  "Você está no controle da sua vida.",
];

const HeroSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  let greeting = "Boa noite";
  let emoji = "🌙";
  if (hour < 12) {
    greeting = "Bom dia";
    emoji = "☀️";
  } else if (hour < 18) {
    greeting = "Boa tarde";
    emoji = "🌤️";
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const userName = "Maria";

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-8 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-white/10">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/20 relative cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage src="/placeholder.svg" alt={userName} />
            <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary to-accent text-white">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
            <span className="text-xs">✨</span>
          </div>
        </div>

        {/* Greeting and Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {greeting}, <span className="text-gradient">{userName}</span>! {emoji}
          </h1>
          
          {/* Date and Time */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm capitalize">{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatTime(currentTime)}</span>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="glass-card p-4 rounded-xl max-w-2xl">
            <p className="text-sm md:text-base italic text-foreground/80">
              ✨ "{quote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
