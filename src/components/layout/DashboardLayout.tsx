import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeNav?: string;
}

const DashboardLayout = ({ children, activeNav = "/" }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blur-circle w-96 h-96 bg-primary -top-48 -left-48" />
        <div className="blur-circle w-80 h-80 bg-blue-500 top-1/3 -right-40 animation-delay-200" />
        <div className="blur-circle w-72 h-72 bg-accent bottom-20 left-1/4 animation-delay-300" />
      </div>

      <Header />
      <Sidebar activeItem={activeNav} />

      {/* Main Content */}
      <main className="pt-16 pb-24 md:pb-8 md:pl-20 lg:pl-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

      <BottomNav activeItem={activeNav} />
    </div>
  );
};

export default DashboardLayout;
