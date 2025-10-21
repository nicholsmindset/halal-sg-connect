import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import ListingCard from '../ListingCard';
import { type Business } from '@/types/business';

const mockListing: Business = {
  id: '1',
  name: 'Test Restaurant',
  slug: 'test-restaurant',
  description: 'A great test restaurant',
  category: 'Restaurants',
  subcategory: 'Asian',
  district: 'Orchard',
  address: '123 Test Street',
  phone: '+65 1234 5678',
  email: 'test@restaurant.com',
  website: 'https://test-restaurant.com',
  images: ['/placeholder.svg'],
  videos: [],
  isHalalCertified: true,
  priceRange: '$$',
  rating: 4.5,
  reviewCount: 100,
  isPremium: false,
  subscriptionTier: 'free',
  features: ['dine-in', 'takeaway'],
  tags: ['asian', 'halal'],
  views: 1000,
  clicks: 50,
  lastUpdated: '2024-01-01T00:00:00Z',
  openingHours: {
    monday: { open: '10:00', close: '22:00' },
    tuesday: { open: '10:00', close: '22:00' },
    wednesday: { open: '10:00', close: '22:00' },
    thursday: { open: '10:00', close: '22:00' },
    friday: { open: '10:00', close: '22:00' },
    saturday: { open: '10:00', close: '22:00' },
    sunday: { open: '10:00', close: '22:00' },
  },
};

describe('ListingCard', () => {
  it('renders listing information correctly', () => {
    render(<ListingCard listing={mockListing} />);

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('A great test restaurant')).toBeInTheDocument();
    expect(screen.getByText('Orchard')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(100 reviews)')).toBeInTheDocument();
  });

  it('shows premium badge for premium listings', () => {
    const premiumListing = { ...mockListing, isPremium: true };
    render(<ListingCard listing={premiumListing} />);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('does not show premium badge for free listings', () => {
    render(<ListingCard listing={mockListing} />);

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('displays halal certified badge', () => {
    render(<ListingCard listing={mockListing} />);

    expect(screen.getByText('Halal Certified')).toBeInTheDocument();
  });
});
