import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import GoogleSignInButton from '@/modules/auth/components/GoogleSignInButton';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function SignupOptionsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-4">
        <Feather name="arrow-left" size={28} color="white" />
      </TouchableOpacity>

      {/* Icon */}
      <View className="items-center mb-6">
        <View className="bg-[#ffe1ec] rounded-full p-4 mb-4">
          <Image source={require('../../../assets/images/project/logo.png')} className="h-12 w-12" resizeMode="contain" />
        </View>

        {/* Heading */}
        <Text className="text-white text-2xl font-bold text-center">
          How would you like to{'\n'}sign up?
        </Text>

        {/* Subtext */}
        <Text className="text-gray-400 text-sm text-center mt-2">
          Create a Zenher account where all your{'\n'}preferences are stored.
        </Text>
      </View>

      {/* Buttons */}
      <View className="space-y-4 mt-4">
        {/* Google Sign Up */}
        <GoogleSignInButton />

        {/* Email Sign Up */}
        <TouchableOpacity
          onPress={() => router.push('./signupmail')}
          className="rounded-full border border-blue-400 py-4"
        >
          <Text className="text-blue-400 text-center font-semibold">Sign up with email</Text>
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
    </View>
  );
}
