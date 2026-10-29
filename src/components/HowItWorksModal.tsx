import React from 'react';
import { HelpCircle, Navigation, Move, MessageSquare, CheckCheck, X } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: Navigation,
      color: 'bg-blue-50 text-blue-600',
      title: '1. Detect Your General Location',
      description:
        'Click "Detect My Location" to automatically locate your phone or laptop GPS coordinates, or tap anywhere on the map.',
    },
    {
      icon: Move,
      color: 'bg-indigo-50 text-indigo-600',
      title: '2. Drag Pin to the Exact Gate',
      description:
        'Standard GPS often drops pins in the middle of roads or back alleys. Zoom in closely and drag the blue pin directly onto your specific gate, entrance door, or building entrance.',
    },
    {
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600',
      title: '3. Add Entrance Landmark (Optional)',
      description:
        'Add a clear visual note like "Blue gate opposite house 24, next to the neem tree" so the rider spots it instantly.',
    },
    {
      icon: CheckCheck,
      color: 'bg-emerald-50 text-emerald-600',
      title: '4. Copy & Share with Delivery Rider',
      description:
        'Click "Copy Delivery Instructions" and paste it directly into your Swiggy, Zomato, Amazon, Blinkit order instructions or share it via WhatsApp.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
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

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="how-it-works-title" className="text-lg font-bold text-slate-900">
              How ExactPin Works
            </h3>
            <p className="text-xs text-slate-500">Solve the last 50-meter delivery problem</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`p-2 rounded-lg shrink-0 ${step.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            Got it, Let&rsquo;s Pin!
          </button>
        </div>
      </div>
    </div>
  );
};
