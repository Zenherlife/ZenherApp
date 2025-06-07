import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useEmailSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const uid = userCredential.user.uid;

      // Fetch user data from Firestore
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new Error('User data not found in Firestore.');
      }

      const userData = userDoc.data();

      // Save user data in auth store
      setUser({ uid, email: userCredential.user.email || '', ...userData });

      return uid;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    loading,
    error,
  };
};
