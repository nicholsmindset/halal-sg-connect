import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Users, Star, Utensils } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const Districts = () => {
  // SEO configuration
  useSEO({
    title: 'Singapore Districts - Complete Halal Business Directory by Area',
    description: 'Explore halal restaurants and businesses in all Singapore districts. From Central to Northeast regions, find authenticated halal dining in every neighborhood.',
    keywords: 'Singapore districts, halal restaurants by area, neighborhood dining, planning areas, regional halal food',
    canonical: '/districts'
  });

  // District data organized by regions
  const districtsByRegion = {
    'Central Region': [
      { name: 'Orchard', slug: 'orchard', count: 45, popular: true, type: 'Tourist & Shopping' },
      { name: 'Marina Bay', slug: 'marina-south', count: 32, popular: true, type: 'Business & Tourist' },
      { name: 'Raffles Place', slug: 'downtown-core', count: 28, popular: true, type: 'Financial District' },
      { name: 'Bugis / Arab Street', slug: 'rochor', count: 52, popular: true, type: 'Cultural Heritage' },
      { name: 'Little India', slug: 'serangoon', count: 38, popular: true, type: 'Cultural Heritage' },
      { name: 'Chinatown', slug: 'outram', count: 24, popular: true, type: 'Heritage & Business' },
      { name: 'Clarke Quay', slug: 'singapore-river', count: 18, type: 'Entertainment' },
      { name: 'Newton', slug: 'newton', count: 22, type: 'Hawker & Medical' },
      { name: 'Novena', slug: 'novena', count: 19, type: 'Medical Hub' },
      { name: 'Bukit Timah', slug: 'bukit-timah', count: 15, type: 'Upscale Residential' }
    ],
    'East Region': [
      { name: 'Tampines', slug: 'tampines', count: 67, popular: true, type: 'Regional Hub' },
      { name: 'Bedok', slug: 'bedok', count: 43, popular: true, type: 'Family Residential' },
      { name: 'Pasir Ris', slug: 'pasir-ris', count: 29, popular: true, type: 'Beach & Family' },
      { name: 'Changi Airport', slug: 'changi', count: 31, popular: true, type: 'International Hub' },
      { name: 'Paya Lebar', slug: 'paya-lebar', count: 21, type: 'Commercial' },
      { name: 'Marine Parade', slug: 'marine-parade', count: 18, type: 'Beachfront' }
    ],
    'West Region': [
      { name: 'Jurong East', slug: 'jurong-east', count: 58, popular: true, type: 'Regional Hub' },
      { name: 'Jurong West', slug: 'jurong-west', count: 41, popular: true, type: 'Family Residential' },
      { name: 'Clementi', slug: 'clementi', count: 33, popular: true, type: 'University Town' },
      { name: 'Boon Lay', slug: 'boon-lay', count: 25, type: 'Mixed Development' },
      { name: 'Bukit Batok', slug: 'bukit-batok', count: 19, type: 'Residential' },
      { name: 'Choa Chu Kang', slug: 'choa-chu-kang', count: 22, type: 'Family Area' }
    ],
    'North Region': [
      { name: 'Woodlands', slug: 'woodlands', count: 47, popular: true, type: 'Border Town' },
      { name: 'Yishun', slug: 'yishun', count: 35, popular: true, type: 'Family Community' },
      { name: 'Sembawang', slug: 'sembawang', count: 18, type: 'Quiet Residential' },
      { name: 'Mandai', slug: 'mandai', count: 8, type: 'Nature & Zoo' },
      { name: 'Seletar', slug: 'seletar', count: 6, type: 'Aerospace Hub' }
    ],
    'Northeast Region': [
      { name: 'Hougang', slug: 'hougang', count: 39, popular: true, type: 'Traditional Town' },
      { name: 'Punggol', slug: 'punggol', count: 34, popular: true, type: 'Waterfront New Town' },
      { name: 'Sengkang', slug: 'sengkang', count: 31, popular: true, type: 'Modern New Town' },
      { name: 'Ang Mo Kio', slug: 'ang-mo-kio', count: 26, popular: true, type: 'Family Community' },
      { name: 'Bishan', slug: 'bishan', count: 28, popular: true, type: 'Park Connector Hub' }
    ]
  };

  const totalDistricts = Object.values(districtsByRegion).flat().length;
  const totalBusinesses = Object.values(districtsByRegion).flat().reduce((sum, district) => sum + district.count, 0);
  const popularDistricts = Object.values(districtsByRegion).flat().filter(d => d.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Singapore Districts Halal Directory
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover authentic halal businesses in every Singapore planning area. From bustling business districts 
              to quiet residential neighborhoods, find verified halal dining and services near you.
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalDistricts}</div>
                <div className="text-sm text-muted-foreground">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalBusinesses}+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Regions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Districts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Most Popular Districts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDistricts.slice(0, 6).map((district) => (
              <Card key={district.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {district.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{district.type}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      {district.count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      Popular Choice
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/district/${district.slug}`}>
                        Explore
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Districts by Region */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Browse by Region</h2>
          
          {Object.entries(districtsByRegion).map(([region, districts]) => (
            <div key={region} className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">{region}</h3>
                <Badge variant="outline">{districts.length} districts</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {districts.map((district) => (
                  <Card key={district.slug} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{district.name}</h4>
                        {district.popular && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{district.type}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {district.count} businesses
                        </span>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/district/${district.slug}`}>
                            View →
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-muted/30 rounded-lg mt-12">
          <h3 className="text-xl font-bold mb-4">Don't See Your Area?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're constantly expanding our coverage. Add your favorite halal business to help others discover great food in your neighborhood.
          </p>
          <Button asChild>
            <Link to="/add-business">
              Add Your Business
            </Link>
          </Button>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Districts;