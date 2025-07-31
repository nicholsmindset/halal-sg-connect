// 🏢 DISTRICT-SPECIFIC SEO CONTENT GENERATOR
// Generates dynamic content for all Singapore districts and property zones

export interface DistrictData {
  name: string;
  slug: string;
  planningArea?: string;
  propertyDistrict?: string;
  description: string;
  areaType: 'business' | 'residential' | 'cultural' | 'tourist' | 'mixed' | 'industrial' | 'nature' | 'developing';
  halalDiningDensity: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  keyFeatures: string[];
  muslimServices: string[];
  targetDemographics: string[];
  transportLinks: string[];
  nearbyMosques?: string[];
  businessCount?: number;
}

export interface PropertyDistrictData {
  code: string;
  name: string;
  slug: string;
  areas: string[];
  districtType: 'business' | 'residential' | 'cultural' | 'tourist' | 'mixed' | 'industrial' | 'nature' | 'developing';
  businessDensity: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  halalDiningDensity: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  targetDemographics: string[];
  keyFeatures: string[];
  muslimServices: string[];
}

// 🎯 CONTENT TEMPLATES BY AREA TYPE

const AREA_TYPE_TEMPLATES = {
  business: {
    heroTitle: (name: string) => `Premium Halal Dining in ${name} Business District`,
    heroSubtitle: (name: string) => `Professional halal restaurants, business lunch spots, and corporate catering in Singapore's ${name} area`,
    contentIntro: (data: DistrictData) => `
      ${data.name} stands as one of Singapore's premier business districts, offering sophisticated halal dining options 
      for professionals, business travelers, and corporate events. From quick lunch spots to premium business dining, 
      this area caters to the discerning Muslim professional community.
    `,
    seoTitle: (name: string) => `Best Halal Restaurants in ${name} Singapore - Business Dining Guide`,
    seoDescription: (name: string) => `Discover premium halal restaurants in ${name} business district. Professional dining, corporate catering, and business lunch spots with Muslim-friendly services.`
  },
  
  residential: {
    heroTitle: (name: string) => `Family-Friendly Halal Restaurants in ${name}`,
    heroSubtitle: (name: string) => `Discover neighborhood halal dining, family restaurants, and community favorites in ${name}`,
    contentIntro: (data: DistrictData) => `
      ${data.name} is a thriving residential community known for its family-friendly atmosphere and diverse halal food scene. 
      From traditional coffee shops to modern family restaurants, this neighborhood offers authentic flavors and 
      warm hospitality for Muslim families and food enthusiasts.
    `,
    seoTitle: (name: string) => `Family Halal Restaurants in ${name} Singapore - Neighborhood Dining`,
    seoDescription: (name: string) => `Family-friendly halal dining in ${name}. Local favorites, neighborhood restaurants, and community halal food perfect for Muslim families.`
  },
  
  cultural: {
    heroTitle: (name: string) => `Authentic Cultural Halal Cuisine in ${name}`,
    heroSubtitle: (name: string) => `Experience traditional halal flavors and cultural dining in Singapore's heritage ${name} district`,
    contentIntro: (data: DistrictData) => `
      ${data.name} preserves Singapore's rich cultural heritage while offering some of the most authentic halal cuisine in the city. 
      This cultural district celebrates traditional recipes, time-honored cooking methods, and the vibrant flavors that define 
      Singapore's Muslim culinary landscape.
    `,
    seoTitle: (name: string) => `Traditional Halal Food in ${name} Singapore - Cultural Heritage Dining`,
    seoDescription: (name: string) => `Authentic traditional halal cuisine in ${name} cultural district. Heritage recipes, cultural dining experiences, and Islamic culinary traditions.`
  },
  
  tourist: {
    heroTitle: (name: string) => `Tourist-Friendly Halal Dining in ${name}`,
    heroSubtitle: (name: string) => `International halal cuisine and visitor-friendly Muslim dining experiences in ${name}`,
    contentIntro: (data: DistrictData) => `
      ${data.name} welcomes Muslim travelers from around the world with its diverse international halal dining scene. 
      From luxury hotel restaurants to accessible tourist-friendly eateries, this district ensures every Muslim visitor 
      can enjoy Singapore's renowned food culture with confidence.
    `,
    seoTitle: (name: string) => `Tourist Halal Restaurants in ${name} Singapore - Visitor Guide`,
    seoDescription: (name: string) => `Muslim-friendly restaurants for tourists in ${name}. International halal cuisine, visitor services, and travel-friendly dining options.`
  },
  
  mixed: {
    heroTitle: (name: string) => `Diverse Halal Dining Scene in ${name}`,
    heroSubtitle: (name: string) => `From casual meals to fine dining - explore the complete halal food landscape in ${name}`,
    contentIntro: (data: DistrictData) => `
      ${data.name} offers the best of all worlds with its diverse mix of residential charm, business convenience, and 
      cultural richness. This dynamic area features an equally diverse halal dining scene that caters to every taste, 
      budget, and occasion within the Muslim community.
    `,
    seoTitle: (name: string) => `Complete Halal Dining Guide for ${name} Singapore`,
    seoDescription: (name: string) => `Comprehensive halal restaurant guide for ${name}. Diverse Muslim dining options from casual to fine dining in Singapore.`
  },
  
  industrial: {
    heroTitle: (name: string) => `Worker-Friendly Halal Food in ${name}`,
    heroSubtitle: (name: string) => `Affordable halal meals and practical dining options for the working community in ${name}`,
    contentIntro: (data: DistrictData) => `
      ${data.name} serves Singapore's hardworking industrial community with practical, affordable halal dining options. 
      From hearty worker meals to convenient takeaway options, this area ensures Muslim workers have access to 
      satisfying and budget-friendly halal food throughout their workday.
    `,
    seoTitle: (name: string) => `Affordable Halal Food for Workers in ${name} Singapore`,
    seoDescription: (name: string) => `Budget-friendly halal restaurants in ${name} industrial area. Worker meals, affordable dining, and practical Muslim food options.`
  },
  
  nature: {
    heroTitle: (name: string) => `Nature-Area Halal Dining Near ${name}`,
    heroSubtitle: (name: string) => `Family-friendly halal restaurants for nature enthusiasts and outdoor activity lovers`,
    contentIntro: (data: DistrictData) => `
      ${data.name} combines Singapore's natural beauty with family-friendly halal dining experiences. Perfect for 
      Muslim families enjoying outdoor activities, nature walks, or weekend getaways, this area offers refreshing 
      dining options in a tranquil, nature-focused environment.
    `,
    seoTitle: (name: string) => `Nature Area Halal Restaurants Near ${name} Singapore`,
    seoDescription: (name: string) => `Family halal dining near ${name} nature areas. Outdoor-friendly restaurants, nature park dining, and family recreation meals.`
  },
  
  developing: {
    heroTitle: (name: string) => `Emerging Halal Scene in ${name} New Development`,
    heroSubtitle: (name: string) => `Modern halal dining options in Singapore's newest and most innovative community`,
    contentIntro: (data: DistrictData) => `
      ${data.name} represents the future of Singapore's urban development, featuring cutting-edge amenities and a 
      growing halal food scene. This modern community attracts forward-thinking Muslim families with its innovative 
      approach to sustainable living and contemporary dining experiences.
    `,
    seoTitle: (name: string) => `New Halal Restaurants in ${name} Singapore Development`,
    seoDescription: (name: string) => `Modern halal dining in ${name} new development. Contemporary restaurants, innovative cuisine, and future-focused Muslim community dining.`
  }
};

