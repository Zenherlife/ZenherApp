import { getApp } from '@react-native-firebase/app';
import { collection, getDocs, getFirestore, onSnapshot } from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  availability: string;
  languages: string[];
  education: string;
  avatar?: string;
  tagline?:string;
  about?:string;
}

interface DoctorState {
  doctors: Doctor[];
  setDoctors: (doctors: Doctor[]) => void;
  listenToDoctors: () => () => void;
  fetchDoctors: () => Promise<void>;
}

export const useDoctorDataStore = create<DoctorState>((set) => ({
  doctors: [],

  setDoctors: (doctors) => set({ doctors }),

  listenToDoctors: () => {
    const ref = collection(db, 'doctors');
    const unsub = onSnapshot(ref, (snapshot) => {
      const doctors: Doctor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[];
      set({ doctors });
    }, (e) => {
      console.error('Error listening to doctors:', e);
    });

    return unsub;
  },

  fetchDoctors: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'doctors'));
      const doctors: Doctor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[];
      set({ doctors });
    } catch (e) {
      console.error('Error fetching doctors:', e);
    }
  },
}));
