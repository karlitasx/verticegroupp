import { useState, useEffect } from "react";
import { Heart, Sparkles, Brain, Palette, Activity, CheckCircle, TrendingUp, Smile, Meh, Frown, Laugh, Angry } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Self-care tips array (20+ tips)
const selfCareTips = [
  "Faça uma pausa de 5 minutos para respirar profundamente",
  "Beba um copo de água agora mesmo",
  "Estique seu corpo por 2 minutos",
  "Escreva 3 coisas pelas quais você é grato(a)",
  "Ouça sua música favorita",
  "Faça uma caminhada de 10 minutos",
  "Desconecte-se das redes sociais por 1 hora",
  "Prepare um lanche saudável",
  "Ligue para alguém que você ama",
  "Organize um espaço pequeno do seu ambiente",
  "Pratique 5 minutos de meditação",
  "Tome um banho relaxante",
  "Leia algumas páginas de um livro",
  "Faça algo criativo: desenhe, pinte ou escreva",
  "Agradeça a si mesmo(a) por algo que fez hoje",
  "Durma 30 minutos mais cedo hoje",
  "Coma uma fruta ou vegetal",
  "Assista a um vídeo engraçado",
  "Faça uma lista de suas conquistas recentes",
  "Pratique o perdão - deixe ir algo que te incomoda",
  "Dance por 5 minutos",
  "Tome um chá ou café em paz",
  "Escreva uma carta para você do futuro",
  "Faça algo gentil por alguém",
];

// Mood options
const moods = [
  { id: "great", emoji: <Laugh className="w-8 h-8" />, label: "Ótimo", color: "text-green-400" },
  { id: "good", emoji: <Smile className="w-8 h-8" />, label: "Bem", color: "text-lime-400" },
  { id: "neutral", emoji: <Meh className="w-8 h-8" />, label: "Normal", color: "text-yellow-400" },
  { id: "bad", emoji: <Frown className="w-8 h-8" />, label: "Mal", color: "text-orange-400" },
  { id: "terrible", emoji: <Angry className="w-8 h-8" />, label: "Péssimo", color: "text-red-400" },
];

// Categories
const categories = [
  { id: "body", name: "Corpo", icon: Activity, color: "from-green-400 to-emerald-500", activities: ["Exercício", "Alongamento", "Caminhada", "Yoga"] },
  { id: "mind", name: "Mente", icon: Brain, color: "from-blue-400 to-indigo-500", activities: ["Meditação", "Leitura", "Aprendizado", "Jogos mentais"] },
  { id: "emotional", name: "Emocional", icon: Heart, color: "from-pink-400 to-rose-500", activities: ["Conversar", "Diário", "Terapia", "Música"] },
  { id: "creative", name: "Criativo", icon: Palette, color: "from-purple-400 to-violet-500", activities: ["Desenhar", "Escrever", "Cozinhar", "Artesanato"] },
];

// Community challenges
const challenges = [
  { id: "1", name: "7 Dias de Meditação", participants: 234, days: 7, category: "mind" },
  { id: "2", name: "30 Dias de Gratidão", participants: 512, days: 30, category: "emotional" },
  { id: "3", name: "Desafio Fitness 21 Dias", participants: 189, days: 21, category: "body" },
  { id: "4", name: "Criar Todo Dia", participants: 87, days: 14, category: "creative" },
];

const SelfCare = () => {
  const [currentTip, setCurrentTip] = useState("");
  const [tipCompleted, setTipCompleted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [weeklyData, setWeeklyData] = useState([
    { day: "Seg", mood: 4, energy: 7 },
    { day: "Ter", mood: 3, energy: 5 },
    { day: "Qua", mood: 4, energy: 6 },
    { day: "Qui", mood: 5, energy: 8 },
    { day: "Sex", mood: 4, energy: 7 },
    { day: "Sáb", mood: 5, energy: 9 },
    { day: "Dom", mood: 0, energy: 0 },
  ]);

  // Get random tip on mount
  useEffect(() => {
    const randomTip = selfCareTips[Math.floor(Math.random() * selfCareTips.length)];
    setCurrentTip(randomTip);

    // Load data from localStorage
    const savedChallenges = localStorage.getItem("vidaflow_challenges");
    if (savedChallenges) {
      setJoinedChallenges(JSON.parse(savedChallenges));
    }
  }, []);

  const handleCompleteTip = () => {
    setTipCompleted(true);
    
    // Add points
    const currentPoints = parseInt(localStorage.getItem("vidaflow_points") || "0");
    localStorage.setItem("vidaflow_points", (currentPoints + 10).toString());

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#a855f7", "#ec4899", "#3b82f6"],
    });

    toast({
      title: "Parabéns! 🎉",
      description: "+10 pontos por cuidar de você!",
    });
  };

  const handleNewTip = () => {
    const randomTip = selfCareTips[Math.floor(Math.random() * selfCareTips.length)];
    setCurrentTip(randomTip);
    setTipCompleted(false);
  };

  const handleJoinChallenge = (challengeId: string) => {
    const updated = [...joinedChallenges, challengeId];
    setJoinedChallenges(updated);
    localStorage.setItem("vidaflow_challenges", JSON.stringify(updated));

    toast({
      title: "Você entrou no desafio! 💪",
      description: "Boa sorte na sua jornada!",
    });
  };

  const handleSaveCheckIn = () => {
    if (!selectedMood) {
      toast({
        title: "Selecione seu humor",
        description: "Como você está se sentindo hoje?",
        variant: "destructive",
      });
      return;
    }

    const moodValue = moods.findIndex(m => m.id === selectedMood) + 1;
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;

    const updatedData = [...weeklyData];
    updatedData[dayIndex] = {
      ...updatedData[dayIndex],
      mood: 6 - moodValue,
      energy: energyLevel,
    };
    setWeeklyData(updatedData);

    // Calculate self-care score and save
    const selfCareScore = Math.round(((6 - moodValue) / 5 * 50) + (energyLevel / 10 * 50));
    localStorage.setItem("vidaflow_selfcare_score", selfCareScore.toString());

    toast({
      title: "Check-in salvo! ✨",
      description: "Continue acompanhando sua evolução!",
    });
  };

  return (
    <DashboardLayout activeNav="/selfcare">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="p-3 rounded-xl logo-gradient">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Autocuidado</h1>
            <p className="text-sm text-muted-foreground">Cuide de você todos os dias</p>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Dica do Dia</h3>
          </div>
          
          <p className="text-lg mb-4">{currentTip}</p>
          
          <div className="flex gap-3">
            {!tipCompleted ? (
              <button
                onClick={handleCompleteTip}
                className="btn-gradient px-5 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar como feito (+10 pts)
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Concluído!</span>
              </div>
            )}
            <button
              onClick={handleNewTip}
              className="px-5 py-2 rounded-xl bg-glass hover:bg-glass-hover transition-all hover:scale-105"
            >
              Nova dica
            </button>
          </div>
        </div>

        {/* Daily Check-in */}
        <div className="glass-card p-6 mb-6 animate-slide-up animation-delay-100">
          <h3 className="font-semibold mb-4">Check-in Diário</h3>
          
          {/* Mood Selection */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Como você está se sentindo?</p>
            <div className="flex justify-center gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={cn(
                    "p-3 rounded-xl transition-all hover:scale-110",
                    selectedMood === mood.id
                      ? `bg-glass border-2 border-primary ${mood.color}`
                      : "bg-glass/50 text-muted-foreground hover:bg-glass"
                  )}
                >
                  <div className={cn("transition-colors", selectedMood === mood.id && mood.color)}>
                    {mood.emoji}
                  </div>
                  <p className="text-xs mt-1">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Nível de energia</p>
              <span className="font-bold text-lg">{energyLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-glass rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Baixa</span>
              <span>Alta</span>
            </div>
          </div>

          {/* Gratitudes */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">3 coisas pelas quais sou grato(a):</p>
            <div className="space-y-2">
              {gratitudes.map((g, i) => (
                <input
                  key={i}
                  type="text"
                  value={g}
                  onChange={(e) => {
                    const updated = [...gratitudes];
                    updated[i] = e.target.value;
                    setGratitudes(updated);
                  }}
                  placeholder={`Gratidão ${i + 1}...`}
                  className="w-full glass-input px-4 py-2 rounded-xl"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveCheckIn}
            className="w-full btn-gradient py-3 rounded-xl font-medium hover:scale-[1.02] transition-transform"
          >
            Salvar Check-in
          </button>
        </div>

        {/* Weekly Chart */}
        <div className="glass-card p-6 mb-6 animate-slide-up animation-delay-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Evolução Semanal</h3>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))' }}
                  name="Humor"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))' }}
                  name="Energia"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Humor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Energia</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="glass-card p-4 animate-slide-up hover:scale-105 transition-transform cursor-pointer"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{cat.name}</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {cat.activities.map(a => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Community Challenges */}
        <div className="glass-card p-6 animate-slide-up animation-delay-300">
          <h3 className="font-semibold mb-4">Desafios da Comunidade</h3>
          <div className="space-y-3">
            {challenges.map((challenge) => {
              const isJoined = joinedChallenges.includes(challenge.id);
              const category = categories.find(c => c.id === challenge.category);
              
              return (
                <div
                  key={challenge.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl transition-all",
                    isJoined ? "bg-primary/20 border border-primary/30" : "bg-glass hover:bg-glass-hover"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category?.color} flex items-center justify-center`}>
                      {category && <category.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium">{challenge.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {challenge.participants} participantes • {challenge.days} dias
                      </p>
                    </div>
                  </div>
                  
                  {isJoined ? (
                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Participando
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="px-4 py-2 rounded-lg bg-glass hover:bg-glass-hover text-sm font-medium transition-all hover:scale-105"
                    >
                      Participar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SelfCare;
