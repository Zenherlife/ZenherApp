import { getApp } from '@react-native-firebase/app';
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WellnessOption {
  label: string;
  color: string;
  textColor: string;
}

export type WellnessCategory = 'flow' | 'feelings' | 'sleep';

export interface WellnessState {
  entries: Record<string, WellnessEntry>;
  currentMonthEntries: WellnessEntry[];
  loading: boolean;
  error: string | null;
  
  currentMonth: number;
  currentYear: number;
  
  setCurrentMonth: (month: number, year: number) => void;
  addOrUpdateEntry: (uid: string, date: string, category: WellnessCategory, option: WellnessOption) => Promise<void>;
  getEntry: (date: string) => WellnessEntry | null;
  subscribeToMonth: (uid: string, month: number, year: number) => () => void;
  clearEntries: () => void;
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
    currentMonthEntries: [],
    loading: false,
    error: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),

    setCurrentMonth: (month: number, year: number) => {
      set({ currentMonth: month, currentYear: year });
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

    subscribeToMonth: (uid: string, month: number, year: number) => {
      const collectionPath = getEntriesCollectionPath(uid, month, year);
      const entriesRef = collection(db, collectionPath);
      const q = query(entriesRef, orderBy('date', 'asc'));

      set({ loading: true });

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const entries: Record<string, WellnessEntry> = {};
          const currentMonthEntries: WellnessEntry[] = [];

          snapshot.forEach((doc) => {
            const data = doc.data() as WellnessEntry;
            const entry = {
              ...data,
              id: doc.id,
            };
            
            entries[entry.date] = entry;
            currentMonthEntries.push(entry);
          });

          set({
            entries,
            currentMonthEntries,
            loading: false,
            error: null,
          });

        },
        (error) => {
          console.error('Error subscribing to wellness entries:', error);
          set({
            error: error.message,
            loading: false,
          });
        }
      );

      return unsubscribe;
    },

    clearEntries: () => {
      set({
        entries: {},
        currentMonthEntries: [],
        loading: false,
        error: null,
      });
    },
  }))
);

export const useWellnessEntry = (date: string) => {
  return useWellnessStore((state) => state.getEntry(date));
};

export const useCurrentMonthEntries = () => {
  return useWellnessStore((state) => state.currentMonthEntries);
};

export const useWellnessLoading = () => {
  return useWellnessStore((state) => state.loading);
};

export const useWellnessError = () => {
  return useWellnessStore((state) => state.error);
};