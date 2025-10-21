import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { SEOPage } from '@/types/import';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private static readonly BASE_URL = 'https://halal-sg-connect.netlify.app';

  // Generate complete sitemap
  static async generateSitemap(): Promise<string> {
    try {
      const urls: SitemapUrl[] = [];

      // Add static pages
      urls.push(...this.getStaticPages());

      // Add business listings
      const businessUrls = await this.getBusinessUrls();
      urls.push(...businessUrls);

      // Add SEO pages
      const seoUrls = await this.getSEOPageUrls();
      urls.push(...seoUrls);

      // Add category and location pages
      const dynamicUrls = await this.getDynamicPageUrls();
      urls.push(...dynamicUrls);

      return this.generateXMLSitemap(urls);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  }

  // Get static page URLs
  private static getStaticPages(): SitemapUrl[] {
    const now = new Date().toISOString();

    return [
      {
        loc: this.BASE_URL,
        lastmod: now,
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${this.BASE_URL}/listings`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${this.BASE_URL}/auth`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.5,
      },
      {
        loc: `${this.BASE_URL}/dashboard`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        loc: `${this.BASE_URL}/districts`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/property-zones`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/best`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9,
      },
      // Best Of curated lists
      {
        loc: `${this.BASE_URL}/best/best-halal-restaurants-singapore`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${this.BASE_URL}/best/top-halal-cafes-orchard`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/best/family-friendly-halal-dining-tampines`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/best/budget-halal-food-singapore`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/best/premium-halal-dining-singapore`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        loc: `${this.BASE_URL}/best/trending-halal-restaurants`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.8,
      },
      {
        loc: `${this.BASE_URL}/best/best-halal-food-delivery`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        loc: `${this.BASE_URL}/best/halal-restaurants-prayer-facilities`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7,
      },
      {
        loc: `${this.BASE_URL}/pricing`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.6,
      },
      {
        loc: `${this.BASE_URL}/contact`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.5,
      },
    ];
  }

  // Get business listing URLs
  private static async getBusinessUrls(): Promise<SitemapUrl[]> {
    try {
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('slug, updated_at, verification_status')
        .eq('verification_status', 'verified')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses for sitemap:', error);
        return [];
      }

      return (businesses || []).map(business => ({
        loc: `${this.BASE_URL}/listing/${business.slug}`,
        lastmod: business.updated_at,
        changefreq: 'weekly' as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error('Error generating business URLs:', error);
      return [];
    }
  }

  // Get SEO page URLs
  private static async getSEOPageUrls(): Promise<SitemapUrl[]> {
    try {
      const { data: seoPages, error } = await supabase
        .from('seo_pages')
        .select('slug, updated_at, page_type, view_count')
        .eq('is_published', true)
        .order('view_count', { ascending: false });

      if (error) {
        console.error('Error fetching SEO pages for sitemap:', error);
        return [];
      }

      return (seoPages || []).map(page => ({
        loc: `${this.BASE_URL}/${page.slug}`,
        lastmod: page.updated_at,
        changefreq: this.getChangefreqForPageType(page.page_type),
        priority: this.getPriorityForSEOPage(page.page_type, page.view_count),
      }));
    } catch (error) {
      console.error('Error generating SEO URLs:', error);
      return [];
    }
  }

  // Get dynamic page URLs (categories, districts, features)
  private static async getDynamicPageUrls(): Promise<SitemapUrl[]> {
    try {
      const urls: SitemapUrl[] = [];
      const now = new Date().toISOString();

      // Get categories
      const { data: categories } = await supabase
        .from('categories')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (categories) {
        categories.forEach(category => {
          urls.push({
            loc: `${this.BASE_URL}/category/${category.slug}`,
            lastmod: category.updated_at || now,
            changefreq: 'weekly',
            priority: 0.7,
          });
        });
      }

      // Get districts
      const { data: districts } = await supabase
        .from('districts')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (districts) {
        districts.forEach(district => {
          urls.push({
            loc: `${this.BASE_URL}/${district.slug}`,
            lastmod: district.updated_at || now,
            changefreq: 'weekly',
            priority: 0.7,
          });
        });
      }

      // Add feature pages
      const features = [
        'halal-certified',
        'delivery-available',
        'family-friendly',
        'prayer-facilities',
      ];
      features.forEach(feature => {
        urls.push({
          loc: `${this.BASE_URL}/features/${feature}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: 0.6,
        });
      });

      // Add price range pages
      const priceRanges = ['budget', 'mid-range', 'premium'];
      priceRanges.forEach(range => {
        urls.push({
          loc: `${this.BASE_URL}/price/${range}`,
          lastmod: now,
          changefreq: 'weekly',
          priority: 0.6,
        });
      });

      return urls;
    } catch (error) {
      console.error('Error generating dynamic URLs:', error);
      return [];
    }
  }

  // Get changefreq based on page type
  private static getChangefreqForPageType(
    pageType: string
  ): SitemapUrl['changefreq'] {
    switch (pageType) {
      case 'category':
      case 'location':
        return 'weekly';
      case 'combination':
        return 'weekly';
      case 'feature':
      case 'price':
        return 'monthly';
      default:
        return 'weekly';
    }
  }

  // Get priority based on page type and view count
  private static getPriorityForSEOPage(
    pageType: string,
    viewCount: number
  ): number {
    let basePriority = 0.6;

    switch (pageType) {
      case 'category':
        basePriority = 0.8;
        break;
      case 'location':
        basePriority = 0.7;
        break;
      case 'combination':
        basePriority = 0.75;
        break;
      case 'feature':
      case 'price':
        basePriority = 0.6;
        break;
    }

    // Boost priority for high-traffic pages
    if (viewCount > 1000) {
      basePriority = Math.min(basePriority + 0.1, 1.0);
    } else if (viewCount > 100) {
      basePriority = Math.min(basePriority + 0.05, 1.0);
    }

    return Math.round(basePriority * 10) / 10; // Round to 1 decimal place
  }

  // Generate XML sitemap
  private static generateXMLSitemap(urls: SitemapUrl[]): string {
    const urlElements = urls
      .map(url => {
        let urlXml = `    <url>\n`;
        urlXml += `      <loc>${this.escapeXml(url.loc)}</loc>\n`;

        if (url.lastmod) {
          urlXml += `      <lastmod>${url.lastmod}</lastmod>\n`;
        }

        if (url.changefreq) {
          urlXml += `      <changefreq>${url.changefreq}</changefreq>\n`;
        }

        if (url.priority !== undefined) {
          urlXml += `      <priority>${url.priority}</priority>\n`;
        }

        urlXml += `    </url>`;
        return urlXml;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Escape XML special characters
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Generate robots.txt content
  static generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# SEO pages
Allow: /category/
Allow: /features/
Allow: /price/

# Business listings
Allow: /listing/
Allow: /listings

# Important pages
Allow: /auth
Allow: /dashboard

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Disallow private user areas
Disallow: /dashboard/listings/edit/
Disallow: /dashboard/settings

# Sitemap
Sitemap: ${this.BASE_URL}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
  }

  // Generate sitemap index for large sites
  static async generateSitemapIndex(): Promise<string> {
    const now = new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${this.BASE_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
  }

  // Generate and save sitemap files
  static async generateAndSaveSitemaps(): Promise<{
    sitemap: string;
    robotsTxt: string;
    sitemapIndex: string;
  }> {
    try {
      console.log('Generating sitemap...');
      const sitemap = await this.generateSitemap();

      console.log('Generating robots.txt...');
      const robotsTxt = this.generateRobotsTxt();

      console.log('Generating sitemap index...');
      const sitemapIndex = await this.generateSitemapIndex();

      return {
        sitemap,
        robotsTxt,
        sitemapIndex,
      };
    } catch (error) {
      console.error('Error generating sitemaps:', error);
      throw error;
    }
  }
}
