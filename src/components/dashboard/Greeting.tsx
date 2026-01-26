import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const quotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Sua única limitação é aquela que você impõe à sua própria mente.",
  "Cada dia é uma nova oportunidade para mudar sua vida.",
  "A disciplina é a ponte entre metas e realizações.",
  "Foco no progresso, não na perfeição.",
];

const Greeting = () => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  let greeting = "Boa noite";
  if (hour < 12) greeting = "Bom dia";
  else if (hour < 18) greeting = "Boa tarde";

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Get user's name from metadata (set during signup) or extract from email
  const userName = user?.user_metadata?.full_name 
    || user?.email?.split('@')[0] 
    || "Usuário";

  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {greeting},{" "}
        <span className="text-gradient">{userName}</span>! 👋
      </h1>
      <div className="flex items-start gap-2 text-muted-foreground">
        <Sparkles className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
        <p className="text-sm md:text-base italic">"{randomQuote}"</p>
      </div>
    </div>
  );
};

export default Greeting;
