import firestore from '@react-native-firebase/firestore';
import { create } from 'zustand';

interface ReminderData {
  time: string;
  schedule: string;
  title: string;
  body: string;
}

interface UserState {
  uid: string,
  photoURL?: string,
  displayName: string;
  email: string;
  password?: string;
  dateOfBirth: string;
  lastPeriodDate: string;
  averageCycle: number;
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
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(user, { merge: true });
    } catch (error) {
      console.error('Error writing user to Firestore:', error);
    }
  },

  listenToUser: (uid: string) => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
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

    return unsubscribe;
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
        reminder: {
          time: '',
          schedule: '',
          title: '',
          body: '',
        },
    }),
}));
