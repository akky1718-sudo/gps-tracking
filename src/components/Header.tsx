import React from 'react';
import { MapPin, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenHelp: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHelp, onOpenPrivacy }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <MapPin className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center">
                Exact<span className="text-blue-600">Pin</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                Precision Delivery
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium hidden xs:block">
              Pin your place. Make every delivery easier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
            aria-label="How ExactPin works"
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">How it Works</span>
          </button>

          <button
            onClick={onOpenPrivacy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
            aria-label="Privacy information"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Privacy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
