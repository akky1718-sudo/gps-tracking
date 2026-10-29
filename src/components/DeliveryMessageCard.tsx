import React, { useState } from 'react';
import { SelectedLocation } from '../types';
import { generateDeliveryInstructions } from '../utils/formatters';
import { copyTextToClipboard } from '../utils/clipboard';
import { MessageSquareText, Copy, Check, Info } from 'lucide-react';

interface DeliveryMessageCardProps {
  selectedLocation: SelectedLocation | null;
  landmark: string;
  addressDisplayName?: string;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const DeliveryMessageCard: React.FC<DeliveryMessageCardProps> = ({
  selectedLocation,
  landmark,
  addressDisplayName,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!selectedLocation) return null;

  const deliveryText = generateDeliveryInstructions({
    lat: selectedLocation.latitude,
    lng: selectedLocation.longitude,
    landmark,
    address: addressDisplayName,
  });

  const handleCopy = async () => {
    const success = await copyTextToClipboard(deliveryText);
    if (success) {
      setCopied(true);
      onToast('success', 'Delivery instruction block copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 rounded-2xl p-5 border border-slate-700 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Delivery Rider Preview
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-700/60 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
        {deliveryText}
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
        <p>
          Tip: Paste this directly into the &ldquo;Delivery instructions / Add directions&rdquo; section on Swiggy, Zomato, Blinkit, or send it directly over WhatsApp to your delivery partner.
        </p>
      </div>
    </div>
  );
};
