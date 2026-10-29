/**
 * Formats latitude and longitude coordinates to a standard precision (default: 6 decimal places).
 * 6 decimal places corresponds to approximately 0.11 meters of precision.
 */
export function formatCoordinates(lat: number, lng: number, precision = 6): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

/**
 * Standard Google Maps Search URL format per specification:
 * https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE
 */
export function generateGoogleMapsUrl(lat: number, lng: number, precision = 6): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(precision)},${lng.toFixed(precision)}`;
}

/**
 * Human-readable accuracy string with qualitative indicator.
 */
export function formatAccuracy(accuracy: number | null): { text: string; rating: 'good' | 'moderate' | 'poor' | 'manual' } {
  if (accuracy === null || accuracy === undefined) {
    return {
      text: 'Manual Pin',
      rating: 'manual',
    };
  }

  const rounded = Math.round(accuracy);
  if (rounded <= 15) {
    return {
      text: `±${rounded}m (High accuracy)`,
      rating: 'good',
    };
  } else if (rounded <= 45) {
    return {
      text: `±${rounded}m (Moderate accuracy - zoom in to fine-tune)`,
      rating: 'moderate',
    };
  } else {
    return {
      text: `±${rounded}m (Low GPS signal - please adjust pin manually)`,
      rating: 'poor',
    };
  }
}

/**
 * Formats a clean, multi-line delivery instruction message optimized for
 * delivery partners (Swiggy, Zomato, Amazon, Flipkart, Blinkit, Dunzo, Uber, etc.)
 */
export interface DeliveryMessageOptions {
  lat: number;
  lng: number;
  landmark?: string;
  address?: string;
}

export function generateDeliveryInstructions({
  lat,
  lng,
  landmark,
  address,
}: DeliveryMessageOptions): string {
  const coords = formatCoordinates(lat, lng);
  const mapsUrl = generateGoogleMapsUrl(lat, lng);

  const lines: string[] = [
    '📍 EXACT DELIVERY LOCATION',
    `🗺️ Navigation Link: ${mapsUrl}`,
    `📌 Coordinates: ${coords}`,
  ];

  const trimmedLandmark = landmark?.trim();
  if (trimmedLandmark) {
    lines.push(`🚪 Entrance / Gate: ${trimmedLandmark}`);
  }

  const trimmedAddress = address?.trim();
  if (trimmedAddress) {
    lines.push(`🏡 Area: ${trimmedAddress}`);
  }

  lines.push('💡 Note: Open link above to navigate straight to the exact gate entrance.');
  lines.push('(Pinned via ExactPin)');

  return lines.join('\n');
}
