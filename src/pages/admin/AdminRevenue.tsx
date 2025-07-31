import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminRevenue = () => {
  return (
    <AdminLayout title="Revenue Reports" description="Track revenue, payments, and financial analytics">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Revenue reporting features coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminRevenue;