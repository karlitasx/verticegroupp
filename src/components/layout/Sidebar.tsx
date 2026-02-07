import { cn } from "@/lib/utils";
import { getDesktopNavItems } from "@/lib/navigation";

const navItems = getDesktopNavItems();

interface SidebarProps {
  activeItem?: string;
}

const Sidebar = ({ activeItem = "/" }: SidebarProps) => {
  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 lg:w-64 glass-card border-r border-glass-border flex-col py-6 z-40">
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive
                      ? "btn-gradient shadow-lg"
                      : "hover:bg-glass-hover text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-white" : "group-hover:scale-110 transition-transform"
                    )}
                  />
                  <span className={cn(
                    "font-medium hidden lg:block",
                    isActive && "text-white"
                  )}>
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
