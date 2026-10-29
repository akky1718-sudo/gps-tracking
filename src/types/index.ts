export type LocationSource = 'gps' | 'manual';

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null; // Accuracy in metres. Only non-null if source is 'gps'.
  source: LocationSource;
  timestamp: number;
}

export interface GeocodeAddress {
  displayName: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export type GeolocationErrorCode =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface GeolocationErrorState {
  code: GeolocationErrorCode;
  message: string;
  suggestion: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
