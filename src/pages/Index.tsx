import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Crown } from "lucide-react";
import { mockCategories, mockListings } from "@/lib/mockData";
import { useSEO, SEOConfigs } from "@/hooks/useSEO";

const Index = () => {
  // Apply SEO metadata for homepage
  useSEO(SEOConfigs.home);
  
  const premiumListings = mockListings.filter(listing => listing.isPremium);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-soft to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover Singapore's
            <span className="bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent block">
              Halal Businesses
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted directory for authentic halal dining, shopping, and services across Singapore
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for halal restaurants, cafes, services..."
                className="pl-12 pr-4 py-6 text-lg shadow-lg"
              />
              <Button size="lg" className="absolute right-2 top-2">
                Search
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/listings">Browse Directory</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">List Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                to={`/listings?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold group-hover:text-primary">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} businesses</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Listings */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Businesses</h2>
              <p className="text-muted-foreground">Premium listings from trusted halal businesses</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/listings?premium=true">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumListings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={listing.images[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Crown className="w-5 h-5 text-warning" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 fill-warning text-warning mr-1" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({listing.reviewCount})</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {listing.district}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
