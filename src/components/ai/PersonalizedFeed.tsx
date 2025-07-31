import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, MapPin, Heart, Clock } from 'lucide-react';
import { Business, AIRecommendation } from '@/types/business';
import ListingCard from '@/components/ListingCard';
import { mockListings } from '@/lib/mockData';

interface PersonalizedFeedProps {
  userId?: string;
  userPreferences?: {
    cuisineTypes: string[];
    priceRange: string[];
    location: string;
  };
}

const PersonalizedFeed = ({ userId, userPreferences }: PersonalizedFeedProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [personalizedListings, setPersonalizedListings] = useState<Business[]>([]);
  const [feedSections, setFeedSections] = useState<{
    trending: Business[];
    nearYou: Business[];
    recommended: Business[];
    newOpenings: Business[];
  }>({
    trending: [],
    nearYou: [],
    recommended: [],
    newOpenings: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate AI recommendation engine
  const generateRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate AI recommendations based on user preferences
    const aiRecs: AIRecommendation[] = mockListings.slice(0, 6).map((business, index) => ({
      businessId: business.id,
      score: Math.random() * 0.4 + 0.6, // 0.6-1.0 score
      reasons: generateRecommendationReasons(business, userPreferences),
      type: ['similar_taste', 'location_based', 'trending', 'personalized'][index % 4] as any
    }));
    
    setRecommendations(aiRecs);
    
    // Organize feed sections
    const shuffled = [...mockListings].sort(() => Math.random() - 0.5);
    setFeedSections({
      trending: shuffled.slice(0, 4),
      nearYou: shuffled.slice(4, 8),
      recommended: shuffled.slice(8, 12),
      newOpenings: shuffled.slice(12, 16)
    });
    
    setPersonalizedListings(shuffled.slice(0, 8));
    setIsLoading(false);
  };

  const generateRecommendationReasons = (business: Business, prefs?: any): string[] => {
    const reasons = [];
    
    if (prefs?.cuisineTypes?.includes(business.category)) {
      reasons.push(`Matches your love for ${business.category} cuisine`);
    }
    
    if (business.rating >= 4.5) {
      reasons.push('Highly rated by the community');
    }
    
    if (business.isPremium) {
      reasons.push('Premium quality establishment');
    }
    
    if (business.isHalalCertified) {
      reasons.push('Verified halal certification');
    }
    
    if (Math.random() > 0.5) {
      reasons.push('Popular among users with similar taste');
    }
    
    return reasons.slice(0, 2);
  };

  const getRecommendationIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'location_based': return <MapPin className="h-4 w-4" />;
      case 'similar_taste': return <Heart className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [userId, userPreferences]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse text-primary" />
              <CardTitle>AI is personalizing your feed...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Recommendations Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI Curated Just for You</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {recommendations.length} recommendations
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Based on your preferences, dining history, and current trends in Singapore's halal food scene.
          </p>
          <Button variant="outline" size="sm" onClick={generateRecommendations}>
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </CardContent>
      </Card>

      {/* Trending Now Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Now</h2>
          <Badge variant="secondary">Hot</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feedSections.trending.map((business) => {
            const rec = recommendations.find(r => r.businessId === business.id);
            return (
              <div key={business.id} className="relative">
                <ListingCard listing={business} />
                {rec && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {Math.round(rec.score * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Near You Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Near You</h2>
          <Badge variant="outline">Within 2km</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feedSections.nearYou.map((business) => (
            <ListingCard key={business.id} listing={business} />
          ))}
        </div>
      </section>

      {/* AI Recommended Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Perfect Match</h2>
          <Badge variant="secondary">AI Curated</Badge>
        </div>
        <div className="space-y-4">
          {recommendations.slice(0, 3).map((rec) => {
            const business = mockListings.find(b => b.id === rec.businessId);
            if (!business) return null;
            
            return (
              <Card key={rec.businessId} className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={business.images[0]}
                        alt={business.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        <div className="flex items-center gap-2">
                          {getRecommendationIcon(rec.type)}
                          <Badge variant="secondary">
                            {Math.round(rec.score * 100)}% match
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {business.description}
                      </p>
                      <div className="space-y-1">
                        {rec.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-3 w-3 text-primary" />
                            <span className="text-muted-foreground">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* New Openings Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">New Openings</h2>
          <Badge variant="outline">Fresh additions</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {feedSections.newOpenings.map((business) => (
            <div key={business.id} className="relative">
              <ListingCard listing={business} />
              <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                New
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PersonalizedFeed;