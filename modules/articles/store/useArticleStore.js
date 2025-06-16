import { getApp } from '@react-native-firebase/app';
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());

const useArticleStore = create((set) => ({
  articles: [],
  loading: false,
  error: null,

  fetchArticles: async () => {
    set({ loading: true, error: null });
    try {
      const ref = collection(db, 'articles');
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ articles: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useArticleStore;
