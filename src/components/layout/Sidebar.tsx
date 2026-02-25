import { cn } from "@/lib/utils";
import { getDesktopNavItems } from "@/lib/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

const navItems = getDesktopNavItems();

interface SidebarProps {
  activeItem?: string;
}

const Sidebar = ({ activeItem = "/" }: SidebarProps) => {
  const { t } = usePreferences();
  
  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 lg:w-56 bg-sidebar border-r border-sidebar-border flex-col py-4 z-40">
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium hidden lg:block">
                    {t(item.labelKey)}
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
