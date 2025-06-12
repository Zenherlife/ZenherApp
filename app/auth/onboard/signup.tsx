import GoogleSignInButton from '@/modules/auth/components/GoogleSignInButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupOptionsScreen() {
  const router = useRouter();

  return (
  <SafeAreaView className="flex-1 bg-gray-900 px-6">
    {/* Back Button */}
    <TouchableOpacity className="mt-4" onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>

    {/* Icon */}
    <View className="items-center mb-6 pt-12">
      <Image source={require('@/assets/images/project/logo.png')} className="h-20 w-20 mb-8" resizeMode="contain" />

      {/* Heading */}
      <Text className="text-white text-2xl font-bold text-center">
        How would you like to{'\n'}sign up?
      </Text>

      {/* Subtext */}
      <Text className="text-gray-400 text-base text-center mt-3">
        Create a Zenher account where all your{'\n'}preferences are stored.
      </Text>
    </View>

    {/* Buttons */}
    <View className="space-y-4 mt-4">
      {/* Google Sign Up */}
      <GoogleSignInButton />

      {/* Email Sign Up */}
      <TouchableOpacity
        onPress={() => router.push('./CreateAccount')}
        className="flex-row justify-center items-center w-full py-3 border border-blue-400 rounded-full mt-4 gap-4"
      >
        <Mail color="#60A5FA" size={20} strokeWidth={2} />
        <Text className="text-blue-400 text-center font-semibold text-lg">Sign up with email</Text>
      </TouchableOpacity>
    </View>

    {/* Footer */}
    <Text className="text-center text-gray-400 mt-8">
      Already have an account?{' '}
      <Text
        className="text-blue-400 font-semibold"
        onPress={() => router.push('../login')}
      >
        Sign in
      </Text>
    </Text>
  </SafeAreaView>
  );
}
