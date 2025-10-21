import { supabase } from '@/integrations/supabase/client';
import { SEOPage, SEOPageContent, District, Category } from '@/types/import';
import { Business } from '@/types/business';
import {
  generateDistrictContent,
  generatePropertyDistrictContent,
  generateCombinationContent,
  DistrictData,
  PropertyDistrictData,
} from './district-content-generator';

export class SEOPageGenerator {
  // Generate SEO page content based on filters
  static async generatePageContent(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>
  ): Promise<SEOPageContent | null> {
    try {
      // Get filtered businesses
      const businesses = await this.getFilteredBusinesses(filters);

      if (businesses.length === 0) {
        return null;
      }

      // Generate statistics
      const stats = this.calculateBusinessStats(businesses);

      // Generate content based on page type
      const content: SEOPageContent = {
        intro_text: await this.generateIntroText(
          pageType,
          filters,
          businesses.length
        ),
        highlights: this.generateHighlights(businesses, filters),
        local_info: await this.generateLocalInfo(filters),
        business_stats: stats,
        faqs: await this.generateFAQs(pageType, filters),
        related_searches: this.generateRelatedSearches(pageType, filters),
      };

      return content;
    } catch (error) {
      console.error('Error generating SEO page content:', error);
      return null;
    }
  }

  // Get businesses based on filters
  private static async getFilteredBusinesses(
    filters: Record<string, any>
  ): Promise<Business[]> {
    let query = supabase
      .from('business_search_view')
      .select('*')
      .eq('verification_status', 'verified')
      .order('rating', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.contains('category_slugs', [filters.category]);
    }

    if (filters.district) {
      query = query.eq('district', filters.district);
    }

    // New district-specific filters
    if (filters.planning_area) {
      query = query.eq(
        'planning_area',
        filters.planning_area.replace('-', ' ')
      );
    }

    if (filters.property_district_code) {
      query = query.eq(
        'property_district_code',
        filters.property_district_code
      );
    }

    if (filters.halal_certified) {
      query = query.eq('halal_certified', true);
    }

    if (filters.price_range) {
      query = query.eq('price_range', filters.price_range);
    }

    if (filters.cuisine_type) {
      query = query.contains('cuisine_types', [filters.cuisine_type]);
    }

    if (filters.feature) {
      query = query.contains('features', [filters.feature]);
    }

    const { data, error } = await query.limit(500);

    if (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }

    return data || [];
  }

