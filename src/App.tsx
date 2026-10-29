import { useState, useCallback } from 'react';
import { SelectedLocation, ToastMessage } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { Header } from './components/Header';
import { MapContainer } from './components/MapContainer';
import { LocationDetails } from './components/LocationDetails';
import { ActionButtons } from './components/ActionButtons';
import { DeliveryMessageCard } from './components/DeliveryMessageCard';
import { PrivacyModal } from './components/PrivacyModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import {
  Navigation,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';

export function App() {
  // Canonical location state: Single source of truth across all components
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [landmark, setLandmark] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // GPS detection hook
  const { isDetecting, error: geoError, detectLocation, clearError } = useGeolocation();

  // Reverse geocoding hook with 500ms debounce and cancellation
  const {
    address,
    isLoading: isAddressLoading,
    error: addressError,
  } = useReverseGeocode(
    selectedLocation ? selectedLocation.latitude : null,
    selectedLocation ? selectedLocation.longitude : null,
    500
  );

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', message: string, duration = 3500) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handler for GPS detection button
  const handleDetectGPS = async () => {
    clearError();
    const result = await detectLocation();
    if (result) {
      setSelectedLocation(result);
      addToast(
        'success',
        result.accuracy && result.accuracy < 25
          ? `GPS located (accurate to ±${Math.round(result.accuracy)}m). Now drag pin to your entrance.`
          : 'Location found. Fine-tune by dragging the pin to your gate.'
      );
    }
  };

  // Handler for map clicks or pin dragging
  // Updates selectedLocation immediately and sets source to 'manual'
  const handleManualLocationSelect = useCallback(
    (latitude: number, longitude: number) => {
      setSelectedLocation({
        latitude,
        longitude,
        accuracy: null, // Reset GPS accuracy since pin is manually positioned
        source: 'manual',
        timestamp: Date.now(),
      });
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header */}
      <Header
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        {/* Hero Banner / Quick Action Bar */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-xs border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Last-Mile Delivery Solution</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Stop delivery calls. Pinpoint your exact entrance.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Narrow streets and wrong house numbers confuse delivery agents. Drop a pin on your front gate, copy the direct navigation link, and guide riders right to your doorstep.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={handleDetectGPS}
                disabled={isDetecting}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                aria-label="Detect GPS Location"
              >
                <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Detecting Location...' : 'Detect My Location'}</span>
              </button>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-semibold backdrop-blur-xs transition-colors border border-white/10"
              >
                <HelpCircle className="w-4 h-4" />
                <span>How to use</span>
              </button>
            </div>
          </div>
        </section>

        {/* Geolocation Error Alert (Permission denied / Timeout / etc.) */}
        {geoError && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 shadow-xs flex items-start gap-3.5 animate-in slide-in-from-top-2"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm space-y-1">
              <p className="font-semibold">{geoError.message}</p>
              <p className="text-amber-800 text-xs leading-relaxed">{geoError.suggestion}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDetectGPS}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={clearError}
                className="text-amber-700 hover:text-amber-950 p-1 rounded-md text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Core Layout: Map + Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Map Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-3">
            <MapContainer
              selectedLocation={selectedLocation}
              onLocationSelect={handleManualLocationSelect}
              onDetectLocation={handleDetectGPS}
              isDetecting={isDetecting}
            />

            {/* Quick Micro-Note under map */}
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Client-side only. Location coordinates are never saved to our servers.</span>
              </div>
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="underline hover:text-blue-600 transition-colors"
              >
                Privacy details
              </button>
            </div>
          </div>

          {/* Side Info & Sharing Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Coordinates, Accuracy & Landmark Input */}
            <LocationDetails
              selectedLocation={selectedLocation}
              address={address}
              isAddressLoading={isAddressLoading}
              addressError={addressError}
              landmark={landmark}
              onLandmarkChange={setLandmark}
            />

            {/* Copy & Share Actions */}
            <ActionButtons
              selectedLocation={selectedLocation}
              landmark={landmark}
              addressDisplayName={address?.displayName}
              onToast={addToast}
            />

            {/* Delivery Rider Instructions Live Preview */}
            <DeliveryMessageCard
              selectedLocation={selectedLocation}
              landmark={landmark}
              addressDisplayName={address?.displayName}
              onToast={addToast}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Modals & Toasts */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <HowItWorksModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
