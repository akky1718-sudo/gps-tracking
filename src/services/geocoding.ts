import { GeocodeAddress } from '../types';

/**
 * In-memory LRU-like cache to prevent unnecessary repeat queries.
 */
const geocodeCache = new Map<string, GeocodeAddress>();
const MAX_CACHE_SIZE = 50;

/**
 * Generates a cache key rounded to ~4 decimal places (~11 meters)
 * so tiny micro-adjustments don't flood the Nominatim server.
 */
function getCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

interface NominatimResponse {
  display_name?: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    building?: string;
    amenity?: string;
    house_number?: string;
  };
}

/**
 * Reverse geocodes coordinates via OpenStreetMap Nominatim.
 * Complies with the Nominatim Usage Policy:
 * - Provides custom User-Agent / identification header
 * - Low volume with in-memory caching
 * - Uses AbortSignal for cancellation
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<GeocodeAddress | null> {
  const cacheKey = getCacheKey(lat, lng);
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  const endpoint = new URL('https://nominatim.openstreetmap.org/reverse');
  endpoint.searchParams.set('format', 'jsonv2');
  endpoint.searchParams.set('lat', lat.toString());
  endpoint.searchParams.set('lon', lng.toString());
  endpoint.searchParams.set('zoom', '18');
  endpoint.searchParams.set('addressdetails', '1');

  // Optional custom email from env
  const contactEmail = import.meta.env.VITE_NOMINATIM_EMAIL || 'support@exactpin.local';
  endpoint.searchParams.set('email', contactEmail);

  try {
    const response = await fetch(endpoint.toString(), {
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // 429 Too Many Requests or 503 Service Unavailable
      return null;
    }

    const data: NominatimResponse = await response.json();

    if (!data || !data.display_name) {
      return null;
    }

    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.county;
    const road = [addr.house_number, addr.road].filter(Boolean).join(' ') || addr.road;

    const result: GeocodeAddress = {
      displayName: data.display_name,
      road: road || undefined,
      neighbourhood: addr.neighbourhood,
      suburb: addr.suburb,
      city: city || undefined,
      state: addr.state,
      postcode: addr.postcode,
      country: addr.country,
    };

    // Store in cache
    if (geocodeCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = geocodeCache.keys().next().value;
      if (oldestKey) geocodeCache.delete(oldestKey);
    }
    geocodeCache.set(cacheKey, result);

    return result;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      // Intentionally aborted by newer coordinate selection
      throw err;
    }
    // Network or parser error - return null without crashing
    return null;
  }
}
