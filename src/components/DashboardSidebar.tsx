import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plus, BarChart3, Settings, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 border-r border-border bg-card p-6">
      <nav className="space-y-2">
        <Button
          variant={isActive('/dashboard') ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={isActive('/dashboard') ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard')}
        >
          <List className="mr-2 h-4 w-4" />
          My Listings
        </Button>
        <Button
          variant={isActive('/dashboard/listings/new') ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/listings/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Listing
        </Button>
        <Button
          variant={isActive('/dashboard/analytics') ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/analytics')}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        <Button
          variant={isActive('/dashboard/settings') ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => navigate('/dashboard/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
