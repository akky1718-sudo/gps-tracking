import { describe, it, expect } from 'vitest';
import {
  formatCoordinates,
  generateGoogleMapsUrl,
  formatAccuracy,
  generateDeliveryInstructions,
} from '../utils/formatters';

describe('formatters', () => {
  it('formats coordinates to 6 decimal places by default', () => {
    const lat = 17.44829123;
    const lng = 78.37418299;
    expect(formatCoordinates(lat, lng)).toBe('17.448291, 78.374183');
  });

  it('generates standard Google Maps URL format matching specification', () => {
    const lat = 12.9715987;
    const lng = 77.5945627;
    const expected = 'https://www.google.com/maps/search/?api=1&query=12.971599,77.594563';
    expect(generateGoogleMapsUrl(lat, lng)).toBe(expected);
  });

  it('formats accuracy levels appropriately', () => {
    expect(formatAccuracy(null)).toEqual({
      text: 'Manual Pin',
      rating: 'manual',
    });

    expect(formatAccuracy(8)).toEqual({
      text: '±8m (High accuracy)',
      rating: 'good',
    });

    expect(formatAccuracy(30)).toEqual({
      text: '±30m (Moderate accuracy - zoom in to fine-tune)',
      rating: 'moderate',
    });

    expect(formatAccuracy(65)).toEqual({
      text: '±65m (Low GPS signal - please adjust pin manually)',
      rating: 'poor',
    });
  });

  it('generates full multi-line delivery instructions with landmark and address', () => {
    const output = generateDeliveryInstructions({
      lat: 17.448291,
      lng: 78.374183,
      landmark: 'Blue gate near Hanuman temple',
      address: 'Madhapur, Hyderabad',
    });

    expect(output).toContain('📍 EXACT DELIVERY LOCATION');
    expect(output).toContain('🗺️ Navigation Link: https://www.google.com/maps/search/?api=1&query=17.448291,78.374183');
    expect(output).toContain('📌 Coordinates: 17.448291, 78.374183');
    expect(output).toContain('🚪 Entrance / Gate: Blue gate near Hanuman temple');
    expect(output).toContain('🏡 Area: Madhapur, Hyderabad');
    expect(output).toContain('(Pinned via ExactPin)');
  });
});
