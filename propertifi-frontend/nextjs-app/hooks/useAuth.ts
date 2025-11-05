import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth';
import * as authApi from '@/lib/auth-api';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setAuth: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true
        });
      },

      clearAuth: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false
        });
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          console.log('[useAuth] Starting login for:', email);
          const response = await authApi.login({ email, password });
          console.log('[useAuth] Login response received:', response);

          set({
            token: response.access_token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log('[useAuth] Auth state updated, token:', response.access_token?.substring(0, 20) + '...');
        } catch (error) {
          console.error('[useAuth] Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
          set({ isLoading: true });
          const response = await authApi.register({
            name,
            email,
            password,
            password_confirmation,
          });

          set({
            token: response.access_token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) {
            await authApi.logout(token);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const user = await authApi.getUser(token);
          set({ user });
        } catch (error) {
          // Token might be invalid, clear auth
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'propertifi-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
