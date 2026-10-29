import React, { useState } from 'react';
import { SelectedLocation } from '../types';
import {
  formatCoordinates,
  generateGoogleMapsUrl,
  generateDeliveryInstructions,
} from '../utils/formatters';
import { copyTextToClipboard, shareContent } from '../utils/clipboard';
import {
  Copy,
  ExternalLink,
  Share2,
  Check,
  ClipboardList,
  Link as LinkIcon,
} from 'lucide-react';

interface ActionButtonsProps {
  selectedLocation: SelectedLocation | null;
  landmark: string;
  addressDisplayName?: string;
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedLocation,
  landmark,
  addressDisplayName,
  onToast,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!selectedLocation) return null;

  const { latitude, longitude } = selectedLocation;
  const coordinatesString = formatCoordinates(latitude, longitude);
  const googleMapsUrl = generateGoogleMapsUrl(latitude, longitude);

  const handleCopy = async (key: string, text: string, successMsg: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedKey(key);
      onToast('success', successMsg);
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      onToast('error', 'Failed to copy to clipboard. Please copy manually.');
    }
  };

  const handleShare = async () => {
    const deliveryText = generateDeliveryInstructions({
      lat: latitude,
      lng: longitude,
      landmark,
      address: addressDisplayName,
    });

    const result = await shareContent({
      title: 'ExactPin Delivery Location',
      text: deliveryText,
      url: googleMapsUrl,
    });

    if (result === 'shared') {
      onToast('success', 'Location shared successfully!');
    } else if (result === 'fallback') {
      // Fallback: copy link
      await handleCopy('share-fallback', googleMapsUrl, 'Share sheet not available. Google Maps link copied to clipboard!');
    }
  };

  const handleCopyDeliveryDetails = async () => {
    const fullText = generateDeliveryInstructions({
      lat: latitude,
      lng: longitude,
      landmark,
      address: addressDisplayName,
    });

    await handleCopy(
      'delivery-details',
      fullText,
      'Delivery instructions copied! Ready to paste into Swiggy, Zomato, or WhatsApp.'
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Share & Navigation Actions
        </h3>
        <span className="text-xs text-blue-600 font-medium">Ready to share</span>
      </div>

      {/* Main Big Delivery Action */}
      <button
        onClick={handleCopyDeliveryDetails}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all"
        aria-label="Copy full delivery details for delivery rider"
      >
        {copiedKey === 'delivery-details' ? (
          <Check className="w-5 h-5 text-emerald-300" />
        ) : (
          <ClipboardList className="w-5 h-5" />
        )}
        <span>
          {copiedKey === 'delivery-details'
            ? 'Copied Delivery Details!'
            : 'Copy Delivery Instructions for Rider'}
        </span>
      </button>

      {/* Grid of Individual Quick Actions */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Copy Google Maps Link */}
        <button
          onClick={() =>
            handleCopy(
              'maps-link',
              googleMapsUrl,
              'Google Maps link copied to clipboard!'
            )
          }
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium transition-colors"
          aria-label="Copy Google Maps Link"
        >
          {copiedKey === 'maps-link' ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <LinkIcon className="w-4 h-4 text-blue-600" />
          )}
          <span>{copiedKey === 'maps-link' ? 'Copied Link' : 'Copy Maps Link'}</span>
        </button>

        {/* Copy Raw Coordinates */}
        <button
          onClick={() =>
            handleCopy(
              'coords',
              coordinatesString,
              `Coordinates copied: ${coordinatesString}`
            )
          }
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium transition-colors"
          aria-label="Copy Coordinates"
        >
          {copiedKey === 'coords' ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4 text-slate-600" />
          )}
          <span>{copiedKey === 'coords' ? 'Copied' : 'Copy Coordinates'}</span>
        </button>

        {/* Open in Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium transition-colors"
          aria-label="Open in Google Maps in a new tab"
        >
          <ExternalLink className="w-4 h-4 text-emerald-600" />
          <span>Open in Maps</span>
        </a>

        {/* Share Location via Web Share API */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-600 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium transition-colors"
          aria-label="Share Location"
        >
          <Share2 className="w-4 h-4 text-indigo-600" />
          <span>Share Pin</span>
        </button>
      </div>
    </div>
  );
};
