import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const WomensHealthcareBanner = ({ onPress }) => {
  // Animation values
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Breathing animation (gentle scale)
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.02,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Pulse animation (opacity)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // Floating animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -8,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer animation
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    breatheAnimation.start();
    pulseAnimation.start();
    floatingAnimation.start();
    shimmerAnimation.start();

    return () => {
      breatheAnimation.stop();
      pulseAnimation.stop();
      floatingAnimation.stop();
      shimmerAnimation.stop();
    };
  }, []);

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    onPress && onPress();
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View className="px-4 py-3 bg-gray-50 dark:bg-gray-900">
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={{
            transform: [
              { scale: breatheAnim },
              { scale: pressAnim },
              { translateY: floatingAnim },
            ],
            backgroundColor: 'transparent ',
          }}
          className="relative rounded-[20px] overflow-hidden"
        >
          <LinearGradient
            colors={['#FF6B9D', '#C44569', '#9634e8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 16,
              height: 100,
            }}
          >
            {/* Shimmer overlay */}
            <Animated.View
              style={{
                transform: [{ translateX: shimmerTranslateX }, { rotate: '-12deg' }],
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                width: 80
              }}
            />

            {/* Decorative circles */}
            <Animated.View
              style={{ 
                opacity: pulseAnim,
                position: 'absolute',
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 20,
              }}
            />

            {/* Content */}
            <View style={{ position: 'relative', zIndex: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Left content */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 20, padding: 6, marginRight: 8 }}>
                    <Text style={{ fontSize: 16 }}>🌸</Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    Women's Wellness Center
                  </Text>
                </View>
                
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13 }}>
                  Trusted healthcare insights & personalized care
                </Text>
              </View>

              {/* Right content */}
              <View style={{ alignItems: 'center' }}>
                <Animated.View
                  style={{ 
                    opacity: pulseAnim,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 25,
                    padding: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>✨</Text>
                </Animated.View>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                  Discover →
                </Text>
              </View>
            </View>

            {/* Pulse ring effect */}
            <Animated.View
              style={{
                opacity: pulseAnim,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 20,
              }}
            />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default WomensHealthcareBanner;