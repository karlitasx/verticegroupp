import { cn } from "@/lib/utils";
import { getMobileNavItems } from "@/lib/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

const navItems = getMobileNavItems();

interface BottomNavProps {
  activeItem?: string;
}

const BottomNav = ({ activeItem = "/" }: BottomNavProps) => {
  const { t } = usePreferences();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <ul className="flex items-center justify-around py-1 px-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isActive && "bg-primary/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