// 🏆 DINING DENSITY DESCRIPTIONS
const DINING_DENSITY_INFO = {
  very_high: {
    description: "exceptional variety of halal restaurants",
    businessCount: "50+ halal establishments",
    recommendation: "A halal food paradise with endless dining options"
  },
  high: {
    description: "abundant halal dining choices",  
    businessCount: "20-50 halal establishments",
    recommendation: "Great selection of quality halal restaurants"
  },
  medium: {
    description: "good selection of halal restaurants",
    businessCount: "10-20 halal establishments", 
    recommendation: "Solid halal dining options for residents and visitors"
  },
  low: {
    description: "limited but quality halal options",
    businessCount: "5-10 halal establishments",
    recommendation: "Carefully selected halal restaurants serving the community"
  },
  very_low: {
    description: "specialized halal dining",
    businessCount: "Under 5 halal establishments",
    recommendation: "Unique halal experiences for adventurous diners"
  }
};

// 🎨 GENERATE DISTRICT CONTENT
export function generateDistrictContent(data: DistrictData): {
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  contentSections: Array<{
    title: string;
    content: string;
  }>;
  keywords: string[];
} {
  const template = AREA_TYPE_TEMPLATES[data.areaType];
  const diningInfo = DINING_DENSITY_INFO[data.halalDiningDensity];
  
  return {
    heroTitle: template.heroTitle(data.name),
    heroSubtitle: template.heroSubtitle(data.name),
    seoTitle: template.seoTitle(data.name),
    seoDescription: template.seoDescription(data.name),
    
    contentSections: [
      {
        title: `About ${data.name}`,
        content: template.contentIntro(data).trim()
      },
      {
        title: "Halal Dining Landscape",
        content: `${data.name} features ${diningInfo.description} with approximately ${diningInfo.businessCount}. ${diningInfo.recommendation}. The area caters to ${data.targetDemographics.join(', ')}, offering diverse cuisine styles and price points to match every preference and budget.`
      },
      {
        title: "Key Features & Amenities",
        content: `What makes ${data.name} special: ${data.keyFeatures.join(', ')}. The area provides excellent accessibility ${data.transportLinks.length > 0 ? `via ${data.transportLinks.join(', ')}` : 'through public transportation'}, making it convenient for both locals and visitors to explore the halal dining scene.`
      },
      {
        title: "Muslim-Friendly Services",
        content: `${data.name} supports the Muslim community with ${data.muslimServices.join(', ')}. ${data.nearbyMosques && data.nearbyMosques.length > 0 ? `Nearby prayer facilities include ${data.nearbyMosques.join(', ')}.` : 'Prayer facilities are conveniently accessible in the surrounding areas.'} The area is well-equipped to serve Muslim residents, workers, and visitors with appropriate facilities and services.`
      },
      {
        title: "Dining Recommendations",
        content: `For the best halal dining experience in ${data.name}, we recommend exploring ${data.areaType === 'business' ? 'premium business lunch venues and corporate catering options' : data.areaType === 'residential' ? 'family-friendly neighborhood restaurants and local favorites' : data.areaType === 'cultural' ? 'traditional heritage eateries and authentic cultural cuisine' : data.areaType === 'tourist' ? 'international restaurants and visitor-friendly establishments' : 'the diverse range of dining options available'}. Peak dining hours vary by establishment type, so planning ahead is recommended for popular venues.`
      }
    ],
    
    keywords: [
      `${data.name.toLowerCase()} halal restaurants`,
      `${data.name.toLowerCase()} muslim dining`,
      `halal food ${data.name.toLowerCase()}`,
      `${data.areaType} halal dining singapore`,
      ...data.targetDemographics.map(demo => `${demo.toLowerCase()} halal food`),
      ...data.keyFeatures.map(feature => `${feature.toLowerCase()} halal restaurants`),
      `singapore ${data.name.toLowerCase()} halal guide`
    ]
  };
}

