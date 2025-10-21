import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: Record<string, any>;
}

// Custom hook for managing SEO metadata
export const useSEO = (metadata: SEOMetadata) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;

      if (!tag) {
        tag = document.createElement('meta');
        if (property) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    // Description
    if (metadata.description) {
      updateMetaTag('description', metadata.description);
      updateMetaTag('og:description', metadata.description, true);
    }

    // Keywords
    if (metadata.keywords && metadata.keywords.length > 0) {
      updateMetaTag('keywords', metadata.keywords.join(', '));
    }

    // Open Graph
    if (metadata.title) {
      updateMetaTag('og:title', metadata.title, true);
    }

    if (metadata.ogImage) {
      updateMetaTag('og:image', metadata.ogImage, true);
    }

    if (metadata.ogType) {
      updateMetaTag('og:type', metadata.ogType, true);
    }

    // Canonical URL
    const updateCanonical = (href: string) => {
      let canonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;

      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }

      canonical.setAttribute('href', href);
    };

    if (metadata.canonical) {
      updateCanonical(metadata.canonical);
    } else {
      // Default canonical to current URL
      const currentUrl = `${window.location.origin}${location.pathname}`;
      updateCanonical(currentUrl);
    }

    // Robots meta tag
    if (metadata.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Structured data (JSON-LD)
    if (metadata.schema) {
      const updateSchema = (schema: Record<string, any>) => {
        // Remove existing schema
        const existingSchema = document.querySelector(
          'script[type="application/ld+json"]'
        );
        if (existingSchema) {
          existingSchema.remove();
        }

        // Add new schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      };

      updateSchema(metadata.schema);
    }

    // Cleanup function to reset meta tags when component unmounts
    return () => {
      // Optional: Reset to default values or remove custom meta tags
    };
  }, [metadata, location.pathname]);
};

// Predefined SEO configurations for common page types
export const SEOConfigs = {
  home: {
    title: 'Halal SG Connect - Find Halal Businesses in Singapore',
    description:
      'Discover authentic halal restaurants, cafes, and businesses in Singapore. Browse verified halal-certified establishments with reviews, ratings, and detailed information.',
    keywords: [
      'halal',
      'singapore',
      'restaurants',
      'cafes',
      'MUIS certified',
      'muslim food',
      'directory',
    ],
    ogType: 'website',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Halal SG Connect',
      url: 'https://halal-sg-connect.netlify.app',
      description: "Singapore's comprehensive halal business directory",
      potentialAction: {
        '@type': 'SearchAction',
        target:
          'https://halal-sg-connect.netlify.app/listings?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  },

  listings: {
    title: 'Halal Business Listings - Singapore Directory | Halal SG Connect',
    description:
      'Browse hundreds of verified halal businesses in Singapore. Find restaurants, cafes, shops, and services with MUIS certification, customer reviews, and contact details.',
    keywords: [
      'halal listings',
      'singapore businesses',
      'halal directory',
      'MUIS certified',
      'halal restaurants',
    ],
    ogType: 'website',
  },

  business: (businessName: string, description: string) => ({
    title: `${businessName} - Halal Business in Singapore | Halal SG Connect`,
    description:
      description ||
      `Discover ${businessName}, a verified halal business in Singapore. Get contact details, reviews, ratings, and more information.`,
    keywords: [
      'halal',
      businessName.toLowerCase(),
      'singapore',
      'MUIS certified',
      'reviews',
    ],
    ogType: 'place',
  }),

  auth: {
    title: 'Login & Register - Halal SG Connect',
    description:
      'Sign in to your Halal SG Connect account or create a new account to list your halal business, write reviews, and access premium features.',
    keywords: ['login', 'register', 'account', 'halal business owner'],
    noindex: true, // Don't index auth pages
  },

  dashboard: {
    title: 'Dashboard - Manage Your Halal Business | Halal SG Connect',
    description:
      'Manage your halal business listing, view analytics, respond to reviews, and access business tools on Halal SG Connect.',
    keywords: ['dashboard', 'business management', 'halal business owner'],
    noindex: true, // Don't index private dashboard
  },

  category: (categoryName: string, businessCount: number) => ({
    title: `Best Halal ${categoryName} in Singapore | ${businessCount}+ Verified Options`,
    description: `Discover ${businessCount}+ halal-certified ${categoryName.toLowerCase()} in Singapore. Find authentic cuisine, read reviews, and get contact details for MUIS-certified establishments.`,
    keywords: [
      'halal',
      categoryName.toLowerCase(),
      'singapore',
      'MUIS certified',
      'restaurants',
      'directory',
    ],
    ogType: 'website',
  }),

  location: (locationName: string, businessCount: number) => ({
    title: `${businessCount}+ Halal Businesses in ${locationName} | Singapore Directory`,
    description: `Find ${businessCount}+ halal businesses in ${locationName}, Singapore. Restaurants, cafes, shops, and services with verified halal certification.`,
    keywords: [
      'halal',
      locationName.toLowerCase(),
      'singapore',
      'businesses',
      'directory',
    ],
    ogType: 'website',
  }),
};
