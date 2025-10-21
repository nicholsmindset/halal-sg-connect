import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Globe, Crown } from "lucide-react";
import { type Business } from "@/types/business";

interface ListingCardProps {
  listing: Business;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {listing.isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-warning text-warning-foreground">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      <div className="aspect-video overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          {listing.isHalalCertified && (
            <Badge variant="secondary" className="bg-success text-success-foreground text-xs">
              Halal Certified
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">({listing.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{'$'.repeat(parseInt(listing.priceRange))}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="line-clamp-1">{listing.district}</span>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {listing.category}
        </Badge>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/listing/${listing.slug}`}>
              View Details
            </Link>
          </Button>
          {listing.phone && (
            <Button size="sm" variant="ghost" asChild>
              <a href={`tel:${listing.phone}`}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
          )}
          {listing.website && (
            <Button size="sm" variant="ghost" asChild>
              <a href={listing.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;