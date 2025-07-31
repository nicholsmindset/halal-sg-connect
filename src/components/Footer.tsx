import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Building2, 
  Utensils, 
  Search,
  Phone,
  Mail,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // District organization by regions for internal linking
  const districtsByRegion = {
    'Central Region': [
      { name: 'Orchard', slug: 'orchard', popular: true },
      { name: 'Marina Bay', slug: 'marina-south', popular: true },
      { name: 'Raffles Place', slug: 'downtown-core', popular: true },
      { name: 'Bugis / Arab Street', slug: 'rochor', popular: true },
      { name: 'Little India', slug: 'serangoon', popular: true },
      { name: 'Chinatown', slug: 'outram', popular: true },
      { name: 'Clarke Quay', slug: 'singapore-river' },
      { name: 'Newton', slug: 'newton' },
      { name: 'Novena', slug: 'novena' },
      { name: 'Bukit Timah', slug: 'bukit-timah' },
      { name: 'Tanglin', slug: 'tanglin' },
      { name: 'River Valley', slug: 'river-valley' },
      { name: 'Toa Payoh', slug: 'toa-payoh' },
      { name: 'Queenstown', slug: 'queenstown' },
      { name: 'Bukit Merah', slug: 'bukit-merah' },
      { name: 'Geylang', slug: 'geylang' },
      { name: 'Kallang', slug: 'kallang' },
      { name: 'Marine Parade', slug: 'marine-parade' }
    ],
    'East Region': [
      { name: 'Tampines', slug: 'tampines', popular: true },
      { name: 'Bedok', slug: 'bedok', popular: true },
      { name: 'Pasir Ris', slug: 'pasir-ris', popular: true },
      { name: 'Changi Airport', slug: 'changi', popular: true },
      { name: 'Paya Lebar', slug: 'paya-lebar' },
      { name: 'Changi Village', slug: 'changi-bay' }
    ],
    'West Region': [
      { name: 'Jurong East', slug: 'jurong-east', popular: true },
      { name: 'Jurong West', slug: 'jurong-west', popular: true },
      { name: 'Clementi', slug: 'clementi', popular: true },
      { name: 'Boon Lay', slug: 'boon-lay' },
      { name: 'Bukit Batok', slug: 'bukit-batok' },
      { name: 'Bukit Panjang', slug: 'bukit-panjang' },
      { name: 'Choa Chu Kang', slug: 'choa-chu-kang' },
      { name: 'Pioneer', slug: 'pioneer' },
      { name: 'Tengah Smart Town', slug: 'tengah' },
      { name: 'Tuas', slug: 'tuas' },
      { name: 'West Coast', slug: 'west-coast' }
    ],
    'North Region': [
      { name: 'Woodlands', slug: 'woodlands', popular: true },
      { name: 'Yishun', slug: 'yishun', popular: true },
      { name: 'Sembawang', slug: 'sembawang' },
      { name: 'Mandai Zoo Area', slug: 'mandai' },
      { name: 'Seletar', slug: 'seletar' },
      { name: 'Lim Chu Kang', slug: 'lim-chu-kang' },
      { name: 'Sungei Kadut', slug: 'sungei-kadut' }
    ],
    'Northeast Region': [
      { name: 'Hougang', slug: 'hougang', popular: true },
      { name: 'Punggol', slug: 'punggol', popular: true },
      { name: 'Sengkang', slug: 'sengkang', popular: true },
      { name: 'Ang Mo Kio', slug: 'ang-mo-kio', popular: true },
      { name: 'Bishan', slug: 'bishan', popular: true },
      { name: 'Serangoon', slug: 'serangoon' }
    ]
  };

  // Popular property districts for business focus
  const popularPropertyDistricts = [
    { code: 'D01', name: 'Marina Bay / Raffles Place', slug: 'd01' },
    { code: 'D02', name: 'Chinatown / Tanjong Pagar', slug: 'd02' },
    { code: 'D07', name: 'Bugis / Arab Street', slug: 'd07' },
    { code: 'D08', name: 'Little India', slug: 'd08' },
    { code: 'D09', name: 'Orchard District', slug: 'd09' },
    { code: 'D18', name: 'Tampines / Pasir Ris', slug: 'd18' },
    { code: 'D19', name: 'Hougang / Punggol / Sengkang', slug: 'd19' },
    { code: 'D20', name: 'Ang Mo Kio / Bishan', slug: 'd20' },
    { code: 'D22', name: 'Jurong East / West', slug: 'd22' },
    { code: 'D25', name: 'Woodlands', slug: 'd25' }
  ];

  // Popular categories for cross-linking
  const popularCategories = [
    'restaurants',
    'cafes', 
    'fast-food',
    'desserts',
    'catering',
    'groceries',
    'bakeries',
    'food-courts'
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                Halal SG Connect
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Singapore's most comprehensive halal business directory. Discover authentic halal dining, 
                shopping, and services across all districts with verified certification and community reviews.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse All Businesses
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/districts" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Districts
                </Link>
              </li>
              <li>
                <Link to="/property-zones" className="text-muted-foreground hover:text-foreground transition-colors">
                  Property Zones
                </Link>
              </li>
              <li>
                <Link to="/add-business" className="text-muted-foreground hover:text-foreground transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              {popularCategories.slice(0, 8).map((category) => (
                <li key={category}>
                  <Link 
                    to={`/category/${category}`}
                    className="text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Halal {category.replace('-', ' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                hello@halalsgconnect.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                +65 1234 5678
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Singapore
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Singapore Districts - Internal Linking Strategy */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Halal Businesses by Singapore Districts
            </h4>
            <p className="text-sm text-muted-foreground">
              Discover authentic halal dining and services in every neighborhood across Singapore
            </p>
          </div>

          {/* Districts by Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Object.entries(districtsByRegion).map(([region, districts]) => (
              <div key={region} className="space-y-3">
                <h5 className="font-medium text-foreground text-sm border-b pb-1">
                  {region}
                </h5>
                <ul className="space-y-1">
                  {districts.map((district) => (
                    <li key={district.slug}>
                      <Link
                        to={`/district/${district.slug}`}
                        className={`text-xs transition-colors ${
                          district.popular 
                            ? 'text-primary hover:text-primary/80 font-medium' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {district.name}
                        {district.popular && <span className="ml-1">★</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Popular Property Districts */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Popular Property Districts
            </h4>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {popularPropertyDistricts.map((district) => (
              <Link
                key={district.code}
                to={`/property-zone/${district.slug}`}
                className="text-xs bg-muted/50 hover:bg-muted px-2 py-1 rounded transition-colors"
              >
                {district.code} {district.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular District + Category Combinations */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Popular Location Searches
            </h4>
          </div>
          
          <div className="flex flex-wrap justify-center gap-1 text-xs">
            {/* Generate popular combinations */}
            {['tampines', 'orchard', 'jurong-east', 'woodlands', 'hougang'].map((district) => 
              ['restaurants', 'cafes'].map((category) => (
                <Link
                  key={`${district}-${category}`}
                  to={`/district/${district}/${category}`}
                  className="text-muted-foreground hover:text-primary transition-colors px-1"
                >
                  {district.replace('-', ' ')} {category}
                </Link>
              ))
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} Halal SG Connect. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Halal SG Connect",
              "description": "Singapore's comprehensive halal business directory",
              "url": "https://halalsgconnect.com",
              "logo": "https://halalsgconnect.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+65-1234-5678",
                "contactType": "customer service",
                "email": "hello@halalsgconnect.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SG",
                "addressLocality": "Singapore"
              },
              "sameAs": [
                "https://facebook.com/halalsgconnect",
                "https://instagram.com/halalsgconnect",
                "https://twitter.com/halalsgconnect"
              ]
            })
          }}
        />
      </div>
    </footer>
  );
}