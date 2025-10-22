import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Business } from '@/types/business';

const AdminBusinesses = () => {
  const [pendingBusinesses] = useState<Business[]>([
    {
      id: 'pending-1',
      name: 'New Halal Bistro',
      slug: 'new-halal-bistro',
      description: 'Modern halal dining experience',
      category: 'Restaurants',
      district: 'Orchard',
      address: '123 Orchard Road',
      phone: '+65 1234 5678',
      email: 'info@newhalalbistro.com',
      images: ['/placeholder.svg'],
      rating: 0,
      reviewCount: 0,
      priceRange: '$$',
      isHalalCertified: true,
      isPremium: false,
      subscriptionTier: 'premium',
      features: ['dine-in', 'takeaway'],
      tags: ['halal', 'modern', 'bistro'],
      views: 0,
      clicks: 0,
      lastUpdated: '2024-01-20T10:00:00Z',
      openingHours: {
        monday: { open: '10:00', close: '22:00' },
        tuesday: { open: '10:00', close: '22:00' },
        wednesday: { open: '10:00', close: '22:00' },
        thursday: { open: '10:00', close: '22:00' },
        friday: { open: '10:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
    },
  ]);

  const handleApprove = (businessId: string) => {
    console.log('Approving business:', businessId);
  };

  const handleReject = (businessId: string) => {
    console.log('Rejecting business:', businessId);
  };

  return (
    <AdminLayout
      title="Business Management"
      description="Manage and moderate business listings"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <div className="text-2xl font-bold">1,456</div>
              </div>
              <p className="text-sm text-muted-foreground">Total Businesses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div className="text-2xl font-bold">12</div>
              </div>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">89</div>
              <p className="text-sm text-muted-foreground">Premium Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-sm text-muted-foreground">Halal Certified</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Approval
              <Badge variant="destructive" className="ml-2">
                12
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active">Active Listings</TabsTrigger>
            <TabsTrigger value="premium">Premium Listings</TabsTrigger>
            <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Businesses Awaiting Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingBusinesses.map(business => (
                      <TableRow key={business.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={business.images[0]}
                              alt={business.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium">{business.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {business.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{business.category}</Badge>
                        </TableCell>
                        <TableCell>{business.district}</TableCell>
                        <TableCell>
                          <Badge>{business.subscriptionTier}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(business.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(business.id)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(business.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(business.id)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Business Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All approved and active business listings will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="premium">
            <Card>
              <CardHeader>
                <CardTitle>Premium Business Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Premium subscription businesses with enhanced features.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flagged">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Content that has been reported or flagged for review.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminBusinesses;
