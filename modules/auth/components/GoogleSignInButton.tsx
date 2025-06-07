import { Text, TouchableOpacity } from 'react-native';
import useGoogleAuth from '../hooks/useGoogleAuth';

export default function GoogleSignInButton() {
  const { signInWithGoogle, loading } = useGoogleAuth();

  return (
    <TouchableOpacity
      className="border border-white w-full py-4 rounded-full mb-4"
      onPress={signInWithGoogle}
      disabled={loading}
    >
      <Text className="text-center font-semibold text-white">
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </Text>
    </TouchableOpacity>
  );
}
