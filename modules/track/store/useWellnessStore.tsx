import { getApp } from '@react-native-firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp
} from '@react-native-firebase/firestore';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const db = getFirestore(getApp());

export interface WellnessEntry {
  id: string;
  date: string;
  flow?: WellnessOption;
  feelings?: WellnessOption;
  sleep?: WellnessOption;
  pain?: WellnessOption;
  energy?: WellnessOption;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WellnessOption {
  label: string;
  color: string;
  textColor: string;
}

export type WellnessCategory = 'flow' | 'feelings' | 'sleep' | 'pain' | 'energy';

export interface WellnessState {
  entries: Record<string, WellnessEntry>;
  loading: boolean;
  error: string | null;
  
  addOrUpdateEntry: (uid: string, date: string, category: WellnessCategory, option: WellnessOption) => Promise<void>;
  getEntry: (date: string) => WellnessEntry | null;
  getMonthEntries: (uid: string, month: number, year: number) => Promise<void>;
  clearEntries: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const getMonthYearKey = (month: number, year: number): string => {
  return `${String(month + 1).padStart(2, '0')}-${year}`;
};

const getEntriesCollectionPath = (uid: string, month: number, year: number): string => {
  const monthYear = getMonthYearKey(month, year);
  return `entries/${uid}/${monthYear}`;
};

const getEntryDocPath = (uid: string, month: number, year: number, date: string): string => {
  const monthYear = getMonthYearKey(month, year);
  return `entries/${uid}/${monthYear}/${date}`;
};

export const useWellnessStore = create<WellnessState>()(
  subscribeWithSelector((set, get) => ({
    entries: {},
    loading: false,
    error: null,

    setLoading: (loading: boolean) => {
      set({ loading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    addOrUpdateEntry: async (uid: string, date: string, category: WellnessCategory, option: WellnessOption) => {
      try {
        set({ loading: true, error: null });

        const dateObj = new Date(date);
        const month = dateObj.getMonth();
        const year = dateObj.getFullYear();
        
        const docPath = getEntryDocPath(uid, month, year, date);
        const entryRef = doc(db, docPath);
        
        const existingDoc = await getDoc(entryRef);
        const now = Timestamp.now();
        
        let entryData: Partial<WellnessEntry>;
        
        if (existingDoc.exists()) {
          const existingData = existingDoc.data() as WellnessEntry;
          entryData = {
            ...existingData,
            [category]: option,
            updatedAt: now,
          };
        } else {
          entryData = {
            id: date,
            date,
            [category]: option,
            createdAt: now,
            updatedAt: now,
          };
        }

        await setDoc(entryRef, entryData, { merge: true });

        const { entries } = get();
        const updatedEntry = { ...entries[date], ...entryData } as WellnessEntry;
        
        set({
          entries: {
            ...entries,
            [date]: updatedEntry,
          },
          loading: false,
        });

      } catch (error) {
        console.error('Error saving wellness entry:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to save entry',
          loading: false 
        });
      }
    },

    getEntry: (date: string) => {
      const { entries } = get();
      return entries[date] || null;
    },

    getMonthEntries: async (uid: string, month: number, year: number) => {
      try {
        const collectionPath = getEntriesCollectionPath(uid, month, year);
        const entriesRef = collection(db, collectionPath);
        const q = query(entriesRef, orderBy('date', 'asc'));

        const snapshot = await getDocs(q);
        const { entries } = get();
        const newEntries = { ...entries };

        snapshot.forEach((doc) => {
          const data = doc.data() as WellnessEntry;
          const entry = {
            ...data,
            id: doc.id,
          };
          
          newEntries[entry.date] = entry;
        });

        set({
          entries: newEntries,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching wellness entries:', error);
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch entries',
        });
      }
    },

    clearEntries: () => {
      set({
        entries: {},
        loading: false,
        error: null,
      });
    },
  }))
);

export const useWellnessEntry = (date: string) => {
  return useWellnessStore((state) => state.getEntry(date));
};

export const useWellnessLoading = () => {
  return useWellnessStore((state) => state.loading);
};

export const useWellnessError = () => {
  return useWellnessStore((state) => state.error);
};