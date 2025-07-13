import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Animated as RNAnimated,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const carouselData = [
  {
    key: "1",
    title: "Track Cycle",
    description: "Monitor your period and symptoms easily.",
    lottie: require("@/assets/animation/track-health.json"),
  },
  {
    key: "2",
    title: "Consult Doctor",
    description: "Talk to certified doctors anytime.",
    lottie: require("@/assets/animation/doctor.json"),
  },
  {
    key: "3",
    title: "Reminders",
    description: "Get health reminders tailored to you.",
    lottie: require("@/assets/animation/women-walking.json"),
  },
  {
    key: "4",
    title: "Community",
    description: "Join a safe, helpful women’s community.",
    lottie: require("@/assets/animation/community.json"),
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { listenToUser } = useUserDataStore((state) => state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const screenOpacity = useSharedValue(0);
  const screenTranslate = useSharedValue(20);
  const getStartedOpacity = useSharedValue(1);
  const optionsOpacity = useSharedValue(0);
  const optionsTranslate = useSharedValue(15);

  const animatedValues = useRef(
    Array.from({ length: carouselData.length }, () => new RNAnimated.Value(0))
  ).current;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        listenToUser(authUser.uid);
        router.replace("/home");
      } else {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

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
    getStartedOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setShowOptions)(true);
        optionsOpacity.value = withTiming(1, { duration: 500 });
        optionsTranslate.value = withTiming(0, { duration: 500 });
      }
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const titleOpacity = useSharedValue(0);
    const titleTranslate = useSharedValue(10);
    const descriptionOpacity = useSharedValue(0);
    const descriptionTranslate = useSharedValue(10);

    useEffect(() => {
      titleOpacity.value = withTiming(1, { duration: 500 });
      titleTranslate.value = withTiming(0, { duration: 500 });
      descriptionOpacity.value = withTiming(1, { duration: 600 });
      descriptionTranslate.value = withTiming(0, { duration: 600 });
    }, []);

    const animatedTitleStyle = useAnimatedStyle(() => ({
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslate.value }],
    }));

    const animatedDescriptionStyle = useAnimatedStyle(() => ({
      opacity: descriptionOpacity.value,
      transform: [{ translateY: descriptionTranslate.value }],
    }));

    return (
      <View className="items-center justify-center px-6 pt-4">
        <Animated.Text
          style={animatedTitleStyle}
          className="text-center text-2xl font-bold text-black dark:text-white mt-8"
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={animatedDescriptionStyle}
          className="text-center text-lg font-medium text-black dark:text-gray-400 mt-2"
        >
          {item.description}
        </Animated.Text>
        <LottieView
          source={item.lottie}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
    );
  };

  useEffect(() => {
    animatedValues.forEach((animValue, index) => {
      RNAnimated.timing(animValue, {
        toValue: index === currentIndex ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  if (initializing) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
      />

      <Animated.View className="flex-1" style={screenAnimatedStyle}>
        {/* Logo */}
        <View className="flex-row items-center justify-center mt-20 gap-1">
          <Image
            source={require("@/assets/images/project/logo.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
          <Text className="text-black dark:text-white text-2xl font-semibold mt-2">
            Zenher
          </Text>
        </View>

        {/* Carousel */}
        <Carousel
          width={width}
          height={500}
          autoPlay
          loop
          pagingEnabled
          data={carouselData}
          scrollAnimationDuration={800}
          renderItem={renderItem}
          onSnapToItem={(index) => setCurrentIndex(index)}
        />

        {/* Pagination Dots */}
        {!showOptions && (
          <View className="flex-row justify-center mt-8 pt-16">
            {carouselData.map((_, index) => {
              const animatedValue = animatedValues[index];
              const indicatorWidth = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 20],
              });
              const indicatorOpacity = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              });

              return (
                <RNAnimated.View
                  key={index}
                  style={{
                    width: indicatorWidth,
                    height: 8,
                    marginHorizontal: 4,
                    borderRadius: 4,
                    backgroundColor: "#4F46E5",
                    opacity: indicatorOpacity,
                  }}
                />
              );
            })}
          </View>
        )}

        {/* Buttons */}
        <View className="px-8 pt-6 pb-8">
          {!showOptions ? (
            <Animated.View style={getStartedStyle}>
              <TouchableOpacity
                className="bg-indigo-800 py-3 rounded-full mb-16"
                onPress={handleGetStarted}
              >
                <Text className="text-center text-white font-bold text-lg">
                  Get Started
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View style={optionsStyle}>
              <TouchableOpacity
                className="py-3 rounded-full border border-black dark:border-white mb-4 mt-16"
                onPress={() => router.push("/auth/login")}
              >
                <Text className="text-center text-black dark:text-white font-semibold text-lg">
                  I have an account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-indigo-800 dark:bg-white py-3 rounded-full"
                onPress={() => router.push("/auth/onboard")}
              >
                <Text className="text-center text-white dark:text-gray-900 font-bold text-lg">
                  Create account
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};