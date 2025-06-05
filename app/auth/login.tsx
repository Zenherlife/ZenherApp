import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation, useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const router = useRouter()

  GoogleSignin.configure({
    webClientId: '646539268053-8fp7icsebfmut1k3elqt4ll38754oiko.apps.googleusercontent.com',
  });


  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo?.data?.idToken;

      if (!idToken) throw new Error('ID token is undefined — check your configuration');

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userData = await auth().signInWithCredential(googleCredential);

      if (userData.user) {
        const { uid, email, displayName, photoURL } = userData.user;
        await AsyncStorage.setItem('@user', JSON.stringify({ uid, email, displayName, photoURL }));
        await firestore().collection('users').doc(uid).set({
          uid,
          email: email || '',
          displayName: displayName || '',
          photoURL: photoURL || '',
        });
        navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
        });
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <View className="flex-1 bg-black items-center px-5 pt-24">
      <TouchableOpacity className="absolute top-12 left-5">
        <Text className="text-white text-2xl">←</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: 'https://res.cloudinary.com/denlloigs/image/upload/v1742224838/zenher-logo_lgfkwg.png',
        }}
        className="w-20 h-20 mb-6"
      />

      <Text className="text-white text-xl font-bold mb-2 text-center">Nice to have you back</Text>
      <Text className="text-gray-400 text-base text-center mb-10">
        Sign in to your Zenher account to start tracking again.
      </Text>
        <View className='flex-1'/>
      <TouchableOpacity className="bg-cyan-400 w-full py-4 rounded-full mb-4" onPress={() => router.push('/auth/emailLogin')}>
        <Text className="text-center font-semibold text-black">Sign in with email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-500 w-full py-4 rounded-full mb-4"
        onPress={onGoogleButtonPress}
      >
        <Text className="text-center font-semibold text-white">Sign in with Google</Text>
      </TouchableOpacity>

      <View className='h-6'/>
    </View>
  );
}
