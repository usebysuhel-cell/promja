import React, { useState } from 'react';
import { authService, EXPECTED_ADMIN_PASSWORD } from '../services/authService';
import { BRAND } from '../config/branding';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Eye, EyeOff, Info } from 'lucide-react';
import { useToast } from '../components/common/Toast';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await authService.login(password);
      if (result.success) {
        showToast('Authenticated successfully as Admin', 'success', 'Welcome');
        onLoginSuccess();
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Logo / Badge */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white mb-3 shadow-xl shadow-purple-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {BRAND.brandName} Admin Portal
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Secure prompt management, moderation, and curator analytics.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-[#11121d] border border-purple-500/25 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret admin key..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick setup hint */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>Security Configuration</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Admin credentials are configured via <code className="text-purple-300">VITE_ADMIN_PASSWORD</code> in your environment variables.
              Default local fallback: <code className="text-white bg-neutral-800 px-1 py-0.5 rounded font-mono select-all">{EXPECTED_ADMIN_PASSWORD}</code>.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            ← Return to {BRAND.brandName} Home
          </button>
        </div>
      </div>
    </div>
  );
};
