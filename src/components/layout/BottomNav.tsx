import { cn } from "@/lib/utils";
import { getMobileNavItems } from "@/lib/navigation";

const navItems = getMobileNavItems();

interface BottomNavProps {
  activeItem?: string;
}

const BottomNav = ({ activeItem = "/" }: BottomNavProps) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-glass-border">
      <ul className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isActive && "btn-gradient shadow-lg"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