// 🏢 GENERATE PROPERTY DISTRICT CONTENT  
export function generatePropertyDistrictContent(data: PropertyDistrictData): {
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  contentSections: Array<{
    title: string;
    content: string;
  }>;
  keywords: string[];
} {
  const template = AREA_TYPE_TEMPLATES[data.districtType];
  const diningInfo = DINING_DENSITY_INFO[data.halalDiningDensity];
  const areasList = data.areas.join(', ');
  
  return {
    heroTitle: `${data.code} ${data.name} - Halal Restaurant Directory`,
    heroSubtitle: `Complete halal dining guide for Singapore's ${data.code} property district covering ${areasList}`,
    seoTitle: `${data.code} Halal Restaurants - ${data.name} Singapore Dining Guide`,
    seoDescription: `Comprehensive halal restaurant directory for ${data.code} ${data.name}. Covering ${data.areas.slice(0,2).join(' & ')} with Muslim-friendly dining options.`,
    
    contentSections: [
      {
        title: `${data.code} District Overview`,
        content: `${data.code} encompasses ${areasList}, representing one of Singapore's key ${data.districtType} districts. This area is characterized by ${data.businessDensity === 'very_high' ? 'intense commercial activity and premium establishments' : data.businessDensity === 'high' ? 'strong business presence and diverse amenities' : data.businessDensity === 'medium' ? 'balanced commercial and residential development' : 'primarily residential character with local businesses'}.`
      },
      {
        title: "Halal Dining Ecosystem",
        content: `The ${data.code} district offers ${diningInfo.description} across its ${data.areas.length} planning areas. With ${diningInfo.businessCount}, ${diningInfo.recommendation}. The district serves primarily ${data.targetDemographics.join(', ')}, ensuring diverse culinary offerings that match the community's needs and preferences.`
      },
      {
        title: "District Characteristics",
        content: `Key features of ${data.code} include: ${data.keyFeatures.join(', ')}. The district's ${data.districtType} nature creates an environment where halal restaurants can thrive alongside complementary businesses and services, creating a comprehensive lifestyle ecosystem for Muslim residents and visitors.`
      },
      {
        title: "Planning Areas Covered",
        content: `${data.code} spans multiple planning areas: ${data.areas.map(area => area).join(', ')}. Each area contributes unique characteristics to the overall district personality, from ${data.areas[0]}'s ${data.districtType === 'business' ? 'commercial focus' : data.districtType === 'residential' ? 'family orientation' : 'distinct character'} to the diverse offerings found throughout the district.`
      },
      {
        title: "Muslim Community Services",
        content: `${data.code} district provides comprehensive Muslim-friendly services including ${data.muslimServices.join(', ')}. The area's ${data.districtType} focus ensures that appropriate facilities and services are readily available to support the daily needs of Muslim residents, workers, and visitors throughout the district.`
      }
    ],
    
    keywords: [
      `${data.code.toLowerCase()} halal restaurants`,
      `${data.code.toLowerCase()} singapore muslim dining`,
      `property district ${data.code.toLowerCase()} halal food`,
      `${data.name.toLowerCase()} halal guide`,
      ...data.areas.map(area => `${area.toLowerCase()} halal restaurants`),
      ...data.targetDemographics.map(demo => `${demo.toLowerCase()} halal ${data.code.toLowerCase()}`),
      `singapore ${data.code.toLowerCase()} postal district halal`
    ]
  };
}

