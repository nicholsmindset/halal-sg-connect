import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Eye, Edit, Trash2, Copy, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockListings } from '@/lib/mockData';
import { type Business } from '@/types/business';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ListingManager = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Business[]>(mockListings);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  const activeListings = listings.filter(
    listing => listing.subscriptionTier !== 'free' || listing.isPremium
  );
  const draftListings = listings.filter(
    listing => listing.subscriptionTier === 'free' && !listing.isPremium
  );

  const handleEditListing = (id: string) => {
    navigate(`/dashboard/listings/edit/${id}`);
  };

  const handleDuplicateListing = async (id: string) => {
    try {
      // Find the listing to duplicate
      const listing = listings.find(l => l.id === id);
      if (!listing) {
        toast.error('Listing not found');
        return;
      }

      // Fetch from Supabase if using real data
      const { data: originalListing, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        // If not in database, duplicate the mock data
        const duplicatedListing = {
          ...listing,
          id: `${listing.id}-copy`,
          name: `${listing.name} (Copy)`,
          slug: `${listing.slug}-copy`,
        };
        setListings(prev => [...prev, duplicatedListing]);
        toast.success('Listing duplicated successfully!');
        return;
      }

      // Duplicate in Supabase
      const { error: insertError } = await supabase.from('businesses').insert([
        {
          ...originalListing,
          id: undefined, // Let database generate new ID
          name: `${originalListing.name} (Copy)`,
          slug: `${originalListing.slug}-copy-${Date.now()}`,
          created_at: undefined,
          updated_at: undefined,
        },
      ]);

      if (insertError) throw insertError;

      toast.success('Listing duplicated successfully!');
      // Refresh listings here if using real data
    } catch (error) {
      console.error('Error duplicating listing:', error);
      toast.error('Failed to duplicate listing. Please try again.');
    }
  };

  const handleDeleteListing = (id: string) => {
    setListingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      // Try to delete from Supabase
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', listingToDelete);

      if (error) {
        // If not in database, remove from local state
        setListings(prev => prev.filter(l => l.id !== listingToDelete));
      } else {
        // Refresh listings if using real data
        setListings(prev => prev.filter(l => l.id !== listingToDelete));
      }

      toast.success('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const renderListingTable = (listings: Business[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map(listing => (
          <TableRow key={listing.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold">{listing.name}</div>
                <div className="text-sm text-muted-foreground">
                  {listing.district}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{listing.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={listing.isPremium ? 'default' : 'outline'}>
                {listing.isPremium ? 'Premium' : 'Free'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                {listing.views}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                ⭐ {listing.rating} ({listing.reviewCount})
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(listing.lastUpdated).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEditListing(listing.id)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDuplicateListing(listing.id)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteListing(listing.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Listings</CardTitle>
        <Button onClick={() => navigate('/dashboard/listings/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts ({draftListings.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              renderListingTable(activeListings)
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No active listings yet.</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate('/dashboard/listings/new')}
                >
                  Create Your First Listing
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftListings.length > 0 ? (
              renderListingTable(draftListings)
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No draft listings.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {listings.reduce((sum, listing) => sum + listing.views, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {listings.reduce((sum, listing) => sum + listing.clicks, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(
                      listings.reduce(
                        (sum, listing) => sum + listing.rating,
                        0
                      ) / listings.length
                    ).toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              listing from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ListingManager;
