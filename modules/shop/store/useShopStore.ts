import { getApp } from '@react-native-firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());
export interface Product {
  id: number;
  title: string;
  image: string;
  amazonLink: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
}

interface ShopState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  listenToProducts: () => () => void;
  fetchProducts: () => Promise<void>;
}

export const useShopStore = create<ShopState>((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  listenToProducts: () => {
    const ref = collection(db, 'products');
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        const products: Product[] = snapshot.docs.map((doc) => ({
          id: doc.data().id, 
          ...doc.data(),
        })) as Product[];
        set({ products });
      },
      (e) => {
        console.error('Error listening to products:', e);
      }
    );

    return unsub;
  },

  fetchProducts: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.data().id, 
        ...doc.data(),
      })) as Product[];
      set({ products });
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  },
}));
