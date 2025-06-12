import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { useUserDataStore } from '../store/useUserDataStore';

export default function useGoogleAuth() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { listenToUser } = useUserDataStore((state) => state);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo?.data?.idToken;

      if (!idToken) throw new Error('ID token is undefined — check your configuration');

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userData = await auth().signInWithCredential(googleCredential);

      const { uid, email, displayName, photoURL } = userData.user;

      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists()) {
        const newUser = {
          uid,
          email: email || '',
          displayName: displayName || '',
          photoURL: photoURL || '',
          name: '',
          password: '',
          dateOfBirth: '',
          lastPeriodDate: '',
          averageCycle: 0,
          reminder: {
            time: '',
            schedule: '',
            title: '',
            body: '',
          },
        };

        await userRef.set(newUser);
      }

      listenToUser(uid);

      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    } catch (error: any) {
      console.log('Google Sign-In Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
}
