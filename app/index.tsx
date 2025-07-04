import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const carouselData = [
  {
    key: "1",
    title: "Track Your CycleTrack Your Cycle & Symptoms",
    description:
      "Understand your body better with our advanced period and cycle tracker. Identify patterns and predict your next period with accuracy.",
    image: require("@/assets/images/project/track.png"),
  },
  {
    key: "2",
    title: "Consult a Doctor Online",
    description:
      "Get medical advice from certified professionals anytime, anywhere. Book a consultation and receive personalized healthcare guidance.",
    image: require("@/assets/images/project/consult-doctor.png"),
  },
  // {
  //   key: "3",
  //   title: "Gain Insights",
  //   description: "Discover patterns and trends in your health.",
  //   image: require("@/assets/images/project/hero-image.png"),
  // },
  {
    key: "3",
    title: "Daily Reminders",
    description:
      "Stay on track with smart daily reminders for your period, medication, hydration, and self-care — all tailored to your routine.",
    image: require("@/assets/images/project/reminder.png"),
  },
  {
    key: "4",
    title: "Community Support",
    description:
      "Join a supportive community of women sharing experiences and valuable health insights to guide you through your journey.",
    image: require("@/assets/images/project/community.png"),
  },
];

const AnimatedTitle = ({
  text,
  index,
  scrollX,
}: {
  text: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const opacity = withTiming(
      interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolate.CLAMP),
      { duration: 500 }
    );

    const translateY = withTiming(
      interpolate(scrollX.value, inputRange, [20, 0, -20], Extrapolate.CLAMP),
      { duration: 500 }
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.Text
      className="text-center text-2xl font-bold text-black dark:text-white px-8 mt-6 mb-2"
      style={animatedStyle}
    >
      {text}
    </Animated.Text>
  );
};

const AnimatedDescription = ({
  text,
  index,
  scrollX,
}: {
  text: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const opacity = withTiming(
      interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolate.CLAMP),
      { duration: 500 }
    );

    const translateY = withTiming(
      interpolate(scrollX.value, inputRange, [20, 0, -20], Extrapolate.CLAMP),
      { duration: 500 }
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.Text
      className="text-center text-lg font-medium text-black dark:text-gray-400 px-8 mb-4"
      style={animatedStyle}
    >
      {text}
    </Animated.Text>
  );
};

const CarouselItem = ({
  item,
  index,
  scrollX,
}: {
  item: any;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = withTiming(
      interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP),
      { duration: 500 }
    );

    const opacity = withTiming(
      interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP),
      { duration: 500 }
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        { width, alignItems: "center", justifyContent: "center" },
        animatedStyle,
      ]}
    >
      <Image
        source={item.image}
        className="w-80 h-80 mb-6"
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const { listenToUser } = useUserDataStore((state) => state);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const screenOpacity = useSharedValue(0);
  const screenTranslate = useSharedValue(20);
  const getStartedOpacity = useSharedValue(1);
  const optionsOpacity = useSharedValue(0);
  const optionsTranslate = useSharedValue(15);

  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showOptions && flatListRef.current) {
        const nextIndex = (currentIndex + 1) % carouselData.length;
        const offset = nextIndex * width;

        flatListRef.current.scrollToOffset({
          offset,
          animated: true,
        });

        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showOptions, currentIndex]);

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
    getStartedOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setShowOptions)(true);
        optionsOpacity.value = withTiming(1, { duration: 500 });
        optionsTranslate.value = withTiming(0, { duration: 500 });
      }
    });
  };

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

        {/* Title & Description */}
        <AnimatedTitle
          index={currentIndex}
          scrollX={scrollX}
          text={carouselData[currentIndex]?.title}
        />
        <AnimatedDescription
          index={currentIndex}
          scrollX={scrollX}
          text={carouselData[currentIndex]?.description}
        />

        {/* Carousel */}
        <View className="flex-1 justify-center">
          <Animated.FlatList
            ref={flatListRef}
            onScroll={scrollHandler}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            data={carouselData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => (
              <CarouselItem item={item} index={index} scrollX={scrollX} />
            )}
          />

          {/* Pagination Dots */}
          {!showOptions && (
            <View className="flex-row justify-center mt-2 mb-8">
              {carouselData.map((_, index) => (
                <View
                  key={index}
                  className="w-2 h-2 mx-1 rounded-full"
                  style={{
                    backgroundColor:
                      currentIndex === index ? "#4F46E5" : "#CBD5E0",
                  }}
                />
              ))}
            </View>
          )}

          {/* Get Started / Options */}
          <View className="px-8 pb-8">
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
                  className="py-3 rounded-full border border-black dark:border-white mb-4"
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
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
