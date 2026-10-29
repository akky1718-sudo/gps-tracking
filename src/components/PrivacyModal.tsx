import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 id="privacy-modal-title" className="text-lg font-bold text-slate-900">
              Privacy & Data Policy
            </h3>
            <p className="text-xs text-slate-500">100% Client-Side Location Utility</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-emerald-900 text-xs">
              <strong>Your location never leaves your browser:</strong> ExactPin does not use a backend database or user tracking. Your coordinates are processed purely on your device.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <ServerOff className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">No Server Storage</h4>
              <p className="text-xs text-slate-500">
                We do not log, persist, or collect your coordinates or landmark notes on any server. Once you close this tab, your data vanishes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">No Continuous Tracking</h4>
              <p className="text-xs text-slate-500">
                ExactPin requests your GPS location only once when you explicitly click &ldquo;Detect My Location&rdquo;. We do not track your location in the background.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="font-semibold text-slate-800 text-xs sm:text-sm mb-1">
              Third-Party Services
            </h4>
            <p className="text-xs text-slate-500">
              Map tiles and street name lookups are provided by OpenStreetMap and Nominatim in accordance with their public usage guidelines. When you click &ldquo;Open in Google Maps&rdquo;, Google&rsquo;s standard web interface is opened.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
