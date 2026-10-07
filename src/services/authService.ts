/**
 * PROMJA - Authentication Service
 * 
 * Supports Admin access control and establishes the role-based foundation
 * for future Creator and User accounts (V2 architecture).
 * Secrets are configured via environment variables (VITE_ADMIN_PASSWORD).
 */

export interface UserSession {
  id: string;
  role: 'admin' | 'creator' | 'user';
  name: string;
  email?: string;
  token: string;
  expiresAt: number;
}

export interface IAuthService {
  login(password: string, username?: string): Promise<{ success: boolean; error?: string }>;
  logout(): void;
  isAuthenticated(): boolean;
  isAdmin(): boolean;
  getSession(): UserSession | null;
  subscribe(callback: () => void): () => void;
}

const SESSION_KEY = 'promja_admin_session';

// Environment variable override with default for initial out-of-the-box setup
// Production recommendation: set VITE_ADMIN_PASSWORD in environment settings.
const EXPECTED_ADMIN_PASSWORD =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD) ||
  'promja2026!';

export class AuthService implements IAuthService {
  private listeners: Set<() => void> = new Set();

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getSession(): UserSession | null {
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      if (!data) return null;
      const session: UserSession = JSON.parse(data);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  isAdmin(): boolean {
    const session = this.getSession();
    return session?.role === 'admin';
  }

  async login(password: string, _username?: string): Promise<{ success: boolean; error?: string }> {
    // Artificial small delay to prevent brute-force timing attacks
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!password || password.trim() === '') {
      return { success: false, error: 'Password is required' };
    }

    if (password === EXPECTED_ADMIN_PASSWORD) {
      const session: UserSession = {
        id: 'auth-promja-admin',
        role: 'admin',
        name: 'PROMJA Lead Curator',
        email: 'admin@promja.com',
        token: `token_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24-hour session
      };

      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        this.notify();
        return { success: true };
      } catch (e) {
        return { success: false, error: 'Failed to write session storage' };
      }
    }

    return { success: false, error: 'Invalid password. Please check credentials.' };
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.notify();
  }
}

export const authService: IAuthService = new AuthService();
export { EXPECTED_ADMIN_PASSWORD };
