import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { mockCategories, mockDistricts } from '@/lib/mockData';

const SearchFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [halalOnly, setHalalOnly] = useState(false);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDistrict('');
    setPriceRange('');
    setHalalOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedDistrict,
    priceRange,
    halalOnly,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search businesses, cuisine, or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger>
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                {mockDistricts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">$ (Budget)</SelectItem>
                <SelectItem value="2">$$ (Moderate)</SelectItem>
                <SelectItem value="3">$$$ (Expensive)</SelectItem>
                <SelectItem value="4">$$$$ (Very Expensive)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button
                variant={halalOnly ? 'default' : 'outline'}
                onClick={() => setHalalOnly(!halalOnly)}
                className="flex-1"
              >
                <span className="mr-2">🥩</span>
                Halal Certified Only
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {selectedCategory && (
                <Badge variant="secondary">
                  {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => setSelectedCategory('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedDistrict && (
                <Badge variant="secondary">
                  {selectedDistrict}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => setSelectedDistrict('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {priceRange && (
                <Badge variant="secondary">
                  {'$'.repeat(parseInt(priceRange))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => setPriceRange('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {halalOnly && (
                <Badge variant="secondary">
                  Halal Certified
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => setHalalOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                Clear all
              </Button>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-end">
            <Button className="min-w-32">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
