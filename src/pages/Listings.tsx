import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters from '@/components/SearchFilters';
import ListingCard from '@/components/ListingCard';
import { mockListings } from '@/lib/mockData';

const Listings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Halal Businesses Directory
          </h1>
          <p className="text-muted-foreground">
            Discover authentic halal businesses across Singapore
          </p>
        </div>

        <SearchFilters />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
