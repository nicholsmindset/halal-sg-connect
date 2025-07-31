import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { SitemapGenerator } from '../../src/lib/sitemap-generator';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { queryStringParameters } = event;
    const type = queryStringParameters?.type || 'sitemap';

    let content: string;
    let contentType: string;

    switch (type) {
      case 'sitemap':
        content = await SitemapGenerator.generateSitemap();
        contentType = 'application/xml';
        break;
      
      case 'robots':
        content = SitemapGenerator.generateRobotsTxt();
        contentType = 'text/plain';
        break;
      
      case 'sitemap-index':
        content = await SitemapGenerator.generateSitemapIndex();
        contentType = 'application/xml';
        break;
      
      default:
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid type parameter' }),
        };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex', // Don't index the generator endpoint
      },
      body: content,
    };
  } catch (error: any) {
    console.error('Error generating sitemap:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Failed to generate sitemap',
      }),
    };
  }
};