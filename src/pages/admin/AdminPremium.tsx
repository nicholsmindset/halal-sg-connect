import AdminLayout from '@/components/AdminLayout';
import SubscriptionManager from '@/components/premium/SubscriptionManager';

const AdminPremium = () => {
  return (
    <AdminLayout
      title="Premium Features"
      description="Manage premium features and subscription tiers"
    >
      <SubscriptionManager currentTier="enterprise" />
    </AdminLayout>
  );
};

export default AdminPremium;
