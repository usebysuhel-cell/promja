import React from 'react';
import { BRAND } from '../config/branding';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Last updated: October 2026 · {BRAND.brandName} Prompt Platform
        </p>
      </div>

      <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            1. Overview
          </h2>
          <p>
            At <strong className="text-white">{BRAND.brandName}</strong>, we respect your privacy.
            This Privacy Policy explains how information is handled when you browse our prompt library,
            copy prompts, search for creative ideas, or communicate with us.
          </p>
          <p>
            We do not sell, rent, or trade your personal data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            2. Information We Collect
          </h2>
          <p>
            When using {BRAND.brandName}:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-400">
            <li>
              <strong className="text-neutral-200">Local Interaction Data:</strong> We may use browser storage
              (such as LocalStorage and SessionStorage) to store your preferences, search filters, and clipboard interactions.
            </li>
            <li>
              <strong className="text-neutral-200">Contact Submissions:</strong> If you submit a message via our contact form,
              we collect your name, email address, and message content solely to respond to your inquiry.
            </li>
            <li>
              <strong className="text-neutral-200">Aggregated Usage Metrics:</strong> Anonymous view counts and prompt copy counts
              are recorded to identify trending prompts without attaching to personally identifiable accounts.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            3. AI Prompts & Content
          </h2>
          <p>
            The prompt texts provided on {BRAND.brandName} are designed for use in third-party generative AI services
            (such as Midjourney, Flux, OpenAI, or Runway). When you copy a prompt and paste it into third-party AI tools,
            your interaction with those tools is subject to their respective terms and privacy policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Cookies and Web Storage</h2>
          <p>
            {BRAND.brandName} uses essential browser storage to remember session status and prompt catalog caching.
            We do not use invasive tracking pixels. If third-party advertising or analytics networks are integrated in the future,
            appropriate consent mechanisms will be provided according to applicable guidelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Official Social Link</h2>
          <p>
            Our website links to our official Instagram page ({BRAND.social.instagram.handle} at{' '}
            <a
              href={BRAND.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              {BRAND.social.instagram.url}
            </a>
            ). Any interactions on Instagram are governed by Meta's privacy policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Updates & Inquiries</h2>
          <p>
            We may update this policy periodically to reflect platform updates or new feature flags. For questions,
            contact us directly at{' '}
            <a href={`mailto:${BRAND.contact.email}`} className="text-purple-400 hover:underline">
              {BRAND.contact.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
