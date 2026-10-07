import {
  Prompt,
  PromptFilterOptions,
  PromptStats,
  PromptCategory,
  AIModel,
  UserSavedPrompts,
} from '../types/prompt';
import { INITIAL_PROMPTS } from '../data/seedPrompts';
import { getActiveAITools, getAllAITools, getModelCategory, AITool } from '../config/aiTools';
import { REVENUE_CONFIG } from '../config/revenue';

export interface IPromptService {
  // Core API-ready methods
  getPrompts(filter?: PromptFilterOptions): Promise<Prompt[]>;
  getAllPrompts(filter?: PromptFilterOptions): Promise<Prompt[]>; // Backward-compatibility alias
  getPromptById(id: string): Promise<Prompt | null>;
  searchPrompts(query: string, filter?: PromptFilterOptions): Promise<Prompt[]>;
  getCategories(): Promise<{ category: PromptCategory; count: number }[]>;
  getAITools(): Promise<AITool[]>;
  createPrompt(
    promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'copies'>
  ): Promise<Prompt>;
  updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt>;
  deletePrompt(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<void>;
  incrementCopies(id: string): Promise<void>;

  // Management & Flags
  togglePublish(id: string): Promise<Prompt>;
  toggleFeatured(id: string): Promise<Prompt>;
  toggleTrending(id: string): Promise<Prompt>;
  getStats(): Promise<PromptStats>;

  // User Saved Prompts & History (Architecture Preparation)
  getUserSavedPrompts(userId?: string): Promise<UserSavedPrompts>;
  toggleSavePrompt(promptId: string, userId?: string): Promise<boolean>;

  // Data Lifecycle & Reactivity
  subscribe(callback: () => void): () => void;
  resetToDefaults(): Promise<void>;
  exportToJson(): Promise<string>;
  importFromJson(jsonStr: string): Promise<number>;
}

const STORAGE_KEY = 'promja_prompts_db_v1';
const SAVED_STORAGE_KEY = 'promja_user_saved_v1';

export class LocalStoragePromptService implements IPromptService {
  private listeners: Set<() => void> = new Set();

