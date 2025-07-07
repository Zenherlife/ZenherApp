import { getApp } from '@react-native-firebase/app';
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { create } from 'zustand';

const db = getFirestore(getApp());

const useArticleStore = create((set, get) => ({
  articles: [],
  selectedArticle: null,
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

  setSelectedArticle: (article) => {
    set({ selectedArticle: article });
  },

  getArticleById: (id) => {
    const { articles } = get();
    return articles.find(article => article.id === id);
  },

  clearSelectedArticle: () => {
    set({ selectedArticle: null });
  },
}));

export default useArticleStore;