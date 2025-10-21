import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Globe, Crown } from 'lucide-react';
import { type Business } from '@/types/business';

interface ListingCardProps {
  listing: Business;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {listing.isPremium && (
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant="secondary"
            className="bg-warning text-warning-foreground"
          >
            <Crown className="mr-1 h-3 w-3" />
            Premium
          </Badge>
        </div>
      )}

      <div className="aspect-video overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {listing.name}
          </h3>
          {listing.isHalalCertified && (
            <Badge
              variant="secondary"
              className="bg-success text-xs text-success-foreground"
            >
              Halal Certified
            </Badge>
          )}
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {listing.description}
        </p>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({listing.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{'$'.repeat(parseInt(listing.priceRange))}</span>
          </div>
        </div>

        <div className="mb-3 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="line-clamp-1">{listing.district}</span>
        </div>

        <Badge variant="outline" className="text-xs">
          {listing.category}
        </Badge>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full space-x-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/listing/${listing.slug}`}>View Details</Link>
          </Button>
          {listing.phone && (
            <Button size="sm" variant="ghost" asChild>
              <a href={`tel:${listing.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          {listing.website && (
            <Button size="sm" variant="ghost" asChild>
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
