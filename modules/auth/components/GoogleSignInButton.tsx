import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, useColorScheme } from 'react-native';
import useGoogleAuth from '../hooks/useGoogleAuth';

interface GoogleSignInButtonProps {
  label: string;
}

export default function GoogleSignInButton({label}: GoogleSignInButtonProps) {
  const { signInWithGoogle, loading } = useGoogleAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark'
  return (
    <TouchableOpacity
      className="flex-row border justify-center items-center border-black dark:border-white w-full py-3 rounded-full gap-4"
      onPress={signInWithGoogle}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={25} color="#fff" />
      ) : (
        <>
        <FontAwesome name="google" size={20} color={isDark ? 'white' : 'black'} />
        <Text className="text-center font-semibold text-lg text-black dark:text-white">{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
