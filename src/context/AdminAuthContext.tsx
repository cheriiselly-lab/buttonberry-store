import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('buttonberry_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('buttonberry_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authenticated fetch wrapper
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers || {});
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return fetch(url, { ...options, headers });
    },
    [token]
  );

  // Verify session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('buttonberry_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });

        if (res.ok) {
          const user = await res.json();
          setAdminUser(user);
          setToken(storedToken);
          localStorage.setItem('buttonberry_admin_user', JSON.stringify(user));
        } else {
          // Token invalid or expired
          localStorage.removeItem('buttonberry_admin_token');
          localStorage.removeItem('buttonberry_admin_user');
          setAdminUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Backend session verification failed, falling back to cached session', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login gagal.' };
      }

      setToken(data.token);
      setAdminUser(data.admin);
      localStorage.setItem('buttonberry_admin_token', data.token);
      localStorage.setItem('buttonberry_admin_user', JSON.stringify(data.admin));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Koneksi ke server gagal: ' + err.message };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('Logout API error', err);
    } finally {
      localStorage.removeItem('buttonberry_admin_token');
      localStorage.removeItem('buttonberry_admin_user');
      setToken(null);
      setAdminUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token && !!adminUser,
        isLoading,
        login,
        logout,
        authFetch
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
