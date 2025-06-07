import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ReminderData = {
  time: string;
  schedule: string;
  title: string;
  body: string;
} | null;

type User = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  dateOfBirth: string;
  lastPeriodDate: string;
  reminder: ReminderData;
} | null;

interface AuthState {
  user: User;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  updateUser: (partialUser: Partial<NonNullable<User>>) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      updateUser: (partialUser) =>
        set((state) => {
          const defaultUser: User = {
            uid: '',
            email: '',
            displayName: '',
            photoURL: '',
            dateOfBirth: '',
            lastPeriodDate: '',
            reminder: null,
          };

          const newUser = state.user
            ? { ...state.user, ...partialUser }
            : { ...defaultUser, ...partialUser };

          return {
            user: newUser,
            isLoggedIn: true,
          };
        }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