  // Calculate business statistics
  private static calculateBusinessStats(businesses: Business[]) {
    const totalCount = businesses.length;
    const avgRating =
      businesses.reduce((sum, b) => sum + b.rating, 0) / totalCount;

    // Price distribution
    const priceDistribution: Record<string, number> = {};
    businesses.forEach(b => {
      if (b.price_range) {
        priceDistribution[b.price_range] =
          (priceDistribution[b.price_range] || 0) + 1;
      }
    });

    // Popular cuisines
    const cuisineCount: Record<string, number> = {};
    businesses.forEach(b => {
      b.cuisine_types?.forEach(cuisine => {
        cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
      });
    });
    const popularCuisines = Object.entries(cuisineCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cuisine]) => cuisine);

    // Top features
    const featureCount: Record<string, number> = {};
    businesses.forEach(b => {
      b.features?.forEach(feature => {
        featureCount[feature] = (featureCount[feature] || 0) + 1;
      });
    });
    const topFeatures = Object.entries(featureCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);

    return {
      total_count: totalCount,
      avg_rating: Math.round(avgRating * 10) / 10,
      price_distribution: priceDistribution,
      popular_cuisines: popularCuisines,
      top_features: topFeatures,
    };
  }

  // Generate intro text based on page type and filters
  private static async generateIntroText(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>,
    businessCount: number
  ): Promise<string> {
    const templates = {
      category: `Discover ${businessCount} authentic halal ${filters.category} in Singapore. From traditional favorites to modern fusion, find the perfect dining experience with verified halal certification, customer reviews, and detailed information.`,

      location: `Explore ${businessCount} halal businesses in ${filters.district}. Whether you're looking for dining, shopping, or services, discover trusted halal-certified establishments in this vibrant Singapore district.`,

      combination: `Find ${businessCount} halal ${filters.category} in ${filters.district}. Enjoy authentic cuisine and quality service from verified halal establishments in one of Singapore's most popular areas.`,

      // New district-specific templates
      district: `Discover ${businessCount} halal restaurants and businesses in ${filters.planning_area?.replace('-', ' ')}. This Singapore planning area offers diverse halal dining options, from family-friendly neighborhood favorites to specialized cuisine establishments, all with verified halal certification.`,

      district_category: `Find ${businessCount} halal ${filters.category} in ${filters.planning_area?.replace('-', ' ')}. Explore authentic ${filters.category} establishments in this vibrant Singapore district, featuring verified halal certification and excellent customer reviews.`,

      property_zone: `Explore ${businessCount} halal businesses in Singapore's ${filters.property_district_code} property district. From premium dining to neighborhood favorites, discover halal-certified establishments that serve this dynamic area's diverse community.`,

      property_zone_category: `Discover ${businessCount} halal ${filters.category} in ${filters.property_district_code} property district. Experience quality ${filters.category} with verified halal certification in one of Singapore's key postal districts.`,

      feature: `Browse ${businessCount} halal businesses offering ${filters.feature}. Discover establishments that cater to your specific needs while maintaining the highest halal standards.`,

      price: `Explore ${businessCount} ${filters.price_range} halal dining options in Singapore. Enjoy quality halal cuisine that fits your budget, from affordable local favorites to premium dining experiences.`,

      cuisine: `Discover ${businessCount} authentic halal ${filters.cuisine_type} restaurants in Singapore. From traditional recipes to modern interpretations, find the best halal-certified establishments.`,
    };

    return (
      templates[pageType] ||
      `Discover ${businessCount} halal businesses in Singapore with verified certification and authentic experiences.`
    );
  }

  // Generate highlights for the page
  private static generateHighlights(
    businesses: Business[],
    filters: Record<string, any>
  ): string[] {
    const highlights: string[] = [];

    // Top-rated businesses
    const topRated = businesses.filter(b => b.rating >= 4.5).slice(0, 3);

    if (topRated.length > 0) {
      highlights.push(
        `Top-rated establishments include ${topRated.map(b => b.name).join(', ')}`
      );
    }

    // Premium businesses
    const premiumCount = businesses.filter(b => b.is_premium).length;
    if (premiumCount > 0) {
      highlights.push(
        `${premiumCount} premium listings with enhanced features and verified information`
      );
    }

    // Halal certification
    const certifiedCount = businesses.filter(b => b.halal_certified).length;
    if (certifiedCount > 0) {
      highlights.push(
        `${certifiedCount} businesses with verified halal certification`
      );
    }

    // Delivery options
    const deliveryCount = businesses.filter(
      b => b.delivery_platforms && b.delivery_platforms.length > 0
    ).length;
    if (deliveryCount > 0) {
      highlights.push(`${deliveryCount} businesses offering delivery services`);
    }

    return highlights.slice(0, 4); // Limit to 4 highlights
  }

  // Generate local information for location-based pages
  private static async generateLocalInfo(
    filters: Record<string, any>
  ): Promise<string | undefined> {
    if (!filters.district) return undefined;

    // Get district information
    const { data: district } = await supabase
      .from('districts')
      .select('*')
      .eq('slug', filters.district)
      .single();

    if (!district) return undefined;

    return `${district.name} is located in ${district.region} Singapore and is known for ${district.description}. The area is well-connected with multiple transport options including ${district.transport_hubs?.join(', ')}. Popular landmarks include ${district.landmarks?.join(', ')}.`;
  }

  // Generate FAQs for the page
  private static async generateFAQs(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>
  ): Promise<Array<{ question: string; answer: string }>> {
    const faqs: Array<{ question: string; answer: string }> = [];

    if (pageType === 'category') {
      faqs.push({
        question: `What are the best halal ${filters.category} in Singapore?`,
        answer: `Singapore offers numerous excellent halal ${filters.category} with MUIS certification. Popular options include traditional establishments in areas like Geylang and Arab Street, as well as modern outlets in shopping centers across the island.`,
      });

      faqs.push({
        question: `How do I know if a ${filters.category?.slice(0, -1)} is halal-certified?`,
        answer: `Look for the official MUIS halal certificate displayed at the establishment. All businesses listed on our platform with halal certification have been verified and include certification details.`,
      });
    }

    if (pageType === 'location') {
      faqs.push({
        question: `What halal food options are available in ${filters.district}?`,
        answer: `${filters.district} offers a diverse range of halal dining options, from traditional Malay and Indian cuisine to modern fusion restaurants. Many establishments are MUIS-certified and cater to various budgets and preferences.`,
      });

      faqs.push({
        question: `How do I get to ${filters.district} by public transport?`,
        answer: `${filters.district} is well-connected by MRT, bus services, and taxi. Check the specific business listings for detailed directions and the nearest MRT stations.`,
      });
    }

    if (pageType === 'combination') {
      faqs.push({
        question: `Are there halal ${filters.category} in ${filters.district}?`,
        answer: `Yes, ${filters.district} has several halal-certified ${filters.category} options. These establishments offer authentic cuisine while maintaining strict halal standards and MUIS certification.`,
      });
    }

    return faqs;
  }

  // Generate related searches
  private static generateRelatedSearches(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>
  ): string[] {
    const searches: string[] = [];

    if (pageType === 'category') {
      searches.push(
        `halal ${filters.category} near me`,
        `best ${filters.category} singapore`,
        `MUIS certified ${filters.category}`,
        `${filters.category} delivery singapore`
      );
    }

    if (pageType === 'location') {
      searches.push(
        `halal food ${filters.district}`,
        `restaurants ${filters.district}`,
        `${filters.district} halal dining`,
        `cafes ${filters.district}`
      );
    }

    if (pageType === 'combination') {
      searches.push(
        `halal ${filters.category} ${filters.district}`,
        `best ${filters.category} ${filters.district}`,
        `${filters.district} ${filters.category} delivery`,
        `MUIS ${filters.category} ${filters.district}`
      );
    }

    return searches.slice(0, 6);
  }

  // Generate and store SEO page
  static async generateAndStorePage(
    slug: string,
    pageType: SEOPage['page_type'],
    filters: Record<string, any>
  ): Promise<SEOPage | null> {
    try {
      const content = await this.generatePageContent(pageType, filters);

      if (!content) {
        return null;
      }

      // Generate SEO metadata
      const { title, metaDescription, h1Title } = this.generateSEOMetadata(
        pageType,
        filters,
        content.business_stats.total_count
      );

      // Generate schema markup
      const schemaMarkup = this.generateSchemaMarkup(
        pageType,
        filters,
        content
      );

      const seoPage: Omit<SEOPage, 'id' | 'created_at' | 'updated_at'> = {
        slug,
        page_type: pageType,
        title,
        meta_description: metaDescription,
        h1_title: h1Title,
        content,
        filters,
        business_count: content.business_stats.total_count,
        view_count: 0,
        last_content_update: new Date().toISOString(),
        is_published: true,
        canonical_url: `https://halal-sg-connect.netlify.app/${slug}`,
        schema_markup: schemaMarkup,
        related_pages: this.generateRelatedPages(pageType, filters),
      };

      // Store in database
      const { data, error } = await supabase
        .from('seo_pages')
        .upsert(seoPage, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error('Error storing SEO page:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error generating SEO page:', error);
      return null;
    }
  }

  // Generate SEO metadata
  private static generateSEOMetadata(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>,
    businessCount: number
  ) {
    const templates = {
      category: {
        title: `Best Halal ${filters.category} in Singapore | ${businessCount}+ Verified Options`,
        metaDescription: `Discover ${businessCount}+ halal-certified ${filters.category} in Singapore. Find authentic cuisine, read reviews, and get contact details for MUIS-certified establishments.`,
        h1Title: `Halal ${filters.category} in Singapore`,
      },
      location: {
        title: `${businessCount}+ Halal Businesses in ${filters.district} | Singapore Directory`,
        metaDescription: `Find ${businessCount}+ halal businesses in ${filters.district}, Singapore. Restaurants, cafes, shops, and services with verified halal certification.`,
        h1Title: `Halal Businesses in ${filters.district}`,
      },
      combination: {
        title: `${businessCount}+ Halal ${filters.category} in ${filters.district} | Best Options 2024`,
        metaDescription: `Top ${businessCount}+ halal ${filters.category} in ${filters.district}. Verified MUIS-certified establishments with reviews, ratings, and contact details.`,
        h1Title: `Halal ${filters.category} in ${filters.district}`,
      },
      feature: {
        title: `${businessCount}+ Halal Businesses with ${filters.feature} | Singapore`,
        metaDescription: `Find ${businessCount}+ halal businesses offering ${filters.feature} in Singapore. Verified establishments with detailed information and reviews.`,
        h1Title: `Halal Businesses with ${filters.feature}`,
      },
      price: {
        title: `${businessCount}+ ${filters.price_range} Halal Dining Options | Singapore`,
        metaDescription: `Explore ${businessCount}+ ${filters.price_range} halal restaurants in Singapore. Quality halal cuisine for every budget with verified certification.`,
        h1Title: `${filters.price_range} Halal Dining in Singapore`,
      },
      cuisine: {
        title: `${businessCount}+ Halal ${filters.cuisine_type} Restaurants | Singapore`,
        metaDescription: `Best ${businessCount}+ halal ${filters.cuisine_type} restaurants in Singapore. Authentic cuisine with MUIS certification and customer reviews.`,
        h1Title: `Halal ${filters.cuisine_type} Restaurants`,
      },
    };

    return (
      templates[pageType] || {
        title: `${businessCount}+ Halal Businesses | Singapore Directory`,
        metaDescription: `Discover ${businessCount}+ halal businesses in Singapore with verified certification and authentic experiences.`,
        h1Title: `Halal Businesses in Singapore`,
      }
    );
  }

  // Generate schema markup for SEO
  private static generateSchemaMarkup(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>,
    content: SEOPageContent
  ) {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.intro_text.substring(0, 100),
      description: content.intro_text,
      url: `https://halal-sg-connect.netlify.app/${Object.values(filters).join('/')}`,
      inLanguage: 'en-SG',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Halal SG Connect',
        url: 'https://halal-sg-connect.netlify.app',
      },
    };

    if (pageType === 'location') {
      return {
        ...baseSchema,
        '@type': 'LocalBusiness',
        address: {
          '@type': 'PostalAddress',
          addressLocality: filters.district,
          addressCountry: 'SG',
        },
      };
    }

    return baseSchema;
  }

  // Generate related pages
  private static generateRelatedPages(
    pageType: SEOPage['page_type'],
    filters: Record<string, any>
  ): string[] {
    const relatedPages: string[] = [];

    if (pageType === 'category') {
      // Add location variations
      relatedPages.push(
        `orchard/${filters.category}`,
        `chinatown/${filters.category}`,
        `marina-bay/${filters.category}`
      );
    }

    if (pageType === 'location') {
      // Add category variations
      relatedPages.push(
        `${filters.district}/restaurants`,
        `${filters.district}/cafes`,
        `${filters.district}/takeaway`
      );
    }

    return relatedPages.slice(0, 5);
  }

  // Batch generate SEO pages
  static async generateAllPages(): Promise<void> {
    try {
      // Get all districts and categories
      const [{ data: districts }, { data: categories }] = await Promise.all([
        supabase.from('districts').select('*').eq('is_active', true),
        supabase.from('categories').select('*').eq('is_active', true),
      ]);

      if (!districts || !categories) {
        console.error('Failed to fetch districts or categories');
        return;
      }

      const pages: Array<{
        slug: string;
        pageType: SEOPage['page_type'];
        filters: Record<string, any>;
      }> = [];

      // Generate category pages
      categories.forEach(category => {
        pages.push({
          slug: `category/${category.slug}`,
          pageType: 'category',
          filters: { category: category.slug },
        });
      });

      // Generate location pages
      districts.forEach(district => {
        pages.push({
          slug: district.slug,
          pageType: 'location',
          filters: { district: district.name },
        });
      });

      // Generate combination pages (district + category)
      districts.forEach(district => {
        categories.forEach(category => {
          pages.push({
            slug: `${district.slug}/${category.slug}`,
            pageType: 'combination',
            filters: { district: district.name, category: category.slug },
          });
        });
      });

      // Generate feature pages
      const features = [
        'halal-certified',
        'delivery-available',
        'family-friendly',
        'prayer-facilities',
      ];
      features.forEach(feature => {
        pages.push({
          slug: `features/${feature}`,
          pageType: 'feature',
          filters: { feature },
        });
      });

      // Generate pages in batches
      const batchSize = 10;
      for (let i = 0; i < pages.length; i += batchSize) {
        const batch = pages.slice(i, i + batchSize);

        await Promise.all(
          batch.map(({ slug, pageType, filters }) =>
            this.generateAndStorePage(slug, pageType, filters)
          )
        );

        console.log(
          `Generated SEO pages ${i + 1}-${Math.min(i + batchSize, pages.length)} of ${pages.length}`
        );

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Successfully generated ${pages.length} SEO pages`);
    } catch (error) {
      console.error('Error generating SEO pages:', error);
    }
  }
}
