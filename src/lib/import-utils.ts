import {
  BusinessImportData,
  businessImportSchema,
  csvHeaderMapping,
  ImportValidationResult,
  GeocodeResult,
} from '@/types/import';
import { Business } from '@/types/business';
import Papa from 'papaparse';

// CSV Parsing Utilities
export class CSVImportParser {
  static parseCSV(file: File): Promise<{ data: any[]; headers: string[] }> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) =>
          header.trim().toLowerCase().replace(/\s+/g, '_'),
        complete: results => {
          if (results.errors.length > 0) {
            reject(
              new Error(`CSV parsing error: ${results.errors[0].message}`)
            );
            return;
          }

          const headers = results.meta.fields || [];
          resolve({
            data: results.data as any[],
            headers,
          });
        },
        error: error => {
          reject(error);
        },
      });
    });
  }

  static mapCSVHeaders(csvHeaders: string[]): Record<string, string> {
    const mapping: Record<string, string> = {};

    // Auto-map headers based on predefined mappings
    for (const [standardField, possibleHeaders] of Object.entries(
      csvHeaderMapping
    )) {
      for (const csvHeader of csvHeaders) {
        const normalizedHeader = csvHeader.toLowerCase().replace(/\s+/g, '_');
        if (possibleHeaders.includes(normalizedHeader)) {
          mapping[csvHeader] = standardField;
          break;
        }
      }
    }

    return mapping;
  }

  static transformCSVRow(
    row: any,
    headerMapping: Record<string, string>
  ): Partial<BusinessImportData> {
    const transformed: any = {};

    for (const [csvHeader, value] of Object.entries(row)) {
      const standardField = headerMapping[csvHeader];
      if (
        standardField &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        // Handle array fields
        if (
          [
            'features',
            'tags',
            'cuisine_types',
            'amenities',
            'special_diets',
            'payment_methods',
            'delivery_platforms',
          ].includes(standardField)
        ) {
          transformed[standardField] =
            typeof value === 'string'
              ? value
                  .split(',')
                  .map((item: string) => item.trim())
                  .filter(Boolean)
              : value;
        }
        // Handle boolean fields
        else if (['halal_certified'].includes(standardField)) {
          transformed[standardField] = this.parseBoolean(value);
        }
        // Handle number fields
        else if (
          ['rating', 'review_count', 'price_level'].includes(standardField)
        ) {
          const num = Number(value);
          if (!isNaN(num)) {
            transformed[standardField] = num;
          }
        }
        // Handle coordinates
        else if (standardField === 'coordinates') {
          const coords = this.parseCoordinates(value);
          if (coords) {
            transformed[standardField] = coords;
          }
        }
        // Handle opening hours
        else if (standardField === 'opening_hours') {
          const hours = this.parseOpeningHours(value);
          if (hours) {
            transformed[standardField] = hours;
          }
        }
        // Handle regular string fields
        else {
          transformed[standardField] = String(value).trim();
        }
      }
    }

    return transformed;
  }

  private static parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return ['true', 'yes', '1', 'y', 'certified', 'halal'].includes(lower);
    }
    return Boolean(value);
  }

  private static parseCoordinates(
    value: any
  ): { lat: number; lng: number } | null {
    if (typeof value !== 'string') return null;

    // Try different coordinate formats
    const formats = [
      /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/, // "1.234, 103.567"
      /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/, // "1.234 103.567"
      /^\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)$/, // "(1.234, 103.567)"
    ];

    for (const format of formats) {
      const match = value.match(format);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);

        // Validate Singapore bounds
        if (lat >= 1.0 && lat <= 1.5 && lng >= 103.0 && lng <= 104.5) {
          return { lat, lng };
        }
      }
    }

    return null;
  }

  private static parseOpeningHours(
    value: any
  ): Record<string, { open: string; close: string; closed?: boolean }> | null {
    if (typeof value !== 'string') return null;

    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) {
      // If not JSON, try parsing simple format like "Mon-Sun: 10:00-22:00"
      const simpleMatch = value.match(
        /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/
      );
      if (simpleMatch) {
        const openTime = `${simpleMatch[1].padStart(2, '0')}:${simpleMatch[2]}`;
        const closeTime = `${simpleMatch[3].padStart(2, '0')}:${simpleMatch[4]}`;

        return {
          monday: { open: openTime, close: closeTime },
          tuesday: { open: openTime, close: closeTime },
          wednesday: { open: openTime, close: closeTime },
          thursday: { open: openTime, close: closeTime },
          friday: { open: openTime, close: closeTime },
          saturday: { open: openTime, close: closeTime },
          sunday: { open: openTime, close: closeTime },
        };
      }
    }

    return null;
  }
}

