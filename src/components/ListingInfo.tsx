import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { type Business } from '@/types/business';

interface ListingInfoProps {
  listing: Business;
}

const ListingInfo = ({ listing }: ListingInfoProps) => {
  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    whatsapp: MessageCircle,
    twitter: Twitter,
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Header */}
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                {listing.name}
              </h1>
              <div className="mb-3 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-muted-foreground">
                    ({listing.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="outline">{listing.category}</Badge>
                {listing.isHalalCertified && (
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
                {'$'.repeat(parseInt(listing.priceRange))}
              </div>
              <span className="text-sm text-muted-foreground">Price Range</span>
            </div>
          </div>
        </div>

        {/* Description */}
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

        {/* Opening Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Opening Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(listing.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium capitalize">{day}</span>
                  <span className="text-muted-foreground">
                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Map Placeholder */}
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
        {/* Contact Info */}
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
                  <a
                    href={`tel:${listing.phone}`}
                    className="text-primary hover:underline"
                  >
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
                  <a
                    href={`mailto:${listing.email}`}
                    className="text-primary hover:underline"
                  >
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
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        {listing.socialMedia && Object.keys(listing.socialMedia).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Follow Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(listing.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon =
                    socialIcons[platform as keyof typeof socialIcons];
                  if (!Icon) return null;
                  return (
                    <Button key={platform} variant="outline" size="sm" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
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

        {/* Action Buttons */}
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

        {/* Ad Slot Placeholder */}
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
