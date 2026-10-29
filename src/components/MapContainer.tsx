import React, { useEffect, useMemo, useRef } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { SelectedLocation } from '../types';
import { Crosshair, Move, Navigation, LocateFixed } from 'lucide-react';

interface MapViewProps {
  selectedLocation: SelectedLocation | null;
  onLocationSelect: (lat: number, lng: number, source: 'manual') => void;
  onDetectLocation: () => void;
  isDetecting: boolean;
}

/**
 * Custom SVG DivIcon for the ExactPin marker.
 * Modern, sharp on Retina screens, and accurately anchored at the bottom tip.
 */
function createExactPinIcon() {
  return L.divIcon({
    className: 'exactpin-custom-marker',
    html: `
      <div style="position: relative; width: 44px; height: 54px; transform: translate(-22px, -50px); cursor: grab;">
        <!-- Pulsing radar effect at base -->
        <div style="position: absolute; bottom: 0; left: 14px; width: 16px; height: 8px; background: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: pinPulse 2s infinite ease-in-out;"></div>
        
        <!-- Main Pin SVG -->
        <svg width="44" height="50" viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));">
          <path d="M22 0C10.9543 0 2 8.9543 2 20C2 31.0457 20 48.5 22 50C24 48.5 42 31.0457 42 20C42 8.9543 33.0457 0 22 0Z" fill="#1D4ED8"/>
          <path d="M22 2C12.0589 2 4 10.0589 4 20C4 29.5 20.2 45.2 22 47C23.8 45.2 40 29.5 40 20C40 10.0589 31.9411 2 22 2Z" fill="#2563EB"/>
          <!-- Inner circle with white fill -->
          <circle cx="22" cy="19" r="9" fill="white"/>
          <!-- Target bullseye icon inside -->
          <circle cx="22" cy="19" r="4.5" fill="#DC2626"/>
        </svg>

        <!-- Tooltip Label -->
        <div style="position: absolute; top: -26px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; white-space: nowrap; pointer-events: none; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
          Gate Entrance Pin
        </div>
      </div>
    `,
    iconSize: [44, 54],
    iconAnchor: [22, 50],
    popupAnchor: [0, -48],
  });
}

// Controller to handle map clicks for positioning
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, source: 'manual') => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng, 'manual');
    },
  });
  return null;
}

// Controller to smoothly pan/zoom when location updates via GPS or manual selection
function MapViewController({
  selectedLocation,
  recenterTrigger,
}: {
  selectedLocation: SelectedLocation | null;
  recenterTrigger: number;
}) {
  const map = useMap();
  const previousLocRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedLocation) return;

    const locKey = `${selectedLocation.latitude.toFixed(6)},${selectedLocation.longitude.toFixed(6)}`;
    
    // Check if this was a GPS update or explicit recenter click
    if (selectedLocation.source === 'gps' || previousLocRef.current === null || recenterTrigger > 0) {
      map.flyTo([selectedLocation.latitude, selectedLocation.longitude], Math.max(map.getZoom(), 18), {
        duration: 1.2,
      });
    }

    previousLocRef.current = locKey;
  }, [selectedLocation, recenterTrigger, map]);

  return null;
}

export const MapContainer: React.FC<MapViewProps> = ({
  selectedLocation,
  onLocationSelect,
  onDetectLocation,
  isDetecting,
}) => {
  const [recenterCount, setRecenterCount] = React.useState<number>(0);
  const markerRef = useRef<L.Marker | null>(null);
  const pinIcon = useMemo(() => createExactPinIcon(), []);

  // Default viewport if user hasn't selected anything yet (e.g., India central region)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  const currentCenter: [number, number] = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : defaultCenter;

  const currentZoom = selectedLocation ? 18 : defaultZoom;

  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const latLng = marker.getLatLng();
      onLocationSelect(latLng.lat, latLng.lng, 'manual');
    }
  };

  const handleRecenter = () => {
    if (selectedLocation) {
      setRecenterCount((c) => c + 1);
    }
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100">
      {/* Top Map Guidance Floating Pill */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-xs sm:text-sm font-medium shadow-md flex items-center gap-2 border border-slate-700/50">
        <Move className="w-4 h-4 text-blue-400 shrink-0" />
        <span>Drag the blue pin or tap anywhere to place the entrance</span>
      </div>

      {/* Recenter & Map Controls Overlay */}
      <div className="absolute bottom-5 right-3 z-20 flex flex-col gap-2">
        {selectedLocation && (
          <button
            onClick={handleRecenter}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 transition-all active:scale-95 flex items-center justify-center group"
            title="Recenter pin on screen"
            aria-label="Recenter pin on screen"
          >
            <LocateFixed className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
          </button>
        )}

        <button
          onClick={onDetectLocation}
          disabled={isDetecting}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center disabled:opacity-60"
          title="Use GPS Location"
          aria-label="Use GPS Location"
        >
          <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Empty State Banner if not located yet */}
      {!selectedLocation && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
          <div className="pointer-events-auto max-w-sm w-full bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto mb-3 flex items-center justify-center shadow-inner">
              <Crosshair className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Ready to pinpoint your place
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Detect your device GPS, or tap anywhere on the map to manually set your house entrance.
            </p>
            <button
              onClick={onDetectLocation}
              disabled={isDetecting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting satellites...' : 'Detect My Location'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <LeafletMap
        center={currentCenter}
        zoom={currentZoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        attributionControl={true}
      >
        {/* OpenStreetMap Tile Layer with standard compliant attribution */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapClickHandler onLocationSelect={onLocationSelect} />
        <MapViewController
          selectedLocation={selectedLocation}
          recenterTrigger={recenterCount}
        />

        {selectedLocation && (
          <>
            {/* Show GPS accuracy circle ONLY if derived from GPS */}
            {selectedLocation.source === 'gps' && selectedLocation.accuracy !== null && (
              <Circle
                center={[selectedLocation.latitude, selectedLocation.longitude]}
                radius={selectedLocation.accuracy}
                pathOptions={{
                  color: '#2563eb',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.12,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            )}

            {/* Draggable Exact Marker */}
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              draggable={true}
              icon={pinIcon}
              ref={markerRef}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
            />
          </>
        )}
      </LeafletMap>
    </div>
  );
};
