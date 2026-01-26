import { Sparkles, Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Até logo! 👋",
      description: "Você saiu da sua conta",
    });
    navigate("/auth", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-glass-border flex items-center px-4 md:px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full logo-gradient flex items-center justify-center shadow-lg shadow-primary/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold hidden sm:block">
          <span className="text-foreground">Vida</span>
          <span className="text-gradient">Flow</span>
        </h1>
      </div>

      {/* Search - Center */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 glass-input text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="md:hidden p-2 rounded-lg hover:bg-glass-hover transition-all duration-300 hover:scale-105">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* Notification Dropdown */}
        <NotificationDropdown />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover:scale-105 transition-all duration-300">
              <User className="w-4 h-4 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card border-glass-border">
            {user && (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Conta VidaFlow</p>
                </div>
                <DropdownMenuSeparator className="bg-glass-border" />
              </>
            )}
            <DropdownMenuItem 
              onClick={() => navigate("/profile")}
              className="cursor-pointer hover:bg-glass-hover transition-all duration-300"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-glass-border" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