// 🔄 GENERATE CATEGORY + DISTRICT COMBINATIONS
export function generateCombinationContent(
  district: DistrictData, 
  category: { name: string; slug: string; description: string }
): {
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  contentSections: Array<{
    title: string;
    content: string;
  }>;
  keywords: string[];
} {
  return {
    heroTitle: `Best Halal ${category.name} in ${district.name}`,
    heroSubtitle: `Discover top-rated halal ${category.name.toLowerCase()} establishments in ${district.name}, Singapore`,
    seoTitle: `Halal ${category.name} in ${district.name} Singapore - Complete Guide`,
    seoDescription: `Find the best halal ${category.name.toLowerCase()} in ${district.name}. Reviews, locations, and Muslim-friendly ${category.name.toLowerCase()} options in Singapore.`,
    
    contentSections: [
      {
        title: `Halal ${category.name} Scene in ${district.name}`,
        content: `${district.name} offers an ${district.halalDiningDensity === 'very_high' ? 'exceptional' : district.halalDiningDensity === 'high' ? 'impressive' : 'noteworthy'} selection of halal ${category.name.toLowerCase()}. ${category.description} The area's ${district.areaType} character creates the perfect environment for ${category.name.toLowerCase()} that cater to ${district.targetDemographics.join(', ')}.`
      },
      {
        title: `Why Choose ${district.name} for Halal ${category.name}`,
        content: `${district.name} stands out for halal ${category.name.toLowerCase()} because of ${district.keyFeatures.slice(0,3).join(', ')}. The area provides ${district.muslimServices.includes('prayer facilities') ? 'convenient prayer facilities' : 'Muslim-friendly amenities'} and ${district.transportLinks.length > 0 ? 'excellent transportation access' : 'good connectivity'}, making it ideal for Muslim diners seeking quality ${category.name.toLowerCase()}.`
      },
      {
        title: `Local Recommendations`,
        content: `For the best halal ${category.name.toLowerCase()} experience in ${district.name}, consider visiting during ${district.areaType === 'business' ? 'lunch hours for business-friendly service or early evenings for a more relaxed atmosphere' : district.areaType === 'tourist' ? 'off-peak hours to avoid crowds, or peak times to experience the vibrant atmosphere' : 'weekends for family dining or weekdays for a quieter experience'}. The area's ${category.name.toLowerCase()} establishments typically offer ${district.areaType === 'business' ? 'professional service and convenient locations' : district.areaType === 'residential' ? 'family-friendly environments and community favorites' : 'unique experiences that reflect the local character'}.`
      }
    ],
    
    keywords: [
      `halal ${category.name.toLowerCase()} ${district.name.toLowerCase()}`,
      `${district.name.toLowerCase()} halal ${category.name.toLowerCase()}`,
      `best halal ${category.name.toLowerCase()} ${district.name.toLowerCase()}`,
      `muslim ${category.name.toLowerCase()} ${district.name.toLowerCase()}`,
      `${district.name.toLowerCase()} ${category.slug}`,
      `singapore halal ${category.name.toLowerCase()} ${district.name.toLowerCase()}`
    ]
  };
}

