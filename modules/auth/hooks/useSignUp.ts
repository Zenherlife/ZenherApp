import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { useUserDataStore } from '../store/useUserDataStore';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listenToUser = useUserDataStore((state) => state.listenToUser);
  const navigation = useNavigation()
  const signup = async () => {
    const {
      displayName,
      email,
      password,
      dateOfBirth,
      lastPeriodDate,
      averageCycle,
      reminder,
    } = useUserDataStore.getState();

    setLoading(true);
    setError(null);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const user = { uid, email: email || '', displayName: displayName || '', photoURL: '', dateOfBirth, lastPeriodDate, averageCycle, reminder };
      await firestore().collection('users').doc(uid).set(user, { merge: true });
      listenToUser(uid)
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
