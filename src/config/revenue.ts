/**
 * PROMJA - Centralized Creator Revenue & Monetization Configuration
 * 
 * Configure platform vs creator revenue splits from this single file.
 * In V1 payments are not active; this prepares the core accounting formulas.
 */

export interface RevenueConfig {
  defaultCreatorSharePercentage: number;   // e.g. 70 means 70% to creator
  defaultPlatformSharePercentage: number;  // e.g. 30 means 30% to PROMJA
  currency: string;
  minPayoutThreshold: number;
}

export const REVENUE_CONFIG: RevenueConfig = {
  defaultCreatorSharePercentage: 70,
  defaultPlatformSharePercentage: 30,
  currency: 'USD',
  minPayoutThreshold: 50.0,
};

/**
 * Calculates earnings split for any gross prompt or subscription revenue.
 */
export function calculateRevenueSplit(
  grossAmount: number,
  creatorSharePercentage: number = REVENUE_CONFIG.defaultCreatorSharePercentage
) {
  const creatorPercentage = Math.min(100, Math.max(0, creatorSharePercentage));
  const creatorRevenue = Number(((grossAmount * creatorPercentage) / 100).toFixed(2));
  const platformRevenue = Number((grossAmount - creatorRevenue).toFixed(2));

  return {
    creatorRevenue,
    platformRevenue,
    totalRevenue: grossAmount,
    revenueSharePercentage: creatorPercentage,
  };
}