// Data Validation
export class ImportValidator {
  static validateBusinessData(
    data: any,
    rowNumber: number
  ): ImportValidationResult {
    try {
      const validatedData = businessImportSchema.parse(data);

      const warnings: string[] = [];

      // Add warnings for missing optional but important fields
      if (!validatedData.description) {
        warnings.push('Missing business description');
      }
      if (!validatedData.phone && !validatedData.email) {
        warnings.push('No contact information provided');
      }
      if (!validatedData.halal_certified) {
        warnings.push('Halal certification status not confirmed');
      }

      return {
        valid: true,
        errors: [],
        warnings,
        data: validatedData,
        row_number: rowNumber,
      };
    } catch (error: any) {
      const errors: string[] = [];

      if (error.errors) {
        for (const err of error.errors) {
          errors.push(`${err.path.join('.')}: ${err.message}`);
        }
      } else {
        errors.push(error.message);
      }

      return {
        valid: false,
        errors,
        warnings: [],
        row_number: rowNumber,
      };
    }
  }

  static validateBatch(dataArray: any[]): ImportValidationResult[] {
    return dataArray.map((data, index) =>
      this.validateBusinessData(data, index + 1)
    );
  }
}

// Duplicate Detection
export class DuplicateDetector {
  static async findPotentialDuplicates(
    newBusiness: BusinessImportData,
    existingBusinesses: Business[]
  ): Promise<
    Array<{ business: Business; similarity: number; reasons: string[] }>
  > {
    const duplicates: Array<{
      business: Business;
      similarity: number;
      reasons: string[];
    }> = [];

    for (const existing of existingBusinesses) {
      const similarity = this.calculateSimilarity(newBusiness, existing);

      if (similarity.score > 0.7) {
        duplicates.push({
          business: existing,
          similarity: similarity.score,
          reasons: similarity.reasons,
        });
      }
    }

    return duplicates.sort((a, b) => b.similarity - a.similarity);
  }

  private static calculateSimilarity(
    newBusiness: BusinessImportData,
    existing: Business
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const weights = {
      name: 0.4,
      address: 0.3,
      phone: 0.2,
      coordinates: 0.1,
    };

    // Name similarity
    const nameSimilarity = this.stringSimilarity(
      newBusiness.name.toLowerCase(),
      existing.name.toLowerCase()
    );
    if (nameSimilarity > 0.8) {
      score += weights.name * nameSimilarity;
      reasons.push(`Similar name (${Math.round(nameSimilarity * 100)}% match)`);
    }

    // Address similarity
    const addressSimilarity = this.stringSimilarity(
      newBusiness.address.toLowerCase(),
      existing.address.toLowerCase()
    );
    if (addressSimilarity > 0.7) {
      score += weights.address * addressSimilarity;
      reasons.push(
        `Similar address (${Math.round(addressSimilarity * 100)}% match)`
      );
    }

    // Phone similarity (exact match)
    if (newBusiness.phone && existing.phone) {
      const normalizedNew = this.normalizePhone(newBusiness.phone);
      const normalizedExisting = this.normalizePhone(existing.phone);
      if (normalizedNew === normalizedExisting) {
        score += weights.phone;
        reasons.push('Same phone number');
      }
    }

    // Coordinates similarity (within 100m)
    if (newBusiness.coordinates && existing.coordinates) {
      const distance = this.calculateDistance(
        newBusiness.coordinates,
        existing.coordinates
      );
      if (distance < 100) {
        // Within 100 meters
        score += weights.coordinates;
        reasons.push(`Same location (${Math.round(distance)}m apart)`);
      }
    }

    return { score, reasons };
  }

