import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from '../hooks/useGeolocation';

describe('useGeolocation hook', () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: originalGeolocation,
    });
  });

  it('does not request location permission automatically on mount', () => {
    const getCurrentPositionMock = vi.fn();
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    renderHook(() => useGeolocation());
    expect(getCurrentPositionMock).not.toHaveBeenCalled();
  });

  it('returns valid coordinates and accuracy when detection succeeds', async () => {
    const mockSuccessPosition = {
      coords: {
        latitude: 19.076,
        longitude: 72.8777,
        accuracy: 12,
      },
      timestamp: 1670000000000,
    };

    const getCurrentPositionMock = vi.fn().mockImplementation((success) => {
      success(mockSuccessPosition);
    });

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    const { result } = renderHook(() => useGeolocation());

    let locationResult: any = null;
    await act(async () => {
      locationResult = await result.current.detectLocation();
    });

    expect(getCurrentPositionMock).toHaveBeenCalledTimes(1);
    expect(locationResult).toEqual({
      latitude: 19.076,
      longitude: 72.8777,
      accuracy: 12,
      source: 'gps',
      timestamp: 1670000000000,
    });
    expect(result.current.error).toBeNull();
  });

  it('handles PERMISSION_DENIED correctly with clear guidance', async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'User denied Geolocation',
    };

    const getCurrentPositionMock = vi.fn().mockImplementation((_, error) => {
      error(mockError);
    });

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    const { result } = renderHook(() => useGeolocation());

    let locationResult: any = null;
    await act(async () => {
      locationResult = await result.current.detectLocation();
    });

    expect(locationResult).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.code).toBe('PERMISSION_DENIED');
    expect(result.current.error?.message).toContain('Location access was denied');
  });

  it('handles TIMEOUT error correctly', async () => {
    const mockError = {
      code: 3, // TIMEOUT
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
      message: 'Timeout expired',
    };

    const getCurrentPositionMock = vi.fn().mockImplementation((_, error) => {
      error(mockError);
    });

    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: { getCurrentPosition: getCurrentPositionMock },
    });

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await result.current.detectLocation();
    });

    expect(result.current.error?.code).toBe('TIMEOUT');
    expect(result.current.error?.message).toContain('GPS request timed out');
  });
});
