import React, { useState } from 'react';
import { BRAND } from '../config/branding';
import { Mail, Instagram, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast('Thank you! Your message has been received.', 'success', 'Message Sent');
    }, 600);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 mb-4">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>Get In Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact <span className="gradient-text">{BRAND.brandName}</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-400">
          Have a question, prompt recommendation, partnership request, or feedback? Send us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Info & Social (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Instagram Card */}
          <div className="p-6 rounded-3xl bg-[#12131e] border border-white/[0.08] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Official Instagram</h3>
              <p className="text-xs text-neutral-400 mt-1">
                For prompt drops, visual discussions, and instant DM inquiries:
              </p>
            </div>
            <a
              href={BRAND.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-pink-300 transition-colors"
            >
              <span>{BRAND.social.instagram.handle}</span>
            </a>
          </div>

          {/* Email Info */}
          <div className="p-6 rounded-3xl bg-[#12131e] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Direct Email</h3>
              <p className="text-xs text-neutral-400 mt-1">
                For copyright, legal, or enterprise inquiries:
              </p>
            </div>
            <a
              href={`mailto:${BRAND.contact.email}`}
              className="text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors"
            >
              {BRAND.contact.email}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-900/50 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Prompt Submissions</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If you have engineered unique Midjourney v6, Flux, or Sora prompts you would like featured in PROMJA, choose &ldquo;Prompt Submission&rdquo; in the form.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#11121d] border border-purple-500/20 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Received</h3>
                <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                  Thank you for reaching out. A curator from {BRAND.brandName} will review your inquiry shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setName('');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Send a Message</h3>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Prompt Submission">Prompt Submission</option>
                    <option value="Model Request">New Model Request</option>
                    <option value="Feedback & Bug">Feedback / Bug Report</option>
                    <option value="Partnership">Collaboration & Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your request or paste your suggested prompt details..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
