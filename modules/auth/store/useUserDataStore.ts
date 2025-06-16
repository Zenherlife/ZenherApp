import { getApp } from '@react-native-firebase/app';
import { doc, getFirestore, onSnapshot, setDoc } from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());

interface ReminderData {
  time: string;
  schedule: string;
  title: string;
  body: string;
}

export interface UserState {
  uid: string,
  photoURL?: string,
  displayName: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  lastPeriodDate: string;
  averageCycle: number;
  weight: number;
  height: number;
  reminder: ReminderData;

  setField: <T extends keyof UserState>(field: T, value: UserState[T]) => void;
  setUser: (user: Partial<UserState> & { uid?: string }) => void;
  listenToUser: (uid: string) => () => void;
  getUser: () => Omit<UserState, 'setField' | 'setUser' | 'listenToUser' | 'reset' | 'getUser'>;
  reset: () => void;
}

export const useUserDataStore = create<UserState>((set, get) => ({
  uid: '',
  photoURL: '',
  displayName: '',
  email: '',
  password: '',
  dateOfBirth: '',
  lastPeriodDate: '',
  averageCycle: 0,
  height: 0,
  weight: 0,
  reminder: {
    time: '',
    schedule: '',
    title: '',
    body: '',
  },

  setField: (field, value) => set({ [field]: value }),

  setUser: async (user) => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
    } catch (error) {
      console.error('Error writing user to Firestore:', error);
    }
  },
  
  listenToUser: (uid: string) => {
    const unsub = onSnapshot(
      doc(db, 'users', uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            set((state) => ({
              ...state,
              ...data,
              reminder: {
                ...state.reminder,
                ...(data.reminder || {}),
              },
            }));
          }
        }
      },
      (error) => {
        console.error('Realtime Firestore error:', error);
      }
    );

    return unsub;
  },

  getUser: () => {
    const state = get();
    return {
      uid: state.uid,
      photoURL: state.photoURL,
      displayName: state.displayName,
      email: state.email,
      password: state.password,
      dateOfBirth: state.dateOfBirth,
      lastPeriodDate: state.lastPeriodDate,
      averageCycle: state.averageCycle,
      height: state.height,
      weight: state.weight,
      reminder: state.reminder,
    };
  },

  reset: () =>
    set({
        uid: '',
        photoURL: '',
        displayName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        lastPeriodDate: '',
        averageCycle: 0,
        height: 0,
        weight: 0,
        reminder: {
          time: '',
          schedule: '',
          title: '',
          body: '',
        },
    }),
}));
