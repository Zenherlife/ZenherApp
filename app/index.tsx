import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InitialScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setInitializing(false);

      setTimeout(() => {
        if (user) {
          router.replace('/home');
        }
      }, 0);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#004b5c]">
      <StatusBar barStyle="light-content" backgroundColor="#004b5c" />
      <View className="mt-8 px-6">
        <Text className="text-white text-2xl font-semibold">Connecting the dots.</Text>
        <Text className="text-cyan-300 text-lg mt-1">Your cycle, decoded.</Text>
      </View>

      <View className="flex-1 justify-center items-center">
        <View className="bg-[#004b5c] rounded-full border border-white/20 w-64 h-64 justify-center items-center">
          <Text className="text-white text-base mb-1">Today, 2025-06-05</Text>
          <Text className="text-white text-xl font-bold text-center">6 more days until{'\n'}next period</Text>
          <Text className="text-cyan-300 mt-2 text-sm underline">Learn about your cycle</Text>
        </View>
      </View>

      <View className="px-6 mb-6">
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text className="text-cyan-300 text-lg font-semibold text-center mb-6">I have an account</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-cyan-300 rounded-full py-3" onPress={() => router.push('/auth/onboard')}>
          <Text className="text-center text-[#004b5c] font-semibold text-lg">Create account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
