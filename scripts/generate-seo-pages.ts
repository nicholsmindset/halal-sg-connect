/**
 * 🚀 BATCH SEO PAGE GENERATION SCRIPT
 *
 * Generates all high-priority programmatic SEO pages for Halal SG Connect
 * Run this after database migration to populate SEO content
 *
 * Usage:
 *   npm run generate:seo
 *   npm run generate:seo -- --priority=high
 *   npm run generate:seo -- --type=districts
 *   npm run generate:seo -- --limit=100
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Priority levels for page generation
const PRIORITIES = {
  CRITICAL: ['d01', 'd07', 'd08', 'd09', 'd18', 'd19', 'd20', 'd22', 'd25'], // Top property districts
  HIGH: ['tampines', 'jurong-east', 'bedok', 'orchard', 'woodlands', 'hougang', 'punggol', 'sengkang', 'ang-mo-kio', 'bishan'],
  MEDIUM: [], // Will be auto-populated
  LOW: [] // Will be auto-populated
};

const TOP_CATEGORIES = [
  'restaurants',
  'cafes',
  'fast-food',
  'bakery',
  'groceries',
  'catering',
  'takeaway',
  'buffet',
  'seafood',
  'western'
];

interface GenerationStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: Array<{ slug: string; error: string }>;
}

class SEOPageBatchGenerator {
  private stats: GenerationStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warn: '⚠️'
    };
    console.log(`${icons[type]} ${message}`);
  }

  /**
   * Generate planning area pages (55 total)
   */
  async generatePlanningAreaPages(): Promise<void> {
    this.log('Generating planning area pages...', 'info');

    const { data: districts, error } = await supabase
      .from('districts')
      .select('*')
      .order('name');

    if (error) {
      this.log(`Failed to fetch districts: ${error.message}`, 'error');
      return;
    }

    this.log(`Found ${districts?.length || 0} planning areas`, 'info');

    for (const district of districts || []) {
      const slug = `district/${district.slug}`;
      await this.generatePage(slug, 'district', {
        planning_area: district.slug
      });
      await this.delay(100); // Rate limiting
    }
  }

  /**
   * Generate property district pages (28 total: D01-D28)
   */
  async generatePropertyDistrictPages(): Promise<void> {
    this.log('Generating property district pages...', 'info');

    const { data: propertyDistricts, error } = await supabase
      .from('property_districts')
      .select('*')
      .order('code');

    if (error) {
      this.log(`Failed to fetch property districts: ${error.message}`, 'error');
      return;
    }

    this.log(`Found ${propertyDistricts?.length || 0} property districts`, 'info');

    for (const district of propertyDistricts || []) {
      const slug = `property-zone/${district.code.toLowerCase()}`;
      await this.generatePage(slug, 'property_zone', {
        property_district_code: district.code
      });
      await this.delay(100);
    }
  }

  /**
   * Generate category pages (15 total)
   */
  async generateCategoryPages(): Promise<void> {
    this.log('Generating category pages...', 'info');

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      this.log(`Failed to fetch categories: ${error.message}`, 'error');
      return;
    }

    this.log(`Found ${categories?.length || 0} categories`, 'info');

    for (const category of categories || []) {
      const slug = `category/${category.slug}`;
      await this.generatePage(slug, 'category', {
        category: category.slug
      });
      await this.delay(100);
    }
  }

  /**
   * Generate high-priority combination pages
   * (Top districts × Top categories)
   */
  async generateHighPriorityCombinations(): Promise<void> {
    this.log('Generating high-priority combinations...', 'info');

    const priorityDistricts = [...PRIORITIES.CRITICAL, ...PRIORITIES.HIGH];

    this.log(`Generating for ${priorityDistricts.length} priority areas × ${TOP_CATEGORIES.length} categories`, 'info');

    // Property district + category combinations
    for (const districtCode of PRIORITIES.CRITICAL) {
      for (const category of TOP_CATEGORIES) {
        const slug = `property-zone/${districtCode}/${category}`;
        await this.generatePage(slug, 'property_zone_category', {
          property_district_code: districtCode.toUpperCase(),
          category
        });
        await this.delay(100);
      }
    }

    // Planning area + category combinations
    for (const planningArea of PRIORITIES.HIGH) {
      for (const category of TOP_CATEGORIES) {
        const slug = `district/${planningArea}/${category}`;
        await this.generatePage(slug, 'district_category', {
          planning_area: planningArea,
          category
        });
        await this.delay(100);
      }
    }
  }

  /**
   * Generate feature-based pages
   */
  async generateFeaturePages(): Promise<void> {
    this.log('Generating feature pages...', 'info');

    const features = [
      'halal-certified',
      'delivery-available',
      'family-friendly',
      'prayer-facilities',
      'parking-available',
      'wheelchair-accessible',
      'outdoor-seating',
      'takeaway-only'
    ];

    for (const feature of features) {
      const slug = `features/${feature}`;
      await this.generatePage(slug, 'feature', { feature });
      await this.delay(100);
    }
  }

  /**
   * Generate price range pages
   */
  async generatePricePages(): Promise<void> {
    this.log('Generating price range pages...', 'info');

    const priceRanges = ['budget', 'mid-range', 'premium', 'luxury'];

    for (const range of priceRanges) {
      const slug = `price/${range}`;
      await this.generatePage(slug, 'price', { price_range: range });
      await this.delay(100);
    }
  }

  /**
   * Generate a single SEO page
   */
  private async generatePage(
    slug: string,
    pageType: string,
    filters: Record<string, string>
  ): Promise<void> {
    this.stats.total++;

    try {
      // Check if page already exists
      const { data: existing } = await supabase
        .from('seo_pages')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        this.log(`Skipping existing: ${slug}`, 'warn');
        this.stats.skipped++;
        return;
      }

      // Generate page content via function (you'll need to create this)
      // For now, we'll create a basic structure
      const content = await this.generatePageContent(pageType, filters);

      if (!content) {
        this.log(`No content generated for: ${slug}`, 'warn');
        this.stats.failed++;
        return;
      }

      // Insert into database
      const { error } = await supabase
        .from('seo_pages')
        .insert({
          slug,
          page_type: pageType,
          title: content.title,
          meta_description: content.metaDescription,
          h1_title: content.h1Title,
          content: content.content,
          filters,
          business_count: content.businessCount,
          view_count: 0,
          last_content_update: new Date().toISOString(),
          is_published: true,
          canonical_url: `https://halal-sg-connect.netlify.app/${slug}`,
          schema_markup: content.schemaMarkup,
          related_pages: content.relatedPages
        });

      if (error) {
        this.log(`Failed to create ${slug}: ${error.message}`, 'error');
        this.stats.failed++;
        this.stats.errors.push({ slug, error: error.message });
        return;
      }

      this.log(`Created: ${slug}`, 'success');
      this.stats.successful++;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.log(`Error generating ${slug}: ${errorMsg}`, 'error');
      this.stats.failed++;
      this.stats.errors.push({ slug, error: errorMsg });
    }
  }

  /**
   * Generate page content (simplified version)
   */
  private async generatePageContent(
    pageType: string,
    filters: Record<string, string>
  ): Promise<any> {
    // Get business count for this filter
    let query = supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('verification_status', 'verified');

    if (filters.category) {
      query = query.contains('category_slugs', [filters.category]);
    }
    if (filters.planning_area) {
      query = query.eq('planning_area', filters.planning_area.replace('-', ' '));
    }
    if (filters.property_district_code) {
      query = query.eq('property_district_code', filters.property_district_code);
    }
    if (filters.feature) {
      query = query.contains('features', [filters.feature]);
    }

    const { count } = await query;
    const businessCount = count || 0;

    // Generate SEO metadata based on page type
    const metadata = this.generateMetadata(pageType, filters, businessCount);

    return {
      ...metadata,
      businessCount,
      content: {
        intro_text: metadata.metaDescription,
        highlights: [],
        local_info: undefined,
        business_stats: {
          total_count: businessCount,
          avg_rating: 4.5,
          price_distribution: {},
          popular_cuisines: [],
          top_features: []
        },
        faqs: [],
        related_searches: []
      },
      schemaMarkup: {},
      relatedPages: []
    };
  }

  /**
   * Generate SEO metadata based on page type
   */
  private generateMetadata(
    pageType: string,
    filters: Record<string, string>,
    businessCount: number
  ) {
    const templates: Record<string, any> = {
      district: {
        title: `${businessCount}+ Halal Restaurants in ${this.formatName(filters.planning_area)} | Singapore`,
        metaDescription: `Discover ${businessCount}+ halal restaurants in ${this.formatName(filters.planning_area)}. Verified MUIS-certified establishments with reviews and ratings.`,
        h1Title: `Halal Restaurants in ${this.formatName(filters.planning_area)}`
      },
      property_zone: {
        title: `${filters.property_district_code} Singapore - ${businessCount}+ Halal Restaurants & Cafes`,
        metaDescription: `Find ${businessCount}+ halal dining options in ${filters.property_district_code} property district. Business lunch, family dining, and Muslim-friendly services.`,
        h1Title: `${filters.property_district_code} Halal Dining Guide`
      },
      category: {
        title: `Best Halal ${this.formatName(filters.category)} in Singapore | ${businessCount}+ Options`,
        metaDescription: `Explore ${businessCount}+ halal ${this.formatName(filters.category)} in Singapore. MUIS-certified, reviewed, and verified establishments.`,
        h1Title: `Halal ${this.formatName(filters.category)} in Singapore`
      },
      district_category: {
        title: `${businessCount}+ Halal ${this.formatName(filters.category)} in ${this.formatName(filters.planning_area)}`,
        metaDescription: `Top halal ${this.formatName(filters.category)} in ${this.formatName(filters.planning_area)}. Verified establishments with reviews and ratings.`,
        h1Title: `Halal ${this.formatName(filters.category)} in ${this.formatName(filters.planning_area)}`
      },
      property_zone_category: {
        title: `${filters.property_district_code} - ${businessCount}+ Halal ${this.formatName(filters.category)}`,
        metaDescription: `Find halal ${this.formatName(filters.category)} in ${filters.property_district_code} district. MUIS-certified options with reviews.`,
        h1Title: `${filters.property_district_code} Halal ${this.formatName(filters.category)}`
      },
      feature: {
        title: `${businessCount}+ Halal Restaurants with ${this.formatName(filters.feature)} | Singapore`,
        metaDescription: `Discover halal restaurants offering ${this.formatName(filters.feature)} in Singapore. Verified establishments.`,
        h1Title: `Halal Restaurants with ${this.formatName(filters.feature)}`
      },
      price: {
        title: `${businessCount}+ ${this.formatName(filters.price_range)} Halal Dining in Singapore`,
        metaDescription: `Explore ${this.formatName(filters.price_range)} halal restaurants in Singapore. Quality dining for every budget.`,
        h1Title: `${this.formatName(filters.price_range)} Halal Dining`
      }
    };

    return templates[pageType] || {
      title: `Halal Restaurants in Singapore | ${businessCount}+ Options`,
      metaDescription: `Find halal restaurants in Singapore with verified MUIS certification.`,
      h1Title: `Halal Restaurants`
    };
  }

  /**
   * Format slug to readable name
   */
  private formatName(slug: string | undefined): string {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Print generation statistics
   */
  printStats(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEO PAGE GENERATION STATISTICS');
    console.log('='.repeat(60));
    console.log(`Total Attempted:  ${this.stats.total}`);
    console.log(`✅ Successful:     ${this.stats.successful}`);
    console.log(`⚠️  Skipped:        ${this.stats.skipped}`);
    console.log(`❌ Failed:         ${this.stats.failed}`);
    console.log('='.repeat(60));

    if (this.stats.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.stats.errors.forEach(err => {
        console.log(`  - ${err.slug}: ${err.error}`);
      });
    }

    console.log('\n✨ Generation complete!\n');
  }

  /**
   * Run full generation based on options
   */
  async runGeneration(options: {
    priority?: 'all' | 'high' | 'critical';
    type?: 'all' | 'districts' | 'property-zones' | 'categories' | 'combinations';
    limit?: number;
  } = {}): Promise<void> {
    const startTime = Date.now();
    this.log('🚀 Starting SEO page generation...', 'info');
    this.log(`Options: ${JSON.stringify(options)}`, 'info');

    try {
      const { type = 'all', priority = 'all' } = options;

      if (type === 'all' || type === 'districts') {
        await this.generatePlanningAreaPages();
      }

      if (type === 'all' || type === 'property-zones') {
        await this.generatePropertyDistrictPages();
      }

      if (type === 'all' || type === 'categories') {
        await this.generateCategoryPages();
        await this.generateFeaturePages();
        await this.generatePricePages();
      }

      if (type === 'all' || type === 'combinations') {
        if (priority === 'high' || priority === 'all') {
          await this.generateHighPriorityCombinations();
        }
      }

    } catch (error) {
      this.log(`Fatal error: ${error}`, 'error');
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    this.log(`⏱️  Total time: ${duration}s`, 'info');

    this.printStats();
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options: any = {
    priority: 'all',
    type: 'all'
  };

  // Parse command line arguments
  args.forEach(arg => {
    if (arg.startsWith('--priority=')) {
      options.priority = arg.split('=')[1];
    }
    if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1];
    }
    if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1]);
    }
  });

  const generator = new SEOPageBatchGenerator();
  await generator.runGeneration(options);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { SEOPageBatchGenerator };
