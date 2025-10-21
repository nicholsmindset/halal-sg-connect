import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <AdminLayout
      title="System Settings"
      description="Configure platform settings and preferences"
    >
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            System settings coming soon...
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;
