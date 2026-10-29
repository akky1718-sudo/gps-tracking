import React from 'react';
import { MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHelp, onOpenPrivacy }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">ExactPin</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">Pin your place. Make every delivery easier.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenHelp}
              className="hover:text-blue-600 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            Map data &copy;{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600"
            >
              OpenStreetMap
            </a>{' '}
            contributors. Geocoding via Nominatim.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for smoother deliveries in India & beyond.
          </p>
        </div>

        <p className="text-[10px] text-slate-400 text-center sm:text-left">
          Disclaimer: ExactPin is an independent public utility. Google Maps is a trademark of Google LLC. ExactPin is not affiliated with Google, OpenStreetMap Foundation, or any food or e-commerce delivery platform.
        </p>
      </div>
    </footer>
  );
};
