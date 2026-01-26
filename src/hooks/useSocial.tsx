import { useState, useEffect, useCallback } from "react";
import { Group, GroupMember, GroupActivity, GroupChallenge, RankingUser } from "@/types/social";
import { LEVEL_THRESHOLDS, LEVEL_EMOJIS, UserLevel } from "@/types/achievements";

const GROUPS_KEY = "vidaflow_groups";
const RANKING_KEY = "vidaflow_ranking";

// Mock ranking data
const mockRanking: RankingUser[] = [
  { id: "1", name: "Ana Silva", avatar: "👩", points: 5450, level: "Expert", badges: ["consistent", "financial", "plant"] },
  { id: "2", name: "Carlos Lima", avatar: "👨", points: 4100, level: "Avançada", badges: ["consistent", "social"] },
  { id: "3", name: "Maria Santos", avatar: "👧", points: 3850, level: "Avançada", badges: ["financial", "plant"] },
  { id: "4", name: "João Pedro", avatar: "🧑", points: 2620, level: "Intermediária", badges: ["consistent"] },
  { id: "5", name: "Lucia Ferreira", avatar: "👩‍🦰", points: 2450, level: "Intermediária", badges: ["social", "plant"] },
  { id: "6", name: "Pedro Costa", avatar: "👴", points: 1800, level: "Intermediária", badges: ["financial"] },
  { id: "7", name: "Fernanda Luz", avatar: "👩‍🦱", points: 1250, level: "Intermediária", badges: [] },
  { id: "8", name: "Roberto Dias", avatar: "🧔", points: 920, level: "Iniciante", badges: ["social"] },
  { id: "9", name: "Julia Mendes", avatar: "👱‍♀️", points: 650, level: "Iniciante", badges: ["plant"] },
  { id: "10", name: "Marcos Oliveira", avatar: "👦", points: 420, level: "Iniciante", badges: [] },
];

// Mock groups
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Economizando Juntas",
    description: "Grupo para economizar para viagem de fim de ano",
    emoji: "✈️",
    financialGoal: 10000,
    financialCurrent: 4500,
    inviteCode: "ECO123",
    createdAt: new Date(2024, 10, 1),
    members: [
      { id: "current", name: "Você", avatar: "😊", points: 980, contribution: 1500, isAdmin: true, isCurrentUser: true },
      { id: "2", name: "Ana Silva", avatar: "👩", points: 2450, contribution: 2000 },
      { id: "3", name: "Maria Santos", avatar: "👧", points: 1850, contribution: 1000 },
    ],
    challenges: [
      {
        id: "c1",
        name: "Guardar R$500 em 7 dias",
        description: "Cada membro deve economizar R$500 essa semana",
        type: "financial",
        targetValue: 500,
        currentValue: 350,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        participants: ["current", "2", "3"],
        completed: false,
      },
    ],
    activities: [
      { id: "a1", memberId: "2", memberName: "Ana Silva", memberAvatar: "👩", type: "savings", description: "economizou R$200", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), value: 200 },
      { id: "a2", memberId: "3", memberName: "Maria Santos", memberAvatar: "👧", type: "habit_completed", description: "completou um hábito", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      { id: "a3", memberId: "current", memberName: "Você", memberAvatar: "😊", type: "challenge_joined", description: "entrou no desafio semanal", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ],
  },
];

const getUserLevel = (points: number): UserLevel => {
  const levels = Object.entries(LEVEL_THRESHOLDS) as [UserLevel, number][];
  const sortedLevels = [...levels].sort((a, b) => b[1] - a[1]);
  
  for (const [level, threshold] of sortedLevels) {
    if (points >= threshold) {
      return level;
    }
  }
  return 'Novata';
};

