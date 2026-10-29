import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReverseGeocode } from '../hooks/useReverseGeocode';
import * as geocodingService from '../services/geocoding';

describe('useReverseGeocode hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('debounces reverse geocoding queries', async () => {
    const reverseGeocodeSpy = vi.spyOn(geocodingService, 'reverseGeocode').mockResolvedValue({
      displayName: '123 Main Road, Indiranagar, Bengaluru',
      road: '123 Main Road',
      city: 'Bengaluru',
    });

    const { rerender } = renderHook(
      ({ lat, lng }) => useReverseGeocode(lat, lng, 300),
      { initialProps: { lat: 12.97, lng: 77.59 } }
    );

    // Fast updates (e.g. while dragging)
    rerender({ lat: 12.971, lng: 77.591 });
    rerender({ lat: 12.972, lng: 77.592 });

    expect(reverseGeocodeSpy).not.toHaveBeenCalled();

    // Advance timers by debounce duration
    await act(async () => {
      vi.advanceTimersByTime(350);
    });

    expect(reverseGeocodeSpy).toHaveBeenCalledTimes(1);
    expect(reverseGeocodeSpy).toHaveBeenCalledWith(12.972, 77.592, expect.any(AbortSignal));
  });

  it('clears stale address immediately when coordinates change', () => {
    vi.spyOn(geocodingService, 'reverseGeocode').mockResolvedValue({
      displayName: 'Old Location Street',
    });

    const { result, rerender } = renderHook(
      ({ lat, lng }) => useReverseGeocode(lat, lng, 300),
      { initialProps: { lat: 12.97, lng: 77.59 } }
    );

    // Coordinate change happens
    rerender({ lat: 28.61, lng: 77.20 });

    // Address must immediately be null so old address is not falsely displayed for new point
    expect(result.current.address).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