// 📍 LOCATION-BASED CONTENT UTILITIES
export const locationContentUtils = {
  // Generate mosque and prayer facility information
  getNearbyIslamicFacilities: (districtName: string) => {
    // This would be populated with actual mosque data
    const commonMosques = {
      'Central': ['Masjid Sultan', 'Hajjah Fatimah Mosque', 'Al-Abrar Mosque'],
      'East': ['Masjid Al-Islah', 'Masjid Kassim', 'Masjid Al-Ansar'],
      'West': ['Masjid Al-Muttaqin', 'Masjid An-Nahdhah', 'Masjid Al-Istiqamah'],
      'North': ['Masjid Al-Islah Woodlands', 'Masjid Assyafaah', 'Masjid Al-Muhajirin'],
      'Northeast': ['Masjid Al-Mukminin', 'Masjid Petempatan Melayu Sembawang', 'Masjid Alwisam']
    };
    
    // Return relevant mosques based on district location
    return commonMosques['Central'] || [];
  },
  
  // Generate transport connectivity information
  getTransportLinks: (districtName: string) => {
    // This would be populated with actual MRT/transport data
    return ['MRT stations', 'bus services', 'taxi access'];
  },
  
  // Generate area-specific features
  getAreaFeatures: (areaType: string) => {
    const features = {
      business: ['Modern office buildings', 'Conference facilities', 'Premium shopping'],
      residential: ['Family amenities', 'Community centers', 'Local markets'],
      cultural: ['Heritage sites', 'Traditional architecture', 'Cultural events'],
      tourist: ['Tourist attractions', 'International hotels', 'Shopping districts'],
      mixed: ['Diverse amenities', 'Convenient access', 'Varied dining options'],
      industrial: ['Worker facilities', 'Practical amenities', 'Transport hubs'],
      nature: ['Parks and green spaces', 'Outdoor activities', 'Fresh air environment'],
      developing: ['Modern facilities', 'Smart technologies', 'Sustainable features']
    };
    
    return features[areaType] || ['Local amenities', 'Community facilities', 'Convenient access'];
  }
};