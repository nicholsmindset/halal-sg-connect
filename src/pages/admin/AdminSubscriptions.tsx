import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';

const AdminSubscriptions = () => {
  return (
    <AdminLayout title="Subscription Management" description="Monitor and manage user subscriptions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div className="text-2xl font-bold">234</div>
              </div>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">$12,450</div>
              </div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <div className="text-2xl font-bold">15.5%</div>
              </div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-500" />
                <div className="text-2xl font-bold">$187</div>
              </div>
              <p className="text-sm text-muted-foreground">Avg. Revenue per User</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Subscription management features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;