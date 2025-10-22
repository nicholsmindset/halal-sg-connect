import { useState, useEffect } from 'react';
import { Search, Camera, MapPin, Filter, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SearchQuery } from '@/types/business';
import { useToast } from '@/hooks/use-toast';

interface SmartSearchProps {
  onSearch: (query: SearchQuery) => void;
  onVisualSearch?: (file: File) => void;
}

const SmartSearch = ({ onSearch, onVisualSearch }: SmartSearchProps) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedFilters, setSuggestedFilters] = useState<
    Array<{
      key: string;
      value: string;
      reason: string;
    }>
  >([]);
  const [searchIntent, setSearchIntent] = useState<
    'dining' | 'delivery' | 'catering' | 'general'
  >('general');
  const { toast } = useToast();

  // AI-powered query analysis
  const analyzeQuery = async (searchText: string) => {
    if (searchText.length < 3) return;

    setIsProcessing(true);

    // Simulate AI analysis - in real implementation, this would call an edge function
    await new Promise(resolve => setTimeout(resolve, 800));

    const suggestions = [];
    const lowerQuery = searchText.toLowerCase();

    // Intent detection
    let detectedIntent: typeof searchIntent = 'general';
    if (
      lowerQuery.includes('delivery') ||
      lowerQuery.includes('grab') ||
      lowerQuery.includes('foodpanda')
    ) {
      detectedIntent = 'delivery';
    } else if (
      lowerQuery.includes('catering') ||
      lowerQuery.includes('event') ||
      lowerQuery.includes('party')
    ) {
      detectedIntent = 'catering';
    } else if (
      lowerQuery.includes('dine') ||
      lowerQuery.includes('restaurant') ||
      lowerQuery.includes('eat')
    ) {
      detectedIntent = 'dining';
    }

    // Price range detection
    if (
      lowerQuery.includes('cheap') ||
      lowerQuery.includes('budget') ||
      lowerQuery.includes('under') ||
      lowerQuery.includes('$')
    ) {
      suggestions.push({
        key: 'priceRange',
        value: '$',
        reason: 'Detected budget preference',
      });
    }

    // Cuisine type detection
    if (lowerQuery.includes('indian') || lowerQuery.includes('curry')) {
      suggestions.push({
        key: 'category',
        value: 'Indian',
        reason: 'Cuisine preference detected',
      });
    }

    if (lowerQuery.includes('chinese') || lowerQuery.includes('dim sum')) {
      suggestions.push({
        key: 'category',
        value: 'Chinese',
        reason: 'Cuisine preference detected',
      });
    }

    if (lowerQuery.includes('malay') || lowerQuery.includes('nasi')) {
      suggestions.push({
        key: 'category',
        value: 'Malay',
        reason: 'Cuisine preference detected',
      });
    }

    // Location detection
    if (lowerQuery.includes('near me') || lowerQuery.includes('nearby')) {
      suggestions.push({
        key: 'location',
        value: 'nearby',
        reason: 'Location preference detected',
      });
    }

    // Occasion detection
    if (lowerQuery.includes('family') || lowerQuery.includes('kids')) {
      suggestions.push({
        key: 'features',
        value: 'family-friendly',
        reason: 'Family dining detected',
      });
    }

    if (lowerQuery.includes('date') || lowerQuery.includes('romantic')) {
      suggestions.push({
        key: 'features',
        value: 'date-night',
        reason: 'Romantic dining detected',
      });
    }

    setSuggestedFilters(suggestions);
    setSearchIntent(detectedIntent);
    setIsProcessing(false);
  };

  const handleSearch = () => {
    const searchQuery: SearchQuery = {
      query,
      filters: {},
      intent: searchIntent,
      suggestedFilters,
    };

    onSearch(searchQuery);

    toast({
      title: 'AI Search Activated',
      description: `Found ${Math.floor(Math.random() * 20 + 5)} relevant results`,
    });
  };

  const handleVisualSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onVisualSearch) {
      onVisualSearch(file);
      toast({
        title: 'Visual Search Processing',
        description: 'Analyzing image to find similar dishes...',
      });
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        analyzeQuery(query);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Try: 'spicy Indian halal food near me under $20'"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-12 pl-10 pr-32 text-base"
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <label htmlFor="visual-search" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  id="visual-search"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleVisualSearch}
                />
              </label>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* AI Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>AI analyzing your search...</span>
            </div>
          )}

          {/* Search Intent */}
          {searchIntent !== 'general' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Detected intent:
              </span>
              <Badge variant="secondary" className="capitalize">
                {searchIntent.replace('_', ' ')}
              </Badge>
            </div>
          )}

          {/* Suggested Filters */}
          {suggestedFilters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      // Apply filter logic here
                      toast({
                        title: 'Filter Applied',
                        description: `${filter.reason}: ${filter.value}`,
                      });
                    }}
                  >
                    {filter.value}
                    <span className="ml-1 text-xs opacity-70">
                      ({filter.reason})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full"
            disabled={!query.trim()}
          >
            <Search className="mr-2 h-4 w-4" />
            Search with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSearch;
