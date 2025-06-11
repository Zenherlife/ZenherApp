import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import useGoogleAuth from '../hooks/useGoogleAuth';

export default function GoogleSignInButton() {
  const { signInWithGoogle, loading } = useGoogleAuth();

  return (
    <TouchableOpacity
      className="flex-row border justify-center items-center border-white w-full py-3 rounded-full gap-4"
      onPress={signInWithGoogle}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={25} color="#fff" />
      ) : (
        <>
        <FontAwesome name="google" size={20} color="white" />
        <Text className="text-center font-semibold text-lg text-white">Sign in with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
