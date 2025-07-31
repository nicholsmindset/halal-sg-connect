import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2, Copy, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockListings } from "@/lib/mockData";
import { type Business } from "@/types/business";
import { useNavigate } from "react-router-dom";

const ListingManager = () => {
  const navigate = useNavigate();
  const [listings] = useState<Business[]>(mockListings);

  const activeListings = listings.filter(listing => listing.subscriptionTier !== 'free' || listing.isPremium);
  const draftListings = listings.filter(listing => listing.subscriptionTier === 'free' && !listing.isPremium);

  const handleEditListing = (id: string) => {
    navigate(`/dashboard/listings/edit/${id}`);
  };

  const handleDuplicateListing = (id: string) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate listing:', id);
  };

  const handleDeleteListing = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete listing:', id);
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
        {listings.map((listing) => (
          <TableRow key={listing.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-semibold">{listing.name}</div>
                <div className="text-sm text-muted-foreground">{listing.district}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{listing.category}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={listing.isPremium ? "default" : "outline"}>
                {listing.isPremium ? "Premium" : "Free"}
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
                  <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicateListing(listing.id)}>
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
          <Plus className="w-4 h-4 mr-2" />
          Add New Listing
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftListings.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeListings.length > 0 ? (
              renderListingTable(activeListings)
            ) : (
              <div className="text-center py-8">
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">No draft listings.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {(listings.reduce((sum, listing) => sum + listing.rating, 0) / listings.length).toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ListingManager;