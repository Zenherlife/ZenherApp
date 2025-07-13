import { getApp } from '@react-native-firebase/app';
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, setDoc } from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());

interface ReminderData {
  time: string;
  schedule: string;
  title: string;
  body: string;
}
interface WaterData {
  goal: number;
  cupSize: number;
  customAmount: number;
  intake: number;
  history: Record<string, number>;
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
  water: WaterData;

  setField: <T extends keyof UserState>(field: T, value: UserState[T]) => void;
  updateUserData: (data: Partial<UserState>) => Promise<void>;
  setWaterField: <K extends keyof WaterData>(field: K, value: WaterData[K]) => void;
  setUser: (user: Partial<UserState> & { uid?: string }) => void;
  listenToUser: (uid: string) => () => void;
  getUser: () => Omit<UserState, 'setField' | 'setUser' | 'listenToUser' | 'reset' | 'getUser' | 'setWaterField' | 'updateUserData'>;
  reset: () => void;
}

const cleanOldWaterLogs = async (uid: string) => {
  try {
    const waterRef = collection(db, "users", uid, "water");
    const snapshot = await getDocs(waterRef);
    const now = new Date();
    const fourteenDaysAgo = new Date(now.setDate(now.getDate() - 14));

    const deletions = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const timestamp = new Date(data.timestamp);
      if (timestamp < fourteenDaysAgo) {
        await deleteDoc(doc(db, "users", uid, "water", docSnap.id));
      }
    });

    await Promise.all(deletions);
  } catch (err) {
    console.error("Error cleaning old water logs:", err);
  }
};

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
  water: {
    goal:3000,
    cupSize: 250,
    customAmount: 0, 
    intake: 0,
    history: {},
  },
  
  setField: (field, value) => set({ [field]: value }),
  
  setWaterField: <K extends keyof WaterData>(field: K, value: WaterData[K]) =>
  set((state) => ({
    water: {
      ...state.water,
      [field]: value,
    },
  })),

  setUser: async (user) => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
    } catch (error) {
      console.error('Error writing user to Firestore:', error);
    }
  },

  updateUserData: async (data: Partial<UserState>) => {
    const { uid } = get();
    if (!uid) return;

    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error('Error updating user field(s):', error);
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
              water: {
                ...state.water,
                ...(data.water || {}),
              }
            }));

            cleanOldWaterLogs(uid);
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
      water: state.water,
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
        water: {
          goal:3000,
          cupSize: 250,
          customAmount: 0, 
          intake: 0,
          history: {},
        },
    }),
}));
