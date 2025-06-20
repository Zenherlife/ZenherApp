import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { listenToUser } = useUserDataStore((state) => state);
  const [showOptions, setShowOptions] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Initial screen animation
  const screenOpacity = useSharedValue(0);
  const screenTranslate = useSharedValue(20);

  // Button transitions
  const getStartedOpacity = useSharedValue(1);
  const optionsOpacity = useSharedValue(0);
  const optionsTranslate = useSharedValue(15);

  // Status Bar color scheme
  const  colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        listenToUser(authUser.uid)
        router.replace('/home');
      } else {
        // User is not logged in, show welcome screen
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!initializing) {
      screenOpacity.value = withTiming(1, { duration: 700 });
      screenTranslate.value = withTiming(0, { duration: 700 });
    }
  }, [initializing]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenTranslate.value }],
  }));

  const getStartedStyle = useAnimatedStyle(() => ({
    opacity: getStartedOpacity.value,
  }));

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: optionsOpacity.value,
    transform: [{ translateY: optionsTranslate.value }],
  }));

  const handleGetStarted = () => {
    // Fade out Get Started button
    getStartedOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setShowOptions)(true);
        optionsOpacity.value = withTiming(1, { duration: 500 });
        optionsTranslate.value = withTiming(0, { duration: 500 });
      }
    });
  };

  if (initializing) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" />

      <Animated.View className="flex-1" style={screenAnimatedStyle}>
        {/* Logo */}
        <View className="flex-row items-center justify-center mt-20 gap-1">
          <Image
            source={require('@/assets/images/project/logo.png')}
            className="w-12 h-12"
            resizeMode="contain"
          />
          <Text className="text-black dark:text-white text-2xl font-semibold mt-2">Zenher</Text>
        </View>

        {/* Heading */}
        <View className="px-8 mt-6">
          <Text className="text-black dark:text-white text-3xl font-bold text-center">Discover Zenher</Text>
          <Text className="text-gray-600 dark:text-gray-300 text-base text-center mt-4 leading-6">
            Effortlessly track your cycle, connect with wellness experts, and unlock personalized
            health insights—all in one beautifully designed space.
          </Text>
        </View>

        {/* Welcome Image */}
        <View className="items-center py-12">
          <Image
            source={require('@/assets/images/project/hero-image.png')}
            className="w-64 h-64"
            resizeMode="contain"
          />
        </View>

        {/* Buttons Area */}
        <View className="px-8 mb-10">
          {/* Get Started */}
          {!showOptions && (
            <Animated.View style={getStartedStyle}>
              <TouchableOpacity
                className="bg-indigo-800 dark:bg-white py-3 rounded-full"
                onPress={handleGetStarted}
              >
                <Text className="text-center text-white dark:text-gray-900 font-bold text-lg">Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Two Option Buttons */}
          {showOptions && (
            <Animated.View style={optionsStyle}>
              <TouchableOpacity
                className="py-3 rounded-full border border-black dark:border-white mb-4"
                onPress={() => router.push('/auth/login')}
              >
                <Text className="text-center text-black dark:text-white font-semibold text-lg">I have an account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-800 dark:bg-white py-3 rounded-full"
                onPress={() => router.push('/auth/onboard')}
              >
                <Text className="text-center text-white dark:text-gray-900 font-bold text-lg">Create account</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}