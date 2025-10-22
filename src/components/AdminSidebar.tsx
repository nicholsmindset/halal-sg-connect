import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  FileText,
  Crown,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const adminMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: Home,
    badge: null,
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
    badge: '342',
  },
  {
    title: 'Business Listings',
    url: '/admin/businesses',
    icon: Building2,
    badge: '12',
  },
  {
    title: 'Subscriptions',
    url: '/admin/subscriptions',
    icon: CreditCard,
    badge: null,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Content Moderation',
    url: '/admin/moderation',
    icon: MessageSquare,
    badge: '8',
  },
  {
    title: 'Revenue Reports',
    url: '/admin/revenue',
    icon: TrendingUp,
    badge: null,
  },
  {
    title: 'Premium Features',
    url: '/admin/premium',
    icon: Crown,
    badge: null,
  },
  {
    title: 'System Health',
    url: '/admin/system',
    icon: Shield,
    badge: '3',
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
    badge: null,
  },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';
  };

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-64'}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== 'collapsed' && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant={
                                item.badge === '12' ||
                                item.badge === '8' ||
                                item.badge === '3'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {state !== 'collapsed' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/businesses"
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Pending Approvals</span>
                      <Badge variant="destructive" className="text-xs">
                        12
                      </Badge>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/revenue"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Generate Report</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
