import React from 'react';
import { BRAND } from '../config/branding';
import { BookOpen, ShieldAlert, CheckSquare, Sparkles } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Terms & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Last updated: October 2026 · {BRAND.brandName} Prompt Platform
        </p>
      </div>

      <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong className="text-white">{BRAND.brandName}</strong>, you agree to comply with
            these Terms of Service. If you do not agree to these terms, please do not use the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            2. Permitted Use of Prompts
          </h2>
          <p>
            {BRAND.brandName} grants you a royalty-free license to discover, copy, modify, and execute the prompts
            published in our public directory for both personal and commercial creative generative AI projects.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-400">
            <li>You may copy prompts and generate imagery/videos in your chosen AI tooling.</li>
            <li>You own the images and videos you generate according to the terms of the respective generative AI service you employ.</li>
            <li>Bulk scraping or unauthorized automated harvesting of the prompt catalog for commercial resale as a competing prompt library without attribution is prohibited.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
            3. Disclaimer Regarding AI Output
          </h2>
          <p>
            Generative AI models are stochastic by nature. While prompts featured on {BRAND.brandName} are carefully engineered
            and tested for consistent output quality, {BRAND.brandName} cannot guarantee that identical generations will be reproduced
            every time, as AI foundation models receive frequent upstream weight changes and parameter updates.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Intellectual Property</h2>
          <p>
            The branding, design, interface code, and brand marks of <strong className="text-white">{BRAND.brandName}</strong>{' '}
            are protected by copyright. Our official Instagram handle is {BRAND.social.instagram.handle}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Limitation of Liability</h2>
          <p>
            {BRAND.brandName} is provided &ldquo;as is&rdquo; without warranties of any kind. Under no circumstances
            shall the creators or maintainers of {BRAND.brandName} be liable for any direct, indirect, or incidental damages
            arising from the use or inability to use this platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Inquiries</h2>
          <p>
            For any questions regarding these Terms, please reach out via our{' '}
            <a href="/contact" className="text-purple-400 hover:underline">
              Contact Page
            </a>{' '}
            or write to {BRAND.contact.email}.
          </p>
        </section>
      </div>
    </div>
  );
};
