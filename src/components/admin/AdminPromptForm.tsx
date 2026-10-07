import React, { useState, useRef } from 'react';
import { Prompt, PromptCategory, AIModel } from '../../types/prompt';
import { ALL_CATEGORIES } from '../common/CategoryPills';
import { storageService } from '../../services/storageService';
import { getActiveAITools, getModelCategory } from '../../config/aiTools';
import { X, Upload, Image, Sparkles, AlertCircle } from 'lucide-react';

interface AdminPromptFormProps {
  initialPrompt?: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'copies'>
  ) => Promise<void>;
}

export const AdminPromptForm: React.FC<AdminPromptFormProps> = ({
  initialPrompt,
  isOpen,
  onClose,
  onSave,
}) => {
  const activeTools = getActiveAITools();
  const imageTools = activeTools.filter((t) => t.category === 'Image');
  const videoTools = activeTools.filter((t) => t.category === 'Video');
  const otherTools = activeTools.filter((t) => t.category === 'Other');

  const [title, setTitle] = useState(initialPrompt?.title || '');
  const [description, setDescription] = useState(initialPrompt?.description || '');
  const [promptText, setPromptText] = useState(initialPrompt?.promptText || '');
  const [imageUrl, setImageUrl] = useState(initialPrompt?.imageUrl || '');
  const [category, setCategory] = useState<PromptCategory>(
    initialPrompt?.category || 'Cinematic'
  );
  const [aiModel, setAiModel] = useState<string>(
    initialPrompt?.aiModel || 'Midjourney'
  );
  const [tagsInput, setTagsInput] = useState(
    initialPrompt?.tags ? initialPrompt.tags.join(', ') : ''
  );
  const [published, setPublished] = useState(
    initialPrompt ? initialPrompt.published : true
  );
  const [featured, setFeatured] = useState(
    initialPrompt ? initialPrompt.featured : false
  );
  const [trending, setTrending] = useState(
    initialPrompt ? initialPrompt.trending : false
  );
  const [isPremium, setIsPremium] = useState(
    initialPrompt?.isPremium || false
  );
  const [authorId, setAuthorId] = useState(
    initialPrompt?.authorId || 'auth-promja-core'
  );
  const [authorName, setAuthorName] = useState(
    initialPrompt?.authorName || 'PROMJA Curators'
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const res = await storageService.uploadImage(file);
      setImageUrl(res.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload image';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setImageUrl(presetUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!promptText.trim()) {
      setError('Prompt text is required');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Preview image is required');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const aiModelCategory = getModelCategory(aiModel);

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        promptText: promptText.trim(),
        imageUrl: imageUrl.trim(),
        category,
        aiModel: aiModel.trim(),
        aiModelCategory,
        tags,
        authorId,
        authorName,
        creatorId: authorId,
        creatorName: authorName,
        published,
        featured,
        trending,
        isPremium,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save prompt';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const presets = storageService.getCuratedPresets();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#10111a] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialPrompt ? 'Edit Prompt' : 'Create New Prompt'}
              </h2>
              <p className="text-xs text-neutral-400">
                Author ID: <code className="text-purple-300">{authorId}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid Layout: Left Inputs, Right Image / Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyberpunk Geisha in Holographic Rain"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of the visual style and composition"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Full AI Prompt Text *
                </label>
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Paste complete prompt with parameters (e.g. --ar 16:9 --v 6.0)..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 font-mono text-xs sm:text-sm text-purple-200 border border-white/10 placeholder-neutral-600 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Category & Model Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PromptCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    {ALL_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    AI Model / Tool *
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <optgroup label="Image Generation">
                      {imageTools.map((tool) => (
                        <option key={tool.id} value={tool.name}>
                          {tool.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Video Generation">
                      {videoTools.map((tool) => (
                        <option key={tool.id} value={tool.name}>
                          {tool.name}
                        </option>
                      ))}
                    </optgroup>
                    {otherTools.length > 0 && (
                      <optgroup label="Other">
                        {otherTools.map((tool) => (
                          <option key={tool.id} value={tool.name}>
                            {tool.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="cyberpunk, neon, 85mm, futuristic, tokyo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Creator Architecture Info (V2 Ready) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Author ID
                  </label>
                  <input
                    type="text"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 text-neutral-300 text-xs border border-white/5"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 text-neutral-300 text-xs border border-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Image Storage & Toggles (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Preview Image *
                </label>

                {/* Image Preview Box */}
                <div className="relative aspect-[16/10] w-full rounded-xl bg-neutral-950 border border-white/10 overflow-hidden mb-3 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-neutral-500">
                      <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-purple-300">
                      Processing image...
                    </div>
                  )}
                </div>

                {/* Upload or URL options */}
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>Upload Image File</span>
                  </button>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste external image URL (https://...)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Quick curated presets */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1.5">
                    Or select high-res curated preset:
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {presets.slice(0, 5).map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handlePresetSelect(p.url)}
                        title={p.name}
                        className={`aspect-square rounded-lg overflow-hidden border transition-all ${
                          imageUrl === p.url
                            ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105'
                            : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/5 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Visibility & Flags
                </span>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-200">Published to Library</span>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-neutral-800 border-neutral-700"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-200">Featured on Home Page</span>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-neutral-800 border-neutral-700"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-200">Trending Badge</span>
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-neutral-800 border-neutral-700"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-white/5">
                  <div>
                    <span className="text-xs text-neutral-200 block">Mark as Premium</span>
                    <span className="text-[10px] text-neutral-400">Reserved for future Pro subscriber access</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-neutral-800 border-neutral-700"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Saving...' : initialPrompt ? 'Update Prompt' : 'Create Prompt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
