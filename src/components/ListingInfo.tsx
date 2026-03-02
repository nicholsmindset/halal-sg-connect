import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
} from 'lucide-react';

interface ListingInfoProps {
  listing: any;
}

const ListingInfo = ({ listing }: ListingInfoProps) => {
  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    whatsapp: MessageCircle,
    twitter: Twitter,
  };

  const isHalalCertified = listing.isHalalCertified ?? listing.halal_certified;
  const reviewCount = listing.reviewCount ?? listing.review_count ?? 0;
  const priceRange = listing.priceRange ?? listing.price_range ?? '$$';
  const category = listing.category ?? listing.categories?.[0] ?? '';
  const openingHours = listing.openingHours ?? listing.opening_hours;
  const socialMedia = listing.socialMedia ?? listing.social_media;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {listing.name}
              </h1>
              <div className="mb-3 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">{listing.rating ?? 0}</span>
                  <span className="text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                </div>
                {category && <Badge variant="outline">{category}</Badge>}
                {isHalalCertified && (
                  <Badge className="bg-success text-success-foreground">
                    <Shield className="mr-1 h-3 w-3" />
                    Halal Certified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{listing.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-2xl font-bold text-primary">
                {priceRange}
              </div>
              <span className="text-sm text-muted-foreground">Price Range</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About {listing.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          </CardContent>
        </Card>

        {openingHours && typeof openingHours === 'object' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Opening Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(openingHours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium capitalize">{day}</span>
                    <span className="text-muted-foreground">
                      {hours?.closed ? 'Closed' : `${hours?.open || ''} - ${hours?.close || ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Interactive map will be available with Google Maps integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {listing.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Phone</div>
                  <a href={`tel:${listing.phone}`} className="text-primary hover:underline">
                    {listing.phone}
                  </a>
                </div>
              </div>
            )}
            {listing.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Email</div>
                  <a href={`mailto:${listing.email}`} className="text-primary hover:underline">
                    {listing.email}
                  </a>
                </div>
              </div>
            )}
            {listing.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Website</div>
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {socialMedia && typeof socialMedia === 'object' && Object.keys(socialMedia).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  if (!Icon) return null;
                  return (
                    <Button key={platform} variant="outline" size="sm" asChild>
                      <a href={url as string} target="_blank" rel="noopener noreferrer">
                        <Icon className="mr-2 h-4 w-4" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
              <Button variant="outline" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                Write Review
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-muted-foreground">
              Advertisement Space
              <br />
              (Google AdSense integration)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListingInfo;
