import { useState, useCallback } from 'react';
import { SelectedLocation, GeolocationErrorState } from '../types';

interface UseGeolocationReturn {
  isDetecting: boolean;
  error: GeolocationErrorState | null;
  detectLocation: () => Promise<SelectedLocation | null>;
  clearError: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [error, setError] = useState<GeolocationErrorState | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const detectLocation = useCallback((): Promise<SelectedLocation | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        const err: GeolocationErrorState = {
          code: 'UNSUPPORTED',
          message: 'Location services are not supported by this browser.',
          suggestion: 'Please try a modern browser like Chrome, Safari, or Firefox, or click the map directly to place your pin.',
        };
        setError(err);
        resolve(null);
        return;
      }

      setIsDetecting(true);
      setError(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          const location: SelectedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy ?? null,
            source: 'gps',
            timestamp: position.timestamp || Date.now(),
          };
          resolve(location);
        },
        (geoError: GeolocationPositionError) => {
          setIsDetecting(false);
          let err: GeolocationErrorState;

          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              err = {
                code: 'PERMISSION_DENIED',
                message: 'Location access was denied.',
                suggestion: 'To use auto-detection, please tap the lock/settings icon in your browser address bar and allow Location access, or drag the pin manually.',
              };
              break;
            case geoError.POSITION_UNAVAILABLE:
              err = {
                code: 'POSITION_UNAVAILABLE',
                message: 'Location information is unavailable.',
                suggestion: 'Ensure your device GPS or Location toggle is turned on. You can also tap anywhere on the map to place your pin manually.',
              };
              break;
            case geoError.TIMEOUT:
              err = {
                code: 'TIMEOUT',
                message: 'GPS request timed out.',
                suggestion: 'Acquiring satellite signal took too long. Try moving outdoors, or tap the map to place your pin manually.',
              };
              break;
            default:
              err = {
                code: 'UNKNOWN',
                message: geoError.message || 'An unexpected error occurred while detecting location.',
                suggestion: 'Please tap anywhere on the map to set your location manually.',
              };
          }

          setError(err);
          resolve(null);
        },
        options
      );
    });
  }, []);

  return {
    isDetecting,
    error,
    detectLocation,
    clearError,
  };
}
