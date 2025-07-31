import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Search, Filter, Download, Crown, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'consumer' | 'vendor' | 'admin';
  subscriptionTier: 'free' | 'premium' | 'premium_plus' | 'enterprise';
  joinDate: string;
  lastActive: string;
  status: 'active' | 'suspended' | 'pending';
  businessCount: number;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'Ahmad Rahman',
      email: 'ahmad@example.com',
      role: 'vendor',
      subscriptionTier: 'premium_plus',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      status: 'active',
      businessCount: 2
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      role: 'consumer',
      subscriptionTier: 'free',
      joinDate: '2024-01-18',
      lastActive: '2024-01-20',
      status: 'active',
      businessCount: 0
    },
    {
      id: '3',
      name: 'Mohamed Ali',
      email: 'mohamed@restaurant.com',
      role: 'vendor',
      subscriptionTier: 'enterprise',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      status: 'active',
      businessCount: 5
    },
    {
      id: '4',
      name: 'Fatimah Zahra',
      email: 'fatimah@example.com',
      role: 'consumer',
      subscriptionTier: 'premium',
      joinDate: '2024-01-12',
      lastActive: '2024-01-20',
      status: 'pending',
      businessCount: 0
    }
  ];

  const getSubscriptionBadge = (tier: string) => {
    const variants = {
      free: 'secondary',
      premium: 'default',
      premium_plus: 'destructive',
      enterprise: 'outline'
    } as const;
    
    return <Badge variant={variants[tier as keyof typeof variants]}>{tier.replace('_', ' ')}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      pending: 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const icon = role === 'vendor' ? <Crown className="h-3 w-3 mr-1" /> : null;
    return (
      <Badge variant="outline" className="flex items-center">
        {icon}
        {role}
      </Badge>
    );
  };

  return (
    <AdminLayout title="User Management" description="Manage users, vendors, and subscriptions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">89</div>
              <p className="text-sm text-muted-foreground">Active Vendors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Premium Subscribers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div className="text-2xl font-bold">5</div>
              </div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  <TabsTrigger value="consumers">Consumers</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Business Count</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getSubscriptionBadge(user.subscriptionTier)}</TableCell>
                          <TableCell>{user.businessCount}</TableCell>
                          <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;