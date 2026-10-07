import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastProvider } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { ComingSoonModal } from './components/common/ComingSoonModal';

// Pages
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CategoriesHubPage } from './pages/CategoriesHubPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { authService } from './services/authService';
import { BRAND } from './config/branding';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname + window.location.search
  );
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(authService.isAdmin());

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    return authService.subscribe(() => {
      setIsAdminLoggedIn(authService.isAdmin());
    });
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Router navigation helper
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update dynamic document title based on route
  useEffect(() => {
    const path = currentPath.split('?')[0];
    if (path === '/') {
      document.title = `${BRAND.brandName} – ${BRAND.tagline} | AI Prompt Library`;
    } else if (path === '/library') {
      document.title = `Prompt Library – ${BRAND.brandName}`;
    } else if (path.startsWith('/category/')) {
      const cat = decodeURIComponent(path.replace('/category/', ''));
      document.title = `${cat} Prompts – ${BRAND.brandName}`;
    } else if (path === '/categories') {
      document.title = `Categories – ${BRAND.brandName}`;
    } else if (path.startsWith('/search')) {
      document.title = `Search Results – ${BRAND.brandName}`;
    } else if (path === '/about') {
      document.title = `About – ${BRAND.brandName}`;
    } else if (path === '/contact') {
      document.title = `Contact & Support – ${BRAND.brandName}`;
    } else if (path === '/privacy') {
      document.title = `Privacy Policy – ${BRAND.brandName}`;
    } else if (path === '/terms') {
      document.title = `Terms of Service – ${BRAND.brandName}`;
    } else if (path.startsWith('/admin')) {
      document.title = `Admin Portal – ${BRAND.brandName}`;
    }
  }, [currentPath]);

  // Route parser
  const renderCurrentPage = () => {
    const url = new URL(window.location.origin + currentPath);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // Home Page
    if (pathname === '/' || pathname === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      );
    }

    // Prompt Library
    if (pathname === '/library') {
      return (
        <LibraryPage
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
        />
      );
    }

    // Trending Shortcut
    if (pathname === '/trending') {
      return (
        <LibraryPage
          initialCategory="All"
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
        />
      );
    }

    // Prompt Detail Page (/prompt/:id)
    if (pathname.startsWith('/prompt/')) {
      const promptId = pathname.replace('/prompt/', '');
      return (
        <PromptDetailPage
          promptId={promptId}
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
          onTriggerComingSoon={(feature) => setComingSoonFeature(feature)}
        />
      );
    }

    // Category Hub (/categories)
    if (pathname === '/categories') {
      return <CategoriesHubPage onNavigate={navigate} />;
    }

    // Specific Category Page (/category/:name)
    if (pathname.startsWith('/category/')) {
      const categoryName = pathname.replace('/category/', '');
      return (
        <CategoryPage
          categoryName={categoryName}
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
        />
      );
    }

    // Search Results Page (/search?q=...)
    if (pathname === '/search') {
      const query = searchParams.get('q') || '';
      return (
        <SearchPage
          initialQuery={query}
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
        />
      );
    }

    // About Page
    if (pathname === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Contact Page
    if (pathname === '/contact') {
      return <ContactPage />;
    }

    // Privacy Policy
    if (pathname === '/privacy') {
      return <PrivacyPage />;
    }

    // Terms of Service
    if (pathname === '/terms') {
      return <TermsPage />;
    }

    // Admin Login Page
    if (pathname === '/admin/login') {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onNavigate={navigate}
        />
      );
    }

    // Admin Dashboard Page
    if (pathname === '/admin') {
      if (!isAdminLoggedIn) {
        return (
          <AdminLoginPage
            onLoginSuccess={() => navigate('/admin')}
            onNavigate={navigate}
          />
        );
      }
      return (
        <AdminDashboardPage
          onLogout={() => navigate('/')}
          onNavigate={navigate}
          onViewPrompt={(id) => navigate(`/prompt/${id}`)}
        />
      );
    }

    // 404 Fallback
    return <NotFoundPage onNavigate={navigate} />;
  };

  const isAdminView = currentPath.startsWith('/admin') && isAdminLoggedIn;

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#090a0f] text-neutral-100 font-sans selection:bg-purple-600/30 selection:text-purple-200">
        {/* Navigation Bar (hidden inside clean admin view for full workspace immersion) */}
        {!isAdminView && (
          <Navbar
            currentPath={currentPath}
            onNavigate={navigate}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1">{renderCurrentPage()}</main>

        {/* Footer (hidden inside admin workspace) */}
        {!isAdminView && <Footer onNavigate={navigate} />}

        {/* Global Search Modal (Cmd+K) */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectPrompt={(id) => navigate(`/prompt/${id}`)}
          onViewAllResults={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
        />

        {/* Non-dead Button "Coming Soon" Modal */}
        <ComingSoonModal
          isOpen={Boolean(comingSoonFeature)}
          onClose={() => setComingSoonFeature(null)}
          featureTitle={comingSoonFeature || 'Feature'}
        />
      </div>
    </ToastProvider>
  );
}
