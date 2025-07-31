import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, BarChart3, Settings, List } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border p-6">
      <nav className="space-y-2">
        <Button 
          variant={isActive("/dashboard") ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button 
          variant={isActive("/dashboard") ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/dashboard")}
        >
          <List className="w-4 h-4 mr-2" />
          My Listings
        </Button>
        <Button 
          variant={isActive("/dashboard/listings/new") ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/listings/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
        <Button 
          variant={isActive("/dashboard/analytics") ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/analytics")}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button 
          variant={isActive("/dashboard/settings") ? "default" : "ghost"} 
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;