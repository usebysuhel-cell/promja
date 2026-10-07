import React from 'react';
import { X, Sparkles, Bell } from 'lucide-react';
import { BRAND } from '../../config/branding';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription?: string;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md p-6 glass-panel rounded-2xl bg-[#12131e] border border-purple-500/30 text-white shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/50 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white">{featureTitle}</h3>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
          {featureDescription ||
            `${featureTitle} is currently scheduled for the next release of ${BRAND.brandName}. The architecture is already in place and will be activated in an upcoming update.`}
        </p>

        <div className="mt-5 p-3.5 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center gap-3">
          <Bell className="w-4 h-4 text-purple-400 shrink-0" />
          <p className="text-xs text-neutral-300">
            Follow our official Instagram <span className="text-purple-300 font-semibold">{BRAND.social.instagram.handle}</span> for launch announcements.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Got it
          </button>
          <a
            href={BRAND.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2"
          >
            View Instagram
          </a>
        </div>
      </div>
    </div>
  );
};
