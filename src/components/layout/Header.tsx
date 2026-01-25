import { Sparkles, Search, Bell, User } from "lucide-react";

const Header = () => {
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
        <button className="md:hidden p-2 rounded-lg hover:bg-glass-hover transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-glass-hover transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
        </button>
        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center hover:scale-105 transition-transform">
          <User className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;
