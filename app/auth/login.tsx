// app/auth/login.tsx
import GoogleSignInButton from '@/modules/auth/components/GoogleSignInButton';
import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black items-center px-5 pt-24">
      <TouchableOpacity className="absolute top-12 left-5" onPress={() => router.back()}>
        <Text className="text-white text-2xl">←</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: 'https://res.cloudinary.com/denlloigs/image/upload/v1742224838/zenher-logo_lgfkwg.png' }}
        className="w-20 h-20 mb-6"
      />

      <Text className="text-white text-xl font-bold mb-2 text-center">Nice to have you back</Text>
      <Text className="text-gray-400 text-base text-center mb-10">
        Sign in to your Zenher account to start tracking again.
      </Text>

      <View className="flex-1" />

      <TouchableOpacity className="bg-cyan-400 w-full py-4 rounded-full mb-4" onPress={() => router.push('/auth/emailLogin')}>
        <Text className="text-center font-semibold text-black">Sign in with email</Text>
      </TouchableOpacity>

      <GoogleSignInButton />

      <View className="h-6" />
    </View>
  );
}
