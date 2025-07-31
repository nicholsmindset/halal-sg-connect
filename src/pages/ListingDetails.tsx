import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingGallery from "@/components/ListingGallery";
import ListingInfo from "@/components/ListingInfo";
import { mockListings } from "@/lib/mockData";

const ListingDetails = () => {
  const { slug } = useParams();
  
  // In real app, this would fetch from Supabase
  const listing = mockListings.find(l => l.slug === slug) || mockListings[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ListingGallery images={listing.images} />
        <ListingInfo listing={listing} />
      </div>
      
      <Footer />
    </div>
  );
};

export default ListingDetails;