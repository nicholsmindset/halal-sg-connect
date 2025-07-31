import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">456</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Premium Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,345</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;