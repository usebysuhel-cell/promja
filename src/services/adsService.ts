import { AD_SLOTS, AdSlotId, AdSlotConfig } from '../config/ads';
import { FEATURES } from '../config/features';

export interface IAdProvider {
  renderAd(slotId: AdSlotId, containerElement: HTMLElement): void;
  destroyAd(slotId: AdSlotId): void;
}

/**
 * Default clean placeholder provider.
 * When ads are disabled (default), renders nothing.
 * If ENABLE_ADS is turned on, developers can provide a real provider (Google AdSense, etc.).
 */
export class AdsManager {
  private isEnabled: boolean = FEATURES.ENABLE_ADS;
  private provider: IAdProvider | null = null;

  public setProvider(provider: IAdProvider) {
    this.provider = provider;
  }

  public isAdsActive(): boolean {
    return this.isEnabled;
  }

  public getSlotConfig(slotId: AdSlotId): AdSlotConfig {
    return AD_SLOTS[slotId];
  }
}

export const adsManager = new AdsManager();
