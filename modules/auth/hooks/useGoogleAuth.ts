import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function useGoogleAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const updateUser = useAuthStore((state) => state.updateUser);

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

      const userDoc = await firestore().collection('users').doc(uid).get();

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUser(data);
      } else {
        const newUser = {
          uid,
          email,
          displayName: displayName || '',
          photoURL: photoURL || '',
        };

        await firestore().collection('users').doc(uid).set(newUser);
        updateUser(newUser);
      }

      router.replace('/home');
    } catch (error: any) {
      console.log('Google Sign-In Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
}
