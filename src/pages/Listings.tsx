import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { mockListings } from "@/lib/mockData";

const Listings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Halal Businesses Directory</h1>
          <p className="text-muted-foreground">Discover authentic halal businesses across Singapore</p>
        </div>
        
        <SearchFilters />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Listings;