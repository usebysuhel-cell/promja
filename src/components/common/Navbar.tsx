import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Sparkles, Shield, Compass, Layers, Flame, Instagram } from 'lucide-react';
import { BRAND } from '../../config/branding';
import { authService } from '../../services/authService';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());

  useEffect(() => {
    return authService.subscribe(() => {
      setIsAdmin(authService.isAdmin());
    });
  }, []);

  const navLinks = [
    { label: 'Explore', path: '/library', icon: Compass },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Trending', path: '/trending', icon: Flame },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg py-1 px-1.5"
          aria-label={`${BRAND.brandName} Home`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-purple-300 transition-colors">
              {BRAND.brandName}
            </span>
          </div>
        </button>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/trending' && currentPath.includes('trending')) ||
              (link.path === '/categories' && currentPath.startsWith('/category'));

            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-white/10 text-neutral-400 hover:text-white hover:border-purple-500/40 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Search prompts"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search prompts...</span>
            <span className="inline sm:hidden">Search</span>
            <kbd className="hidden sm:inline-block ml-1 text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
              ⌘K
            </kbd>
          </button>

          {/* Official Instagram Link */}
          <a
            href={BRAND.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-pink-500/40 text-purple-300 hover:text-pink-300 text-xs font-medium transition-all"
            title="Official Instagram @suhel_tech"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>{BRAND.social.instagram.handle}</span>
          </a>

          {/* Admin link badge */}
          <button
            onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
            className={`p-2 rounded-lg text-xs font-medium transition-all ${
              isAdmin
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title={isAdmin ? 'Admin Dashboard' : 'Admin Login'}
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0c0d14]/98 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="px-4 pt-3 pb-6 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 text-neutral-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
              <a
                href={BRAND.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-300 text-sm font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram ({BRAND.social.instagram.handle})</span>
                </div>
                <span className="text-xs text-neutral-400">Official</span>
              </a>

              <button
                onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 text-left"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
