import React, { useState, useEffect } from 'react';
import { Prompt, PromptStats, PromptCategory } from '../types/prompt';
import { promptService } from '../services/promptService';
import { authService } from '../services/authService';
import { AdminStatsCard } from '../components/admin/AdminStatsCard';
import { AdminPromptForm } from '../components/admin/AdminPromptForm';
import { useToast } from '../components/common/Toast';
import { BRAND } from '../config/branding';
import { FEATURES, isFeatureEnabled } from '../config/features';
import { getAllAITools, AITool } from '../config/aiTools';
import { REVENUE_CONFIG } from '../config/revenue';
import { SUBSCRIPTION_PLANS } from '../config/subscriptions';
import { AD_SLOTS } from '../config/ads';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  FolderTree,
  Users,
  UserCheck,
  Flag,
  Megaphone,
  CreditCard,
  DollarSign,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Flame,
  Search,
  LogOut,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Shield,
  CheckCircle,
  XCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigate: (path: string) => void;
  onViewPrompt: (id: string) => void;
}

type AdminSection =
  | 'Dashboard'
  | 'Prompts'
  | 'Categories'
  | 'AI Tools'
  | 'Creators'
  | 'Users'
  | 'Reports'
  | 'Advertisements'
  | 'Subscriptions'
  | 'Revenue'
  | 'Settings';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onLogout,
  onNavigate,
  onViewPrompt,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('Prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [stats, setStats] = useState<PromptStats>({
    totalPrompts: 0,
    totalViews: 0,
    totalCopies: 0,
    publishedPrompts: 0,
    featuredPrompts: 0,
    trendingPrompts: 0,
  });
  const [categories, setCategories] = useState<{ category: PromptCategory; count: number }[]>([]);
  const [aiTools, setAiTools] = useState<AITool[]>(getAllAITools());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const { showToast } = useToast();

  const loadData = async () => {
    const [all, currentStats, cats] = await Promise.all([
      promptService.getAllPrompts({ publishedOnly: false, sortBy: 'latest' }),
      promptService.getStats(),
      promptService.getCategories(),
    ]);
    setPrompts(all);
    setStats(currentStats);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
    return promptService.subscribe(loadData);
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await promptService.togglePublish(id);
      showToast(
        updated.published ? 'Prompt published to library' : 'Prompt unpublished',
        'info'
      );
    } catch {
      showToast('Failed to toggle publish status', 'error');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const updated = await promptService.toggleFeatured(id);
      showToast(
        updated.featured ? 'Marked as Featured' : 'Removed from Featured',
        'info'
      );
    } catch {
      showToast('Failed to toggle featured status', 'error');
    }
  };

  const handleToggleTrending = async (id: string) => {
    try {
      const updated = await promptService.toggleTrending(id);
      showToast(
        updated.trending ? 'Marked as Trending' : 'Removed from Trending',
        'info'
      );
    } catch {
      showToast('Failed to toggle trending status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!promptToDelete) return;
    try {
      await promptService.deletePrompt(promptToDelete.id);
      showToast(`Deleted prompt "${promptToDelete.title}"`, 'success');
      setPromptToDelete(null);
    } catch {
      showToast('Failed to delete prompt', 'error');
    }
  };

  const handleSavePrompt = async (
    data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'copies'>
  ) => {
    if (editingPrompt) {
      await promptService.updatePrompt(editingPrompt.id, data);
      showToast('Prompt updated successfully', 'success');
    } else {
      await promptService.createPrompt(data);
      showToast('New prompt created and saved', 'success');
    }
  };

  const handleExport = async () => {
    try {
      const json = await promptService.exportToJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promja-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Catalog exported as JSON backup', 'success');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await promptService.importFromJson(text);
      showToast(`Successfully imported ${count} prompts`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      showToast(msg, 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset catalog to curated default seed prompts?')) {
      await promptService.resetToDefaults();
      showToast('Catalog reset to curated defaults', 'info');
    }
  };

  const filteredPrompts = prompts.filter((p) => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q) ||
        p.aiModel.toLowerCase().includes(q) ||
        (p.aiModelCategory && p.aiModelCategory.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Dynamic Navigation Sections based on Feature Flags (Requirement 9)
  const navSections: { id: AdminSection; label: string; icon: any; enabled: boolean }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
    { id: 'Prompts', label: 'Prompts', icon: Layers, enabled: true },
    { id: 'Categories', label: 'Categories', icon: FolderTree, enabled: true },
    { id: 'AI Tools', label: 'AI Tools', icon: Sparkles, enabled: true },
    { id: 'Creators', label: 'Creators', icon: UserCheck, enabled: isFeatureEnabled('ENABLE_CREATORS') },
    { id: 'Users', label: 'Users', icon: Users, enabled: isFeatureEnabled('ENABLE_AUTH') },
    { id: 'Reports', label: 'Reports', icon: Flag, enabled: isFeatureEnabled('ENABLE_MODERATION') },
    { id: 'Advertisements', label: 'Advertisements', icon: Megaphone, enabled: isFeatureEnabled('ENABLE_ADS') },
    { id: 'Subscriptions', label: 'Subscriptions', icon: CreditCard, enabled: isFeatureEnabled('ENABLE_SUBSCRIPTIONS') },
    { id: 'Revenue', label: 'Revenue', icon: DollarSign, enabled: isFeatureEnabled('ENABLE_CREATOR_EARNINGS') },
    { id: 'Settings', label: 'Settings', icon: Settings, enabled: true },
  ];

  const visibleNavSections = navSections.filter((s) => s.enabled);

  return (
    <div className="min-h-screen py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/20 text-purple-400">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {BRAND.brandName} Operations
          </h1>
          <p className="text-xs text-neutral-400">
            Curator Access · Centralized Catalog & Engine Configuration
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingPrompt(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Prompt</span>
          </button>

          <button
            onClick={handleExport}
            className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
            title="Export JSON backup"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <label
            className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import JSON catalog"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetDefaults}
            className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-amber-300 text-xs transition-colors"
            title="Reset to default seed catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              authService.logout();
              onLogout();
            }}
            className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:bg-rose-900/60 text-xs flex items-center gap-1.5 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Control Center Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
        {visibleNavSections.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          SECTION: DASHBOARD OVERVIEW
         ======================================================== */}
      {activeSection === 'Dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AdminStatsCard stats={stats} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditingPrompt(null);
                    setIsFormOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center justify-between"
                >
                  <span>Create New Prompt</span>
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSection('AI Tools')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5 text-xs font-semibold flex items-center justify-between"
                >
                  <span>Browse AI Tools ({aiTools.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5 text-xs font-semibold flex items-center justify-between"
                >
                  <span>Preview Live Website</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Distribution */}
            <div className="p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Active Generators
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {aiTools.slice(0, 6).map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-white">{tool.name}</span>
                    <span className="text-[10px] text-purple-400 uppercase font-bold">
                      {tool.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Status */}
            <div className="p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Platform Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Version</span>
                  <span className="text-white font-mono">1.1.0-Production</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Brand</span>
                  <span className="text-white font-semibold">{BRAND.brandName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5 text-neutral-400">
                  <span>Creator Split</span>
                  <span className="text-emerald-400 font-semibold">
                    {REVENUE_CONFIG.defaultCreatorSharePercentage}% Creator / {REVENUE_CONFIG.defaultPlatformSharePercentage}% Platform
                  </span>
                </div>
                <div className="flex justify-between py-1 text-neutral-400">
                  <span>Database State</span>
                  <span className="text-emerald-400 font-semibold">Healthy (Persistent)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION: PROMPTS TABLE
         ======================================================== */}
      {activeSection === 'Prompts' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <AdminStatsCard stats={stats} />

          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts in database by title, model, tags..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#12131e] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#12131e] border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>

              <span className="text-xs text-neutral-400">
                {filteredPrompts.length} of {prompts.length}
              </span>
            </div>
          </div>

          {/* Prompts Data Table */}
          <div className="rounded-2xl bg-[#11121c] border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-neutral-300">
                <thead className="bg-[#0b0c13] text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="px-4 py-3.5">Prompt</th>
                    <th className="px-4 py-3.5">AI Model / Tool</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                    <th className="px-4 py-3.5 text-center">Featured</th>
                    <th className="px-4 py-3.5 text-center">Trending</th>
                    <th className="px-4 py-3.5 text-right">Views / Copies</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredPrompts.map((prompt) => (
                    <tr key={prompt.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Title & Preview Image */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 max-w-xs sm:max-w-sm">
                          <img
                            src={prompt.imageUrl}
                            alt={prompt.title}
                            className="w-12 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate text-xs sm:text-sm">
                              {prompt.title}
                            </p>
                            <p className="font-mono text-[10px] text-neutral-500 truncate mt-0.5">
                              ID: {prompt.id} · Creator: {prompt.creatorName || prompt.authorName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Model & Category */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            {prompt.aiModel}
                            {prompt.aiModelCategory && (
                              <span className="text-[9px] font-bold uppercase text-purple-400 px-1 py-0.2 rounded bg-purple-950/40 border border-purple-500/20">
                                {prompt.aiModelCategory}
                              </span>
                            )}
                          </span>
                          <span className="block text-[11px] text-neutral-400 mt-0.5">{prompt.category}</span>
                        </div>
                      </td>

                      {/* Published Toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleTogglePublish(prompt.id)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                            prompt.published
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          }`}
                          title={prompt.published ? 'Published. Click to unpublish' : 'Unpublished. Click to publish'}
                        >
                          {prompt.published ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-neutral-400" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleFeatured(prompt.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prompt.featured
                              ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title={prompt.featured ? 'Featured on Home. Click to unfeature' : 'Not featured. Click to feature'}
                        >
                          <Star className={`w-4 h-4 ${prompt.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Trending Toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleTrending(prompt.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prompt.trending
                              ? 'text-rose-400 bg-rose-400/10 hover:bg-rose-400/20'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title={prompt.trending ? 'Marked trending. Click to remove' : 'Not trending. Click to mark trending'}
                        >
                          <Flame className={`w-4 h-4 ${prompt.trending ? 'fill-rose-400' : ''}`} />
                        </button>
                      </td>

                      {/* Views / Copies */}
                      <td className="px-4 py-3.5 text-right font-mono text-xs">
                        <div className="flex items-center justify-end gap-2 text-neutral-400">
                          <span className="flex items-center gap-0.5" title="Views">
                            <Eye className="w-3 h-3" />
                            {prompt.views}
                          </span>
                          <span>/</span>
                          <span className="flex items-center gap-0.5 text-purple-300" title="Copies">
                            <Copy className="w-3 h-3" />
                            {prompt.copies}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPrompt(prompt.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="View Public Detail"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingPrompt(prompt);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                            title="Edit Prompt"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setPromptToDelete(prompt)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Prompt"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION: CATEGORIES OVERVIEW
         ======================================================== */}
      {activeSection === 'Categories' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Category Distribution</h2>
              <p className="text-xs text-neutral-400">Browse prompt counts across curated creative disciplines.</p>
            </div>
            <button
              onClick={() => onNavigate('/categories')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View Public Category Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div
                key={c.category}
                className="p-5 rounded-2xl bg-[#11121c] border border-white/[0.08] flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{c.category}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{c.count} active prompts</p>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory(c.category);
                    setActiveSection('Prompts');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/5 text-[11px] text-purple-300 hover:text-white transition-colors"
                >
                  Filter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION: AI TOOLS MANAGEMENT
         ======================================================== */}
      {activeSection === 'AI Tools' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">AI Tools & Foundation Models</h2>
              <p className="text-xs text-neutral-400">
                Centralized registry from <code className="text-purple-300">src/config/aiTools.ts</code> for image & video engines.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-xl border border-white/5">
              {aiTools.length} Total Tools
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiTools.map((tool) => (
              <div
                key={tool.id}
                className="p-5 rounded-2xl bg-[#11121c] border border-white/[0.08] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{tool.name}</span>
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        tool.category === 'Video'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Active in catalog
                  </span>
                  <span className="font-mono text-neutral-400">ID: {tool.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION: SETTINGS & FEATURE FLAGS
         ======================================================== */}
      {activeSection === 'Settings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h2 className="text-xl font-bold text-white">System Settings & Feature Flags</h2>
            <p className="text-xs text-neutral-400">
              Centralized platform configuration, branding, and monetization controls.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branding Overview */}
            <div className="p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Brand Configuration (src/config/branding.ts)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Brand Name</span>
                  <span className="text-white font-semibold">{BRAND.brandName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Tagline</span>
                  <span className="text-white font-semibold">&ldquo;{BRAND.tagline}&rdquo;</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Official Instagram</span>
                  <a
                    href={BRAND.social.instagram.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-300 hover:underline font-semibold"
                  >
                    {BRAND.social.instagram.handle}
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Primary Accent</span>
                  <span className="text-white font-mono">{BRAND.colors.accent}</span>
                </div>
              </div>
            </div>

            {/* Creator Revenue Architecture */}
            <div className="p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Creator Revenue Architecture (src/config/revenue.ts)
              </h3>
              <p className="text-xs text-neutral-400">
                Configured splits for future creator marketplace monetization.
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Creator Share</span>
                  <span className="text-emerald-400 font-bold">
                    {REVENUE_CONFIG.defaultCreatorSharePercentage}%
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Platform Share</span>
                  <span className="text-purple-400 font-bold">
                    {REVENUE_CONFIG.defaultPlatformSharePercentage}%
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Default Currency</span>
                  <span className="text-white font-mono">{REVENUE_CONFIG.currency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-neutral-400">Min Payout Threshold</span>
                  <span className="text-white font-mono">${REVENUE_CONFIG.minPayoutThreshold}</span>
                </div>
              </div>
            </div>

            {/* Central Feature Flags Monitor */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#11121c] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Central Feature Flags (src/config/features.ts)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Toggle future modules from false to true to activate without rebuilding.
                  </p>
                </div>
                <span className="text-xs text-neutral-400 font-mono">11 Modular Flags</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(FEATURES).map(([flag, enabled]) => (
                  <div
                    key={flag}
                    className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-neutral-300 text-[11px] truncate">{flag}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enabled
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal Form */}
      <AdminPromptForm
        isOpen={isFormOpen}
        initialPrompt={editingPrompt}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
      />

      {/* Delete Confirmation Modal */}
      {promptToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#12131e] border border-rose-500/30 text-white shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-white">Delete Prompt</h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete &ldquo;
              <strong className="text-white">{promptToDelete.title}</strong>&rdquo;?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPromptToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
