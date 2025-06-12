import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { useUserDataStore } from '../store/useUserDataStore';

export const useEmailSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { listenToUser } = useUserDataStore((state) => state);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;
      const uid = user.uid;

      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists()) {
        throw new Error('User data not found in Firestore.');
      }

      listenToUser(uid); 

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
