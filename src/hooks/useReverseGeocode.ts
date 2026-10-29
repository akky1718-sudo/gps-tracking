import { useState, useEffect, useRef } from 'react';
import { GeocodeAddress } from '../types';
import { reverseGeocode } from '../services/geocoding';

interface UseReverseGeocodeReturn {
  address: GeocodeAddress | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReverseGeocode(
  lat: number | null,
  lng: number | null,
  debounceMs = 500
): UseReverseGeocodeReturn {
  const [address, setAddress] = useState<GeocodeAddress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track request sequence to prevent race conditions
  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) {
      setAddress(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Immediately clear stale address for previous coordinates
    setAddress(null);
    setIsLoading(true);
    setError(null);

    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Increment request ID
    const currentRequestId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const result = await reverseGeocode(lat, lng, controller.signal);

        // Ensure this is still the latest request
        if (requestIdRef.current === currentRequestId) {
          setAddress(result);
          setIsLoading(false);
          if (!result) {
            setError('Approximate street details could not be retrieved.');
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Normal abort when user moved pin again; ignore
          return;
        }
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false);
          setError('Could not fetch address details. Coordinates are still 100% accurate.');
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lat, lng, debounceMs]);

  const refetch = () => {
    if (lat !== null && lng !== null) {
      // Force refresh by clearing cache key if needed or triggering
      setIsLoading(true);
      reverseGeocode(lat, lng).then((result) => {
        setAddress(result);
        setIsLoading(false);
      });
    }
  };

  return {
    address,
    isLoading,
    error,
    refetch,
  };
}