  private static stringSimilarity(str1: string, str2: string): number {
    // Simple implementation of Jaro-Winkler similarity
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0 || len2 === 0) return 0;
    if (str1 === str2) return 1;

    const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
    const str1Matches = new Array(len1).fill(false);
    const str2Matches = new Array(len2).fill(false);

    let matches = 0;
    let transpositions = 0;

    // Find matches
    for (let i = 0; i < len1; i++) {
      const start = Math.max(0, i - matchWindow);
      const end = Math.min(i + matchWindow + 1, len2);

      for (let j = start; j < end; j++) {
        if (str2Matches[j] || str1[i] !== str2[j]) continue;
        str1Matches[i] = str2Matches[j] = true;
        matches++;
        break;
      }
    }

    if (matches === 0) return 0;

    // Count transpositions
    let k = 0;
    for (let i = 0; i < len1; i++) {
      if (!str1Matches[i]) continue;
      while (!str2Matches[k]) k++;
      if (str1[i] !== str2[k]) transpositions++;
      k++;
    }

    const jaro =
      (matches / len1 +
        matches / len2 +
        (matches - transpositions / 2) / matches) /
      3;

    // Winkler prefix bonus
    let prefix = 0;
    for (let i = 0; i < Math.min(str1.length, str2.length, 4); i++) {
      if (str1[i] === str2[i]) prefix++;
      else break;
    }

    return jaro + 0.1 * prefix * (1 - jaro);
  }

  private static normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '').replace(/^65/, ''); // Remove non-digits and Singapore country code
  }

  private static calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) *
        Math.cos(this.toRadians(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Geocoding Service
export class GeocodingService {
  private static SINGAPORE_BOUNDS = {
    north: 1.5,
    south: 1.0,
    east: 104.5,
    west: 103.0,
  };

  static async geocodeAddress(address: string): Promise<GeocodeResult> {
    try {
      // Use Singapore OneMap API (free alternative to Google Maps)
      const response = await fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(address)}&returnGeom=Y&getAddrDetails=Y`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data.found === 0 || !data.results || data.results.length === 0) {
        return {
          success: false,
          error: 'Address not found',
        };
      }

      const result = data.results[0];
      const lat = parseFloat(result.LATITUDE);
      const lng = parseFloat(result.LONGITUDE);

      // Validate coordinates are within Singapore
      if (
        lat < this.SINGAPORE_BOUNDS.south ||
        lat > this.SINGAPORE_BOUNDS.north ||
        lng < this.SINGAPORE_BOUNDS.west ||
        lng > this.SINGAPORE_BOUNDS.east
      ) {
        return {
          success: false,
          error: 'Address is outside Singapore',
        };
      }

      return {
        success: true,
        coordinates: { lat, lng },
        formatted_address: result.ADDRESS,
        postal_code: result.POSTAL,
        district: this.mapToDistrict(result.POSTAL),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private static mapToDistrict(postal: string): string {
    if (!postal) return 'Unknown';

    const sector = parseInt(postal.substring(0, 2));

    // Map postal sectors to districts
    const sectorMapping: Record<number, string> = {
      1: 'Raffles Place',
      2: 'Anson',
      3: 'Queenstown',
      4: 'Telok Blangah',
      5: 'Pasir Panjang',
      6: 'High Street',
      7: 'Middle Road',
      8: 'Little India',
      9: 'Orchard',
      10: 'Ardmore',
      11: 'Newton',
      12: 'Balestier',
      13: 'Macpherson',
      14: 'Geylang',
      15: 'Katong',
      16: 'Bedok',
      17: 'Loyang',
      18: 'Tampines',
      19: 'Serangoon Garden',
      20: 'Bishan',
      21: 'Upper Bukit Timah',
      22: 'Jurong',
      23: 'Hillview',
      24: 'Lim Chu Kang',
      25: 'Kranji',
      26: 'Upper Thomson',
      27: 'Yishun',
      28: 'Seletar',
    };

    return sectorMapping[sector] || 'Other';
  }
}

// Export helper functions
export const importUtils = {
  CSVImportParser,
  ImportValidator,
  DuplicateDetector,
  GeocodingService,
};