export const useSocial = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedGroups = localStorage.getItem(GROUPS_KEY);
      const savedRanking = localStorage.getItem(RANKING_KEY);
      const savedAchievements = localStorage.getItem("vidaflow_achievements");
      
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        // Convert dates
        const withDates = parsed.map((g: Group) => ({
          ...g,
          createdAt: new Date(g.createdAt),
          challenges: g.challenges.map((c: GroupChallenge) => ({
            ...c,
            deadline: new Date(c.deadline),
          })),
          activities: g.activities.map((a: GroupActivity) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        }));
        setGroups(withDates);
      } else {
        setGroups(mockGroups);
      }
      
      // Get user points from achievements
      let points = 0;
      if (savedAchievements) {
        const achievements = JSON.parse(savedAchievements);
        points = achievements.totalPoints || 0;
      }
      setUserPoints(points);
      
      // Update ranking with user points
      const baseRanking = savedRanking ? JSON.parse(savedRanking) : mockRanking;
      const userLevel = getUserLevel(points);
      const userEntry: RankingUser = {
        id: "current",
        name: "Você",
        avatar: "😊",
        points,
        level: userLevel,
        badges: ["consistent", "plant"],
        isCurrentUser: true,
      };
      
      // Add or update user in ranking
      const otherUsers = baseRanking.filter((u: RankingUser) => !u.isCurrentUser);
      const fullRanking = [...otherUsers, userEntry].sort((a, b) => b.points - a.points);
      setRanking(fullRanking);
      
    } catch (error) {
      console.error("Error loading social data:", error);
      setGroups(mockGroups);
      setRanking(mockRanking);
    }
    setIsLoaded(true);
  }, []);

  // Save groups to localStorage
  useEffect(() => {
    if (isLoaded && groups.length > 0) {
      localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    }
  }, [groups, isLoaded]);

  // Create a new group
  const createGroup = useCallback((data: { name: string; description: string; emoji: string; financialGoal?: number }) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      ...data,
      financialCurrent: 0,
      members: [
        { id: "current", name: "Você", avatar: "😊", points: userPoints, contribution: 0, isAdmin: true, isCurrentUser: true },
      ],
      challenges: [],
      activities: [],
      createdAt: new Date(),
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    
    setGroups(prev => [newGroup, ...prev]);
    return newGroup;
  }, [userPoints]);

  // Add member to group (simulated)
  const addMember = useCallback((groupId: string, member: Omit<GroupMember, "id">) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      const newMember: GroupMember = {
        ...member,
        id: Date.now().toString(),
      };
      
      return {
        ...g,
        members: [...g.members, newMember],
        activities: [
          {
            id: Date.now().toString(),
            memberId: newMember.id,
            memberName: newMember.name,
            memberAvatar: newMember.avatar,
            type: 'challenge_joined' as const,
            description: 'entrou no grupo',
            timestamp: new Date(),
          },
          ...g.activities,
        ],
      };
    }));
  }, []);

  // Add activity to group
  const addActivity = useCallback((groupId: string, activity: Omit<GroupActivity, "id" | "timestamp">) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      return {
        ...g,
        activities: [
          {
            ...activity,
            id: Date.now().toString(),
            timestamp: new Date(),
          },
          ...g.activities,
        ].slice(0, 50), // Keep last 50 activities
      };
    }));
  }, []);

  // Create challenge in group
  const createChallenge = useCallback((groupId: string, challenge: Omit<GroupChallenge, "id" | "currentValue" | "completed" | "participants">) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      const newChallenge: GroupChallenge = {
        ...challenge,
        id: Date.now().toString(),
        currentValue: 0,
        completed: false,
        participants: g.members.map(m => m.id),
      };
      
      return {
        ...g,
        challenges: [newChallenge, ...g.challenges],
      };
    }));
  }, []);

  // Update challenge progress
  const updateChallengeProgress = useCallback((groupId: string, challengeId: string, value: number) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      return {
        ...g,
        challenges: g.challenges.map(c => {
          if (c.id !== challengeId) return c;
          const newValue = c.currentValue + value;
          return {
            ...c,
            currentValue: newValue,
            completed: newValue >= c.targetValue,
          };
        }),
      };
    }));
  }, []);

  // Get user position in ranking
  const getUserPosition = useCallback(() => {
    const index = ranking.findIndex(u => u.isCurrentUser);
    return index >= 0 ? index + 1 : ranking.length + 1;
  }, [ranking]);

  // Filter ranking by period (simulated - just varies the points slightly)
  const getFilteredRanking = useCallback((period: 'weekly' | 'monthly' | 'yearly') => {
    const multiplier = period === 'weekly' ? 0.2 : period === 'monthly' ? 0.5 : 1;
    return ranking.map(user => ({
      ...user,
      points: Math.round(user.points * multiplier),
    })).sort((a, b) => b.points - a.points);
  }, [ranking]);

  return {
    groups,
    ranking,
    userPoints,
    isLoaded,
    createGroup,
    addMember,
    addActivity,
    createChallenge,
    updateChallengeProgress,
    getUserPosition,
    getFilteredRanking,
  };
};
