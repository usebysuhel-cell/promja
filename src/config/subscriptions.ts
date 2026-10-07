/**
 * PROMJA - Centralized Subscription Tier Architecture
 * 
 * Prepares the multi-tier subscription system.
 * Payments and billing remain disabled until ENABLE_SUBSCRIPTIONS is activated.
 */

export type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM';

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  badge: string;
  features: string[];
  limits: {
    copiesPerDay: number; // -1 for unlimited
    hasApiAccess: boolean;
    hasEarlyAccess: boolean;
    adFree: boolean;
    hasExclusivePrompts: boolean;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free Artisan',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: 'Free',
    features: [
      'Unlimited public prompt discovery',
      'One-tap prompt copying',
      'Full category and AI tool search',
      'Community prompt access',
    ],
    limits: {
      copiesPerDay: -1,
      hasApiAccess: false,
      hasEarlyAccess: false,
      adFree: false,
      hasExclusivePrompts: false,
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro Creator',
    priceMonthly: 12,
    priceAnnual: 120,
    badge: 'Pro',
    features: [
      'Ad-free browsing experience',
      'Advanced prompt engineering parameters',
      'Curated negative prompt presets',
      'Unlimited saved prompt bookmarks',
      'Early access to new foundation model prompts (Veo, Sora, Flux Pro)',
    ],
    limits: {
      copiesPerDay: -1,
      hasApiAccess: true,
      hasEarlyAccess: true,
      adFree: true,
      hasExclusivePrompts: true,
    },
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Studio Master',
    priceMonthly: 29,
    priceAnnual: 290,
    badge: 'Studio',
    features: [
      'Everything in Pro tier',
      'Commercial production workflows',
      'High-resolution raw prompt seed files',
      'Direct creator prompt requests',
      'Priority REST API access for automated pipelines',
    ],
    limits: {
      copiesPerDay: -1,
      hasApiAccess: true,
      hasEarlyAccess: true,
      adFree: true,
      hasExclusivePrompts: true,
    },
  },
};
