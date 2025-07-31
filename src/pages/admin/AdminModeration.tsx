import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminModeration = () => {
  return (
    <AdminLayout title="Content Moderation" description="Review and moderate user-generated content">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Content moderation features coming soon...</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminModeration;