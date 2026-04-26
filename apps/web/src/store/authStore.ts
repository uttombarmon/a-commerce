import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  
  logout: () => {
    // Call logout API to clear HttpOnly cookie
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
  
  setAccessToken: (accessToken) => set({ accessToken }),
}));
