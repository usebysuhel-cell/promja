import { AIToolCategory } from '../config/aiTools';

export type PromptCategory =
  | 'All'
  | 'AI Images'
  | 'AI Video'
  | 'Portrait'
  | 'Fashion'
  | 'Cinematic'
  | 'Aesthetic'
  | 'Photography'
  | 'Product'
  | 'Architecture'
  | 'Anime'
  | 'Other';

export type AIModel = string;

export type ModerationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED';

export type UserRole = 'VISITOR' | 'USER' | 'CREATOR' | 'ADMIN';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  category: PromptCategory;
  tags: string[];
  aiModel: AIModel;
  aiModelCategory?: AIToolCategory;
  authorId: string;
  authorName: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  published: boolean;
  featured: boolean;
  trending: boolean;
  views: number;
  copies: number;
  
  // Future Creator & Moderation Architecture
  creatorId?: string;
  creatorName?: string;
  moderationStatus?: ModerationStatus;

  // Future Revenue & Premium Architecture
  isPremium?: boolean;
  price?: number;
  currency?: string;
  creatorRevenue?: number;
  platformRevenue?: number;
  totalRevenue?: number;
  revenueSharePercentage?: number;

  // Technical & Engagement Metadata
  aspectRatio?: string;
  likeCount?: number;
  favoriteCount?: number;
  commentCount?: number;
}

export interface PromptStats {
  totalPrompts: number;
  totalViews: number;
  totalCopies: number;
  publishedPrompts: number;
  featuredPrompts: number;
  trendingPrompts: number;
}

export interface PromptFilterOptions {
  category?: PromptCategory | 'All';
  aiModel?: string | 'All';
  aiModelCategory?: AIToolCategory | 'All';
  searchQuery?: string;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  publishedOnly?: boolean;
  isPremium?: boolean;
  moderationStatus?: ModerationStatus;
  sortBy?: 'trending' | 'latest' | 'popular' | 'copies' | 'views';
}

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  instagramUrl?: string;
  isVerified: boolean;
  role: UserRole;
  earnings?: number;
  totalViews?: number;
  totalCopies?: number;
  joinedAt?: string;
  createdAt: string;
}

export interface UserSavedPrompts {
  userId: string;
  favorites: string[]; // Prompt IDs
  savedCollections: { id: string; name: string; promptIds: string[] }[];
  recentlyViewed: { promptId: string; viewedAt: string }[];
}