  private loadFromStorage(): Prompt[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure every loaded prompt has aiModelCategory
          return parsed.map((p) => ({
            ...p,
            aiModelCategory: p.aiModelCategory || getModelCategory(p.aiModel || ''),
            creatorId: p.creatorId || p.authorId || 'auth-promja-core',
            creatorName: p.creatorName || p.authorName || 'PROMJA Curators',
            moderationStatus: p.moderationStatus || 'PUBLISHED',
            isPremium: p.isPremium ?? false,
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse prompts from localStorage, using seed defaults', e);
    }
    // Default seed
    this.saveToStorage(INITIAL_PROMPTS);
    return INITIAL_PROMPTS;
  }

  private saveToStorage(prompts: Prompt[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save prompts to localStorage', e);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Primary API-ready retrieval method
   */
  async getPrompts(filter?: PromptFilterOptions): Promise<Prompt[]> {
    let items = this.loadFromStorage();

    if (!filter) return items;

    // Filter by published unless admin explicitly requests all
    if (filter.publishedOnly !== false) {
      items = items.filter((p) => p.published);
    }

    // Moderation filter
    if (filter.moderationStatus) {
      items = items.filter((p) => p.moderationStatus === filter.moderationStatus);
    }

    if (filter.category && filter.category !== 'All') {
      items = items.filter(
        (p) => p.category.toLowerCase() === filter.category?.toLowerCase()
      );
    }

    if (filter.aiModel && filter.aiModel !== 'All') {
      items = items.filter(
        (p) => p.aiModel.toLowerCase() === filter.aiModel?.toLowerCase()
      );
    }

    if (filter.aiModelCategory && filter.aiModelCategory !== 'All') {
      items = items.filter((p) => p.aiModelCategory === filter.aiModelCategory);
    }

    if (filter.featuredOnly) {
      items = items.filter((p) => p.featured);
    }

    if (filter.trendingOnly) {
      items = items.filter((p) => p.trending);
    }

    if (filter.isPremium !== undefined) {
      items = items.filter((p) => Boolean(p.isPremium) === filter.isPremium);
    }

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      items = items.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.aiModel.toLowerCase().includes(q) ||
          (p.aiModelCategory && p.aiModelCategory.toLowerCase().includes(q)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    // Sort
    const sort = filter.sortBy || 'trending';
    items.sort((a, b) => {
      if (sort === 'trending') {
        if (a.trending !== b.trending) return a.trending ? -1 : 1;
        return (b.copies || 0) + (b.views || 0) - ((a.copies || 0) + (a.views || 0));
      }
      if (sort === 'popular' || sort === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sort === 'copies') {
        return (b.copies || 0) - (a.copies || 0);
      }
      if (sort === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return items;
  }

  // Backward-compatibility alias
  async getAllPrompts(filter?: PromptFilterOptions): Promise<Prompt[]> {
    return this.getPrompts(filter);
  }

  async getPromptById(id: string): Promise<Prompt | null> {
    const items = this.loadFromStorage();
    const prompt = items.find((p) => p.id === id);
    return prompt || null;
  }

  async searchPrompts(query: string, filter?: PromptFilterOptions): Promise<Prompt[]> {
    return this.getPrompts({
      ...filter,
      searchQuery: query,
    });
  }

  async getAITools(): Promise<AITool[]> {
    return getAllAITools();
  }

  async createPrompt(
    promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'copies'>
  ): Promise<Prompt> {
    const items = this.loadFromStorage();
    const now = new Date().toISOString();
    
    // Automatically infer model category if omitted
    const modelCategory =
      promptData.aiModelCategory || getModelCategory(promptData.aiModel || '');

    const newPrompt: Prompt = {
      ...promptData,
      id: `pr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      aiModelCategory: modelCategory,
      authorId: promptData.authorId || 'auth-promja-core',
      authorName: promptData.authorName || 'PROMJA Curators',
      creatorId: promptData.creatorId || promptData.authorId || 'auth-promja-core',
      creatorName: promptData.creatorName || promptData.authorName || 'PROMJA Curators',
      moderationStatus: promptData.moderationStatus || 'PUBLISHED',
      isPremium: promptData.isPremium ?? false,
      creatorRevenue: promptData.creatorRevenue ?? 0,
      platformRevenue: promptData.platformRevenue ?? 0,
      totalRevenue: promptData.totalRevenue ?? 0,
      revenueSharePercentage:
        promptData.revenueSharePercentage ?? REVENUE_CONFIG.defaultCreatorSharePercentage,
      createdAt: now,
      updatedAt: now,
      views: 0,
      copies: 0,
    };

    items.unshift(newPrompt);
    this.saveToStorage(items);
    return newPrompt;
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    const items = this.loadFromStorage();
    const index = items.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Prompt with id ${id} not found.`);
    }

    const current = items[index];
    const aiModel = updates.aiModel || current.aiModel;
    const aiModelCategory =
      updates.aiModelCategory ||
      (updates.aiModel ? getModelCategory(updates.aiModel) : current.aiModelCategory);

    const updated: Prompt = {
      ...current,
      ...updates,
      aiModel,
      aiModelCategory,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updated;
    this.saveToStorage(items);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    const items = this.loadFromStorage();
    const filtered = items.filter((p) => p.id !== id);
    if (filtered.length === items.length) return false;
    this.saveToStorage(filtered);
    return true;
  }

  async togglePublish(id: string): Promise<Prompt> {
    const prompt = await this.getPromptById(id);
    if (!prompt) throw new Error('Prompt not found');
    return this.updatePrompt(id, { published: !prompt.published });
  }

  async toggleFeatured(id: string): Promise<Prompt> {
    const prompt = await this.getPromptById(id);
    if (!prompt) throw new Error('Prompt not found');
    return this.updatePrompt(id, { featured: !prompt.featured });
  }

  async toggleTrending(id: string): Promise<Prompt> {
    const prompt = await this.getPromptById(id);
    if (!prompt) throw new Error('Prompt not found');
    return this.updatePrompt(id, { trending: !prompt.trending });
  }

  async incrementViews(id: string): Promise<void> {
    const items = this.loadFromStorage();
    const index = items.findIndex((p) => p.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        views: (items[index].views || 0) + 1,
      };
      this.saveToStorage(items);
    }
  }

  async incrementCopies(id: string): Promise<void> {
    const items = this.loadFromStorage();
    const index = items.findIndex((p) => p.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        copies: (items[index].copies || 0) + 1,
      };
      this.saveToStorage(items);
    }
  }

  async getStats(): Promise<PromptStats> {
    const items = this.loadFromStorage();
    return {
      totalPrompts: items.length,
      totalViews: items.reduce((sum, p) => sum + (p.views || 0), 0),
      totalCopies: items.reduce((sum, p) => sum + (p.copies || 0), 0),
      publishedPrompts: items.filter((p) => p.published).length,
      featuredPrompts: items.filter((p) => p.featured).length,
      trendingPrompts: items.filter((p) => p.trending).length,
    };
  }

  async getCategories(): Promise<{ category: PromptCategory; count: number }[]> {
    const items = this.loadFromStorage().filter((p) => p.published);
    const categoryMap: Record<string, number> = {};

    items.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    const categories: PromptCategory[] = [
      'AI Images',
      'AI Video',
      'Portrait',
      'Fashion',
      'Cinematic',
      'Aesthetic',
      'Photography',
      'Product',
      'Architecture',
      'Anime',
      'Other',
    ];

    return categories.map((cat) => ({
      category: cat,
      count: categoryMap[cat] || 0,
    }));
  }

  // User Saved Prompts Architecture
  async getUserSavedPrompts(userId: string = 'guest-local'): Promise<UserSavedPrompts> {
    try {
      const raw = localStorage.getItem(`${SAVED_STORAGE_KEY}_${userId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      userId,
      favorites: [],
      savedCollections: [],
      recentlyViewed: [],
    };
  }

  async toggleSavePrompt(promptId: string, userId: string = 'guest-local'): Promise<boolean> {
    const current = await this.getUserSavedPrompts(userId);
    const exists = current.favorites.includes(promptId);
    let updatedFavorites: string[];

    if (exists) {
      updatedFavorites = current.favorites.filter((id) => id !== promptId);
    } else {
      updatedFavorites = [...current.favorites, promptId];
    }

    const updated: UserSavedPrompts = {
      ...current,
      favorites: updatedFavorites,
    };

    try {
      localStorage.setItem(`${SAVED_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
    } catch {}

    return !exists;
  }

  async resetToDefaults(): Promise<void> {
    this.saveToStorage(INITIAL_PROMPTS);
  }

  async exportToJson(): Promise<string> {
    const items = this.loadFromStorage();
    return JSON.stringify(items, null, 2);
  }

  async importFromJson(jsonStr: string): Promise<number> {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: expected an array of prompts');
    }
    this.saveToStorage(data);
    return data.length;
  }
}

// Single active instance
export const promptService: IPromptService = new LocalStoragePromptService();

// Standalone function exports matching API-ready architecture (Requirement 12)
export const getPrompts = (filter?: PromptFilterOptions) => promptService.getPrompts(filter);
export const getPromptById = (id: string) => promptService.getPromptById(id);
export const searchPrompts = (query: string, filter?: PromptFilterOptions) =>
  promptService.searchPrompts(query, filter);
export const getCategories = () => promptService.getCategories();
export const getAITools = () => promptService.getAITools();
export const createPrompt = (data: any) => promptService.createPrompt(data);
export const updatePrompt = (id: string, updates: any) =>
  promptService.updatePrompt(id, updates);
export const deletePrompt = (id: string) => promptService.deletePrompt(id);
export const incrementViews = (id: string) => promptService.incrementViews(id);
export const incrementCopies = (id: string) => promptService.incrementCopies(id);
