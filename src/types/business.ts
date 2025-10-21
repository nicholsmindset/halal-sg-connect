export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  district: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  images: string[];
  videos?: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  isHalalCertified: boolean;
  isPremium: boolean;
  subscriptionTier: 'free' | 'premium' | 'premium_plus' | 'enterprise';
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  features: string[];
  tags: string[];
  slug: string;
  views: number;
  clicks: number;
  lastUpdated: string;
  aiGenerated?: {
    description?: boolean;
    tags?: boolean;
    categorization?: boolean;
  };
  analytics?: {
    weeklyViews: number;
    monthlyViews: number;
    conversionRate: number;
    averageRating: number;
  };
  events?: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'iftar' | 'eid' | 'special' | 'promotion';
  }>;
  menuQrCode?: string;
  virtualTour?: string;
  multiLocation?: {
    isChain: boolean;
    locations: Array<{
      id: string;
      name: string;
      address: string;
      phone: string;
    }>;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'premium' | 'premium_plus' | 'enterprise';
  preferences: {
    cuisineTypes: string[];
    priceRange: string[];
    dietaryRestrictions: string[];
    location: string;
  };
  searchHistory: string[];
  viewHistory: string[];
  favoriteBusinesses: string[];
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  keyInsights: string[];
  date: string;
  helpful: number;
  photos?: string[];
}

export interface SearchQuery {
  query: string;
  filters: {
    category?: string;
    district?: string;
    priceRange?: string;
    isHalalCertified?: boolean;
    rating?: number;
    features?: string[];
  };
  intent: 'dining' | 'delivery' | 'catering' | 'general';
  location?: {
    lat: number;
    lng: number;
  };
  suggestedFilters?: Array<{
    key: string;
    value: string;
    reason: string;
  }>;
}

export interface AIRecommendation {
  businessId: string;
  score: number;
  reasons: string[];
  type: 'similar_taste' | 'location_based' | 'trending' | 'personalized';
}
