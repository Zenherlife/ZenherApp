import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const circleScale = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const router = useRouter();
  const hasNavigated = useRef(false);

  const onAnimationEnd = useCallback(() => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/welcomeScreen');
    }
  }, [router]);

  useEffect(() => {
    textOpacity.value = withDelay(500, withTiming(1, { 
      duration: 800,
      easing: Easing.out(Easing.ease)
    }));
    
    textTranslateY.value = withDelay(500, withTiming(0, { 
      duration: 800,
      easing: Easing.out(Easing.ease)
    }));

    circleScale.value = withDelay(1000, withTiming(15, {
      duration: 2000,
      easing: Easing.bezier(0.3, 0.2, 0.1, 1),
    }, (finished) => {
      if (finished) {
        runOnJS(onAnimationEnd)();
      }
    }));

    return () => {
      hasNavigated.current = true;
    };
  }, [onAnimationEnd]);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }), []);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }), []);

  return (
    <LinearGradient colors={["#C471ED", "#F64F59"]} style={styles.container}>
      <Animated.View style={[styles.circle, circleAnimatedStyle]} />
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/project/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animated.Text style={[styles.text, textAnimatedStyle]}>
          Zenher
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const CIRCLE_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  text: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    letterSpacing: 1.2,
  },
});