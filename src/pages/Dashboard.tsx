import DashboardLayout from "@/components/layout/DashboardLayout";
import Greeting from "@/components/dashboard/Greeting";
import HabitsCard from "@/components/dashboard/HabitsCard";
import FinanceCard from "@/components/dashboard/FinanceCard";
import WishlistCard from "@/components/dashboard/WishlistCard";
import StreakCard from "@/components/dashboard/StreakCard";

const Dashboard = () => {
  return (
    <DashboardLayout activeNav="/">
      <Greeting />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <HabitsCard />
        <FinanceCard />
        <WishlistCard />
        <StreakCard />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
