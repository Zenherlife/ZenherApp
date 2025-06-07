import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { useAuthStore } from '../store/useAuthStore';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const navigation = useNavigation()
  const signup = async () => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      lastPeriodDate,
      reminder,
    } = useOnboardingStore.getState();

    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const user = { uid, email: email || '', displayName: name || '', photoURL: '', dateOfBirth, lastPeriodDate, reminder };
      await firestore().collection('users').doc(uid).set(user, { merge: true });
      setUser(user)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'home' }],
        })
      );
      return uid;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
  };
};
