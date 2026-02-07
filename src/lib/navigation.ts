import { Home, Target, DollarSign, User, Trophy, Heart, Award, CalendarDays, LucideIcon } from "lucide-react";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

// Navigation items shared across Sidebar and BottomNav
export const navigationItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Target, label: "Hábitos", href: "/habits" },
  { icon: CalendarDays, label: "Agenda", href: "/agenda" },
  { icon: DollarSign, label: "Finanças", href: "/finances" },
  { icon: Heart, label: "Autocuidado", href: "/selfcare" },
  { icon: Award, label: "Conquistas", href: "/achievements" },
  { icon: Trophy, label: "Comunidade", href: "/community", desktopOnly: true },
  { icon: User, label: "Perfil", href: "/profile", desktopOnly: true },
];

// Get items for mobile bottom nav (limited space)
export const getMobileNavItems = () =>
  navigationItems.filter((item) => !item.desktopOnly).slice(0, 5);

// Get items for desktop sidebar
export const getDesktopNavItems = () =>
  navigationItems.filter((item) => !item.mobileOnly);
