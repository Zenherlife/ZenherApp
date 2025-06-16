import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const WomensHealthcareBanner = () => {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme()

  useFocusEffect(
    useCallback(() => {
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
      shimmerAnim.setValue(0);
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
    }, [])
  );

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
    router.push('/article/Articles');
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
          }}
          className="relative rounded-3xl overflow-hidden shadow-lg"
        >
          <LinearGradient
            colors={colorScheme === 'dark'
              ? ['#1f2937', '#374151']
              : ['#f9fafb', '#e5e7eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 20,
              height: 120,
            }}
          >
            {/* Shimmer overlay */}
            <Animated.View
              style={{
                transform: [{ translateX: shimmerTranslateX }, { rotate: '-20deg' }],
                position: 'absolute',
                top: -50,
                left: 0,
                height: '300%',
                width: 150,
                opacity: 0.6,
              }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flex: 1,
                  borderRadius: 20,
                }}
              />
            </Animated.View>

            {/* Content */}
            <View
              style={{
                position: 'relative',
                zIndex: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
              }}
            >
              {/* Left section */}
              <View style={{ flex: 1, paddingRight: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      padding: 6,
                      borderRadius: 999,
                      marginRight: 6,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🌸</Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '700',
                      color: '#fff',
                      includeFontPadding: false,
                    }}
                  >
                    Women's Wellness
                  </Text>
                </View>

                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  Personalized healthcare insights at your fingertips.
                </Text>
              </View>

              {/* Right section */}
              <View style={{ alignItems: 'flex-end' }}>
                <Animated.View
                  style={{
                    opacity: pulseAnim,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderRadius: 999,
                    padding: 10,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>✨</Text>
                </Animated.View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  Discover →
                </Text>
              </View>
            </View>

            {/* Pulse ring */}
            <Animated.View
              style={{
                opacity: pulseAnim,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default WomensHealthcareBanner;
