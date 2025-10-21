import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardStats from '@/components/DashboardStats';
import ListingManager from '@/components/ListingManager';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your business listings
            </p>
          </div>

          <DashboardStats />
          <ListingManager />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
