import type { User } from 'src/types/api';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(sessionStorage.getItem('user') || 'null'),
  setUser: (user) => {
    if (user) sessionStorage.setItem('user', JSON.stringify(user));
    else sessionStorage.removeItem('user');
    set({ user });
  },
  logout: () => {
    sessionStorage.removeItem('user');
    set({ user: null });
  },
}));
