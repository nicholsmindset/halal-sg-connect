import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Twitter
} from "lucide-react";
import { type Business } from "@/types/business";

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{listing.name}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                </div>
                <Badge variant="outline">{listing.category}</Badge>
                {listing.isHalalCertified && (
                  <Badge className="bg-success text-success-foreground">
                    <Shield className="w-3 h-3 mr-1" />
                    Halal Certified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{listing.address}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary mb-1">
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
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Opening Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(listing.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize font-medium">{day}</span>
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
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map will be available with Google Maps integration</p>
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
                <Phone className="w-5 h-5 text-primary" />
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
                <Mail className="w-5 h-5 text-primary" />
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
                <Globe className="w-5 h-5 text-primary" />
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
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  if (!Icon) return null;
                  return (
                    <Button key={platform} variant="outline" size="sm" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <Icon className="w-4 h-4 mr-2" />
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
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button variant="outline" className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ad Slot Placeholder */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground text-sm">
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