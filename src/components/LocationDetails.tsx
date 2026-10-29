import React from 'react';
import { SelectedLocation, GeocodeAddress } from '../types';
import { formatCoordinates, formatAccuracy } from '../utils/formatters';
import {
  Compass,
  MapPin,
  Building2,
  Loader2,
  Info,
  CheckCircle,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';

interface LocationDetailsProps {
  selectedLocation: SelectedLocation | null;
  address: GeocodeAddress | null;
  isAddressLoading: boolean;
  addressError: string | null;
  landmark: string;
  onLandmarkChange: (val: string) => void;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({
  selectedLocation,
  address,
  isAddressLoading,
  addressError,
  landmark,
  onLandmarkChange,
}) => {
  if (!selectedLocation) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto mb-3 flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Location Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tap “Detect My Location” above or click on the map to set your house entrance pin.
        </p>
      </div>
    );
  }

  const { latitude, longitude, accuracy, source } = selectedLocation;
  const accuracyInfo = formatAccuracy(source === 'gps' ? accuracy : null);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
      {/* Top Header: Coordinates & Accuracy Status */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Pin Coordinates
            </span>
          </div>

          {/* Accuracy or Manual Pill */}
          <div className="flex items-center gap-1.5">
            {source === 'gps' ? (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  accuracyInfo.rating === 'good'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : accuracyInfo.rating === 'moderate'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {accuracyInfo.rating === 'good' && <CheckCircle className="w-3.5 h-3.5" />}
                {accuracyInfo.rating !== 'good' && <AlertTriangle className="w-3.5 h-3.5" />}
                <span>{accuracyInfo.text}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Manually Positioned Pin</span>
              </span>
            )}
          </div>
        </div>

        {/* Big Monospace Coordinates Display */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
          <code className="text-base sm:text-lg font-mono font-bold text-slate-800 tracking-tight select-all">
            {formatCoordinates(latitude, longitude, 6)}
          </code>
          <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
            WGS84
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Displayed to 6 decimals (~0.1m resolution) for exact entrance navigation.</span>
        </p>
      </div>

      {/* Street / Area Information Card */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Nearby Street & Area</span>
          </span>
          {isAddressLoading && (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Looking up street...</span>
            </span>
          )}
        </div>

        <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80 min-h-[58px] flex items-center">
          {isAddressLoading ? (
            <div className="w-full space-y-1.5 animate-pulse">
              <div className="h-3.5 bg-slate-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
            </div>
          ) : address ? (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {address.road || address.neighbourhood || address.suburb || 'Selected Location'}
              </p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                {address.displayName}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              {addressError || 'Drag pin near a mapped road to retrieve street names.'}
            </p>
          )}
        </div>
      </div>

      {/* House Entrance / Landmark Input */}
      <div className="pt-2 border-t border-slate-100">
        <label
          htmlFor="landmark-input"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
        >
          Gate Entrance Landmark <span className="font-normal text-slate-400 lowercase">(optional)</span>
        </label>
        <div className="relative">
          <input
            id="landmark-input"
            type="text"
            maxLength={140}
            value={landmark}
            onChange={(e) => onLandmarkChange(e.target.value)}
            placeholder="Example: Blue gate next to the temple, opposite house 24"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
          <span>Helps the delivery partner identify your gate instantly.</span>
          <span>{landmark.length}/140</span>
        </div>
      </div>
    </div>
  );
};
