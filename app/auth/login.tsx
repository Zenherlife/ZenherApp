// app/auth/login.tsx
import GoogleSignInButton from '@/modules/auth/components/GoogleSignInButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark'
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-6">
      {/* Back Button */}
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
      </TouchableOpacity>

      {/* Logo */}
      <View className="items-center mt-10 mb-6 px-6">
        <Image
          source={require('@/assets/images/project/logo.png')}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Text */}
      <Text className="text:black dark:text-white text-2xl font-bold text-center">Nice to have you back</Text>
      <Text className="text-gray-600 dark:text-gray-400 text-base text-center mt-2">
        Sign in to your Zenher account to start tracking again.
      </Text>

      <View className="flex-1 justify-end mb-20 px-2">

        {/* Email Sign-in Button */}
        <TouchableOpacity
          className="flex-row justify-center items-center w-full py-3 rounded-full mb-4 gap-4 bg-indigo-800 dark:bg-white"
          onPress={() => router.push('/auth/emailLogin')}
        >
          <Mail color={ isDark ? 'black' : 'white'} size={20} strokeWidth={2} />
          <Text className="text-center text-white dark:text-gray-900 font-semibold text-lg">Sign in with email</Text>
        </TouchableOpacity>

        {/* Google Sign-in Button */}
        <GoogleSignInButton label="Sign in with Google" />

      </View>
    </SafeAreaView>
  );
}
