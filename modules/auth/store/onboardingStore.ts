// stores/onboardingStore.ts
import { create } from 'zustand';

interface ReminderData {
  time: string;
  schedule: string;
  title: string;
  body: string;
}

interface OnboardingState {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  lastPeriodDate: string;
  reminder: ReminderData;

  setField: <T extends keyof OnboardingState>(field: T, value: OnboardingState[T]) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  name: '',
  email: '',
  password: '',
  dateOfBirth: '',
  lastPeriodDate: '',
  reminder: {
    time: '',
    schedule: '',
    title: '',
    body: '',
  },

  setField: (field, value) => set({ [field]: value }),
  reset: () => set({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    lastPeriodDate: '',
    reminder: {
      time: '',
      schedule: '',
      title: '',
      body: '',
    },
  }),
}));
