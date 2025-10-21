import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  Briefcase,
  Home,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

const PropertyZones = () => {
  // SEO configuration
  useSEO({
    title: 'Singapore Property Districts D01-D28 - Halal Business Directory',
    description:
      'Explore halal restaurants by Singapore property districts (D01-D28). Find business-focused halal dining from CBD to residential areas across all postal zones.',
    keywords:
      'Singapore property districts, D01-D28 halal restaurants, postal district dining, business halal food, residential area restaurants',
    canonical: '/property-zones',
  });

  // Property districts organized by type and business focus
  const propertyDistricts = [
    // Premium Business Districts
    {
      code: 'D01',
      name: 'Marina Bay / Raffles Place',
      areas: ['Downtown Core', 'Marina Bay', 'Raffles Place'],
      type: 'Premium Business',
      icon: Briefcase,
      businesses: 45,
      characteristics: [
        'Financial Hub',
        'Tourist Attractions',
        'Premium Dining',
        'International Hotels',
      ],
      popular: true,
    },
    {
      code: 'D02',
      name: 'Chinatown / Tanjong Pagar',
      areas: ['Chinatown', 'Tanjong Pagar', 'Outram'],
      type: 'Heritage Business',
      icon: Building2,
      businesses: 38,
      characteristics: [
        'Cultural Heritage',
        'Modern Offices',
        'Historic Dining',
        'Mixed Development',
      ],
      popular: true,
    },
    {
      code: 'D06',
      name: 'City Hall / Clarke Quay',
      areas: ['City Hall', 'Clarke Quay', 'Singapore River'],
      type: 'Government Business',
      icon: Briefcase,
      businesses: 29,
      characteristics: [
        'Government Quarter',
        'Entertainment District',
        'River Dining',
        'Tourist Hub',
      ],
    },
    {
      code: 'D07',
      name: 'Bugis / Arab Street',
      areas: ['Bugis', 'Arab Street', 'Rochor'],
      type: 'Cultural Heritage',
      icon: MapPin,
      businesses: 52,
      characteristics: [
        'Islamic Heritage',
        'Traditional Crafts',
        'Authentic Cuisine',
        'Cultural Tourism',
      ],
      popular: true,
    },
    {
      code: 'D08',
      name: 'Little India / Serangoon',
      areas: ['Little India', 'Serangoon Road', 'Farrer Park'],
      type: 'Cultural District',
      icon: MapPin,
      businesses: 47,
      characteristics: [
        'Indian Muslim Cuisine',
        'Traditional Markets',
        'Cultural Festivals',
        'Spice Trading',
      ],
      popular: true,
    },
    {
      code: 'D09',
      name: 'Orchard / River Valley',
      areas: ['Orchard Road', 'River Valley', 'Somerset'],
      type: 'Premier Shopping',
      icon: TrendingUp,
      businesses: 41,
      characteristics: [
        'Luxury Shopping',
        'International Dining',
        'Premium Hotels',
        'Tourist Central',
      ],
      popular: true,
    },

    // Mature Residential Areas
    {
      code: 'D16',
      name: 'Bedok / Upper East Coast',
      areas: ['Bedok', 'Upper East Coast'],
      type: 'Family Residential',
      icon: Home,
      businesses: 43,
      characteristics: [
        'Family Communities',
        'Affordable Dining',
        'Beach Access',
        'Local Markets',
      ],
    },
    {
      code: 'D18',
      name: 'Tampines / Pasir Ris',
      areas: ['Tampines', 'Pasir Ris'],
      type: 'Regional Hub',
      icon: Users,
      businesses: 67,
      characteristics: [
        'Shopping Centers',
        'Family Entertainment',
        'Beach Recreation',
        'Comprehensive Amenities',
      ],
      popular: true,
    },
    {
      code: 'D19',
      name: 'Hougang / Punggol / Sengkang',
      areas: ['Hougang', 'Punggol', 'Sengkang'],
      type: 'Modern Residential',
      icon: Home,
      businesses: 51,
      characteristics: [
        'New Towns',
        'Waterfront Living',
        'Modern Facilities',
        'Young Families',
      ],
      popular: true,
    },
    {
      code: 'D20',
      name: 'Ang Mo Kio / Bishan',
      areas: ['Ang Mo Kio', 'Bishan', 'Thomson'],
      type: 'Family Community',
      icon: Users,
      businesses: 38,
      characteristics: [
        'Family-Friendly',
        'Park Connectors',
        'Community Centers',
        'Good Connectivity',
      ],
      popular: true,
    },

    // Western Districts
    {
      code: 'D22',
      name: 'Jurong East / West / Boon Lay',
      areas: ['Jurong East', 'Jurong West', 'Boon Lay'],
      type: 'Regional Hub',
      icon: Building2,
      businesses: 58,
      characteristics: [
        'Industrial Hub',
        'Family Towns',
        'Shopping Centers',
        'Entertainment',
      ],
      popular: true,
    },
    {
      code: 'D23',
      name: 'Bukit Panjang / Choa Chu Kang',
      areas: ['Bukit Panjang', 'Choa Chu Kang', 'Dairy Farm'],
      type: 'Family Residential',
      icon: Home,
      businesses: 31,
      characteristics: [
        'Nature Access',
        'Family Parks',
        'Community Living',
        'Quiet Neighborhoods',
      ],
    },

    // Northern Districts
    {
      code: 'D25',
      name: 'Woodlands / Admiralty',
      areas: ['Woodlands', 'Admiralty'],
      type: 'Border Town',
      icon: MapPin,
      businesses: 47,
      characteristics: [
        'Cross-Border Hub',
        'International Community',
        'Malaysian Influence',
        'Regional Center',
      ],
      popular: true,
    },
    {
      code: 'D27',
      name: 'Sembawang / Yishun',
      areas: ['Sembawang', 'Yishun'],
      type: 'Quiet Residential',
      icon: Home,
      businesses: 29,
      characteristics: [
        'Peaceful Living',
        'Nature Parks',
        'Beach Access',
        'Community Spirit',
      ],
    },
  ];

  const businessDistricts = propertyDistricts.filter(
    d => d.type.includes('Business') || d.type === 'Premier Shopping'
  );
  const residentialDistricts = propertyDistricts.filter(
    d =>
      d.type.includes('Residential') ||
      d.type.includes('Hub') ||
      d.type.includes('Community')
  );
  const culturalDistricts = propertyDistricts.filter(
    d => d.type.includes('Cultural') || d.type.includes('Heritage')
  );

  const totalBusinesses = propertyDistricts.reduce(
    (sum, district) => sum + district.businesses,
    0
  );
  const popularDistricts = propertyDistricts.filter(d => d.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground">
              Singapore Property Districts (D01-D28)
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Discover halal businesses organized by Singapore's official
              property districts. From premium business zones to family
              residential areas, find the perfect halal dining experience that
              matches your location and lifestyle.
            </p>

            {/* Statistics */}
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">28</div>
                <div className="text-sm text-muted-foreground">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {totalBusinesses}+
                </div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {businessDistricts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Business Zones
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {residentialDistricts.length}
                </div>
                <div className="text-sm text-muted-foreground">Residential</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Districts */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            Most Popular Property Districts
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularDistricts.slice(0, 6).map(district => {
              const IconComponent = district.icon;
              return (
                <Card
                  key={district.code}
                  className="transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          {district.code}
                        </CardTitle>
                        <p className="mt-1 font-medium text-foreground">
                          {district.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {district.type}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Building2 className="h-3 w-3" />
                        {district.businesses}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {district.characteristics
                          .slice(0, 2)
                          .map((char, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {char}
                            </Badge>
                          ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {district.areas.length} areas
                        </span>
                        <Button asChild size="sm">
                          <Link
                            to={`/property-zone/${district.code.toLowerCase()}`}
                          >
                            Explore
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Districts by Category */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold">Browse by District Type</h2>

          {/* Business Districts */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">
                Business & Commercial Districts
              </h3>
              <Badge variant="outline">
                {businessDistricts.length} districts
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {businessDistricts.map(district => (
                <Card
                  key={district.code}
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-primary">
                          {district.code}
                        </h4>
                        <p className="text-sm font-medium">{district.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {district.type}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {district.businesses}
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {district.characteristics
                        .slice(0, 3)
                        .map((char, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {char}
                          </Badge>
                        ))}
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      <Link
                        to={`/property-zone/${district.code.toLowerCase()}`}
                      >
                        View Businesses →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cultural Districts */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">
                Cultural & Heritage Districts
              </h3>
              <Badge variant="outline">
                {culturalDistricts.length} districts
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {culturalDistricts.map(district => (
                <Card
                  key={district.code}
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-primary">
                          {district.code}
                        </h4>
                        <p className="text-sm font-medium">{district.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {district.type}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        {district.businesses}
                      </span>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {district.characteristics.map((char, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {char}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      <Link
                        to={`/property-zone/${district.code.toLowerCase()}`}
                      >
                        Explore Heritage Dining →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Residential Districts */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Home className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">
                Residential & Community Districts
              </h3>
              <Badge variant="outline">
                {residentialDistricts.length} districts
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {residentialDistricts.map(district => (
                <Card
                  key={district.code}
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 text-center">
                      <h4 className="text-lg font-bold text-primary">
                        {district.code}
                      </h4>
                      <p className="text-xs font-medium">{district.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {district.type}
                      </p>
                    </div>
                    <div className="mb-3 text-center">
                      <span className="text-lg font-bold">
                        {district.businesses}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        businesses
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Link
                        to={`/property-zone/${district.code.toLowerCase()}`}
                      >
                        View →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Understanding Property Districts */}
        <section className="mt-12 rounded-lg bg-muted/30 p-8">
          <h3 className="mb-4 text-xl font-bold">
            Understanding Singapore Property Districts
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold">
                What are Property Districts?
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Singapore is divided into 28 property districts (D01-D28) for
                postal and administrative purposes. Each district has unique
                characteristics that influence the types of businesses and
                dining options available.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Why Browse by District?</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Different districts cater to different lifestyles - from
                business lunch spots in D01 to family dining in D18. Find halal
                restaurants that match your location and needs.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyZones;
