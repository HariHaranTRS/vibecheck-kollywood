import { create } from 'zustand';
import { User, Quiz } from './types';

interface AppState {
  user: User | null;
  currentQuiz: Quiz | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: JSON.parse(localStorage.getItem('ck_user') || 'null'),
  currentQuiz: null,
  loading: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('ck_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ck_user');
    }
    set({ user });
  },

  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setLoading: (loading) => set({ loading }),

  logout: () => {
    localStorage.removeItem('ck_user');
    set({ user: null, currentQuiz: null });
  },
}));
