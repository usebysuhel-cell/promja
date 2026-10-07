import React from 'react';
import { AdSlotId } from '../../config/ads';
import { FEATURES } from '../../config/features';
import { adsManager } from '../../services/adsService';

interface AdSlotProps {
  slotId: AdSlotId;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId, className = '' }) => {
  // If ads are disabled globally, render absolutely nothing (zero layout shift, no fake ads)
  if (!FEATURES.ENABLE_ADS || !adsManager.isAdsActive()) {
    return null;
  }

  const slotConfig = adsManager.getSlotConfig(slotId);

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-container my-4 rounded-xl border border-white/5 bg-[#0e0f17] p-4 text-center transition-all ${className}`}
      data-ad-slot={slotId}
      data-ad-format={slotConfig.format}
    >
      <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
        Advertisement
      </div>
      <div
        id={`ad-unit-${slotId}`}
        className="min-h-[90px] flex items-center justify-center text-xs text-neutral-400"
      >
        {/* Real ad network scripts mount here via IAdProvider */}
      </div>
    </aside>
  );
};
