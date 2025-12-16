import { create } from 'zustand';
import { User, Quiz } from './types';

interface AppState {
  user: User | null;
  currentQuiz: Quiz | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: JSON.parse(localStorage.getItem('ck_auth_user') || 'null'),
  currentQuiz: null,
  loading: false,
  setUser: (user) => set({ user }),
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setLoading: (loading) => set({ loading }),
}));
