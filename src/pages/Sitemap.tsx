import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Building2,
  MapPin,
  Utensils,
  Star,
  Settings,
  Shield,
  FileText,
  Phone,
  DollarSign,
  Users,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

export default function Sitemap() {
  useSEO({
    title: 'Sitemap - Halal SG Connect | All Pages',
    description:
      'Browse the complete sitemap of Halal SG Connect. Find all pages, categories, districts, and features on our halal business directory.',
    keywords: 'sitemap, site navigation, all pages, directory structure',
    canonical: '/sitemap',
  });

  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { label: 'Home', path: '/' },
        { label: 'Browse All Listings', path: '/listings' },
        { label: 'All Categories', path: '/categories' },
        { label: 'Districts', path: '/districts' },
        { label: 'Property Zones', path: '/property-zones' },
        { label: 'Best Of Lists', path: '/best' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'About Us', path: '/about' },
      ],
    },
    {
      title: 'User Account',
      icon: Users,
      links: [
        { label: 'Login / Sign Up', path: '/auth' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'My Listings', path: '/dashboard' },
        { label: 'Create Listing', path: '/dashboard/listings/new' },
        { label: 'Analytics', path: '/dashboard/analytics' },
        { label: 'Account Settings', path: '/dashboard/settings' },
      ],
    },
    {
      title: 'Popular Categories',
      icon: Utensils,
      links: [
        { label: 'Halal Restaurants', path: '/category/restaurants' },
        { label: 'Halal Cafes', path: '/category/cafes' },
        { label: 'Fast Food', path: '/category/fast-food' },
        { label: 'Bakeries', path: '/category/bakery' },
        { label: 'Desserts', path: '/category/desserts' },
        { label: 'Groceries', path: '/category/groceries' },
        { label: 'Catering', path: '/category/catering' },
        { label: 'Food Courts', path: '/category/food-courts' },
      ],
    },
    {
      title: 'Popular Districts',
      icon: MapPin,
      links: [
        { label: 'Orchard', path: '/district/orchard' },
        { label: 'Tampines', path: '/district/tampines' },
        { label: 'Jurong East', path: '/district/jurong-east' },
        { label: 'Woodlands', path: '/district/woodlands' },
        { label: 'Bedok', path: '/district/bedok' },
        { label: 'Hougang', path: '/district/hougang' },
        { label: 'Punggol', path: '/district/punggol' },
        { label: 'Sengkang', path: '/district/sengkang' },
        { label: 'Ang Mo Kio', path: '/district/ang-mo-kio' },
        { label: 'Bishan', path: '/district/bishan' },
      ],
    },
    {
      title: 'Property Districts',
      icon: Building2,
      links: [
        { label: 'D01 - Marina Bay / Raffles Place', path: '/property-zone/d01' },
        { label: 'D02 - Chinatown / Tanjong Pagar', path: '/property-zone/d02' },
        { label: 'D07 - Bugis / Arab Street', path: '/property-zone/d07' },
        { label: 'D08 - Little India', path: '/property-zone/d08' },
        { label: 'D09 - Orchard', path: '/property-zone/d09' },
        { label: 'D18 - Tampines / Pasir Ris', path: '/property-zone/d18' },
        { label: 'D19 - Hougang / Punggol / Sengkang', path: '/property-zone/d19' },
        { label: 'D22 - Jurong East / West', path: '/property-zone/d22' },
      ],
    },
    {
      title: 'Best Of Lists',
      icon: Star,
      links: [
        { label: 'Best Halal Restaurants 2024', path: '/best/best-halal-restaurants-singapore' },
        { label: 'Top Cafes in Orchard', path: '/best/top-halal-cafes-orchard' },
        { label: 'Budget Halal Food', path: '/best/budget-halal-food-singapore' },
        { label: 'Family-Friendly Dining', path: '/best/family-friendly-halal-dining-tampines' },
        { label: 'Business Lunch Spots', path: '/best/best-halal-business-lunch-cbd' },
        { label: 'Late Night Halal Food', path: '/best/late-night-halal-food-singapore' },
        { label: 'Halal Buffets', path: '/best/best-halal-buffets-singapore' },
        { label: 'Premium Dining', path: '/best/premium-halal-fine-dining-singapore' },
      ],
    },
    {
      title: 'Admin',
      icon: Shield,
      links: [
        { label: 'Admin Dashboard', path: '/admin' },
        { label: 'User Management', path: '/admin/users' },
        { label: 'Business Management', path: '/admin/businesses' },
        { label: 'Bulk Import', path: '/admin/import' },
        { label: 'Analytics', path: '/admin/analytics' },
        { label: 'Moderation', path: '/admin/moderation' },
        { label: 'Revenue', path: '/admin/revenue' },
        { label: 'System Settings', path: '/admin/system' },
      ],
    },
    {
      title: 'Legal & Info',
      icon: FileText,
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Sitemap', path: '/sitemap' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            Navigation
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Sitemap
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore all pages and sections of Halal SG Connect. Find exactly what
            you're looking for across our comprehensive halal business directory.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-1 text-3xl font-bold text-primary">55+</div>
              <p className="text-sm text-muted-foreground">Planning Areas</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-1 text-3xl font-bold text-primary">28</div>
              <p className="text-sm text-muted-foreground">Property Districts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-1 text-3xl font-bold text-primary">12+</div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-1 text-3xl font-bold text-primary">1,600+</div>
              <p className="text-sm text-muted-foreground">SEO Pages</p>
            </CardContent>
          </Card>
        </div>

        {/* Sitemap Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.path}
                          className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          → {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SEO Info */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Programmatic SEO Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Beyond the pages listed above, we automatically generate
              comprehensive SEO pages for every possible combination:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>District Pages:</strong> /district/[area] (55 planning
                areas)
              </li>
              <li>
                • <strong>District + Category:</strong>{' '}
                /district/[area]/[category] (~550 combinations)
              </li>
              <li>
                • <strong>Property Zones:</strong> /property-zone/[code] (28
                districts)
              </li>
              <li>
                • <strong>Property Zone + Category:</strong>{' '}
                /property-zone/[code]/[category] (~280 combinations)
              </li>
              <li>
                • <strong>Categories:</strong> /category/[category] (~10
                categories)
              </li>
              <li>
                • <strong>Features:</strong> /features/[feature] (halal-certified,
                prayer-facilities, etc.)
              </li>
              <li>
                • <strong>Price Ranges:</strong> /price/[range] (budget, mid-range,
                premium)
              </li>
            </ul>
            <p className="mt-4 text-sm font-medium text-foreground">
              Total: Over 1,600 programmatically generated pages covering all of
              Singapore!
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
