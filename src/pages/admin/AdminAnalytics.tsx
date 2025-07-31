import AdminLayout from '@/components/AdminLayout';
import AnalyticsDashboard from '@/components/premium/AnalyticsDashboard';

const AdminAnalytics = () => {
  return (
    <AdminLayout title="Platform Analytics" description="Comprehensive analytics across the entire platform">
      <AnalyticsDashboard businessId="platform-wide" subscriptionTier="enterprise" />
    </AdminLayout>
  );
};

export default AdminAnalytics;