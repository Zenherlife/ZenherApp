import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  View,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const TABS = [
  { key: 'index', label: 'Home', iconOutline: 'home-outline', iconFilled: 'home' },
  { key: 'track', label: 'Track', iconOutline: 'calendar-outline', iconFilled: 'calendar' },
  { key: 'shop', label: 'Shop', iconOutline: 'cart-outline', iconFilled: 'cart' },
  { key: 'consult', label: 'Consult', iconOutline: 'call-outline', iconFilled: 'call' },
  { key: 'articles', label: 'Explore', iconOutline: 'newspaper-outline', iconFilled: 'newspaper' },
];

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabAnimations = React.useRef(
    TABS.map(() => ({
      scale: new Animated.Value(1),
      iconScale: new Animated.Value(1),
      backgroundOpacity: new Animated.Value(0),
      labelOpacity: new Animated.Value(0.7),
    }))
  ).current;

  const indicatorAnimation = React.useRef(new Animated.Value(0)).current;

  const activeColor = isDark ? '#A5B4FC' : '#7C3AED';
  const inactiveColor = isDark ? '#b3b6bd' : '#64748b';
  const backgroundColor = isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)';
  const highlightColor = isDark ? 'rgba(165, 180, 252, 0.2)' : 'rgba(124, 58, 237, 0.15)';
  const shadowColor = 'rgba(17, 24, 39, 1)';

  const containerPadding = 16;
  const tabBarWidth = screenWidth - containerPadding;
  const availableWidth = tabBarWidth - containerPadding * 2;
  const tabWidth = availableWidth / TABS.length;

  const prevTabIndexRef = React.useRef(0);

  useEffect(() => {
    const currentRouteKey = state.routes[state.index].name.toLowerCase();
    const toIndex = TABS.findIndex(tab => tab.key === currentRouteKey);

    indicatorAnimation.setValue(prevTabIndexRef.current);

    Animated.spring(indicatorAnimation, {
      toValue: toIndex,
      useNativeDriver: true,
      damping: 14,
      stiffness: 140,
      mass: 0.9,
      overshootClamping: false,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
    }).start();

    prevTabIndexRef.current = toIndex;
  }, [state.index]);

  const renderTab = (tab: any, index: number) => {
    const route = state.routes.find((r: any) => r.name.toLowerCase() === tab.key.toLowerCase());
    if (!route) return null;

    const routeIndex = state.routes.findIndex((r: any) => r.name.toLowerCase() === tab.key.toLowerCase());
    const isFocused = state.index === routeIndex;
    const color = isFocused ? activeColor : inactiveColor;
    const iconName = isFocused ? tab.iconFilled : tab.iconOutline;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        if (Platform.OS === 'ios') {
          try {
            const { HapticFeedback } = require('expo-haptics');
            HapticFeedback?.impactAsync(HapticFeedback?.ImpactFeedbackStyle?.Light);
          } catch {}
        }
        navigation.navigate(route.name);
      }
    };

    return (
      <Animated.View key={tab.key} className="items-center justify-center" style={{ width: tabWidth, transform: [{ scale: tabAnimations[index].scale }] }}>
        <Pressable
          onPress={onPress}
          android_ripple={{ color: activeColor + '30', borderless: true, radius: 30 }}
          className="items-center justify-center rounded-2xl py-2"
        >
          <Animated.View
            className="mb-1 rounded-xl"
            style={{ transform: [{ scale: tabAnimations[index].iconScale }] }}
          >
            <Ionicons name={iconName as any} size={22} color={color} />
          </Animated.View>
          <Animated.Text
            className="text-[10px] text-center"
            style={{ fontWeight: isFocused ? '700' : '600', color, opacity: tabAnimations[index].labelOpacity }}
          >
            {tab.label}
          </Animated.Text>
        </Pressable>
      </Animated.View>
    );
  };
  
  const gradientColors = isDark
    ? ['transparent', 'rgba(17, 24, 39, 0.6)', 'rgba(17, 24, 39, 0.8)']
    : ['transparent', 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.8)'];

  const TabBarContainer = () => (
    <View className="relative">
      <View
        className="mx-4 rounded-[30px]"
        style={{
          backgroundColor: Platform.OS === 'android' ? backgroundColor : 'transparent',
          shadowColor: `${isDark ? '#111827' : '#888888'}`,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 15,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'transparent',
        }}
      >
        <View className="relative flex-row justify-center py-1.5 px-[8px]" style={{ height: 64 }}>
          <Animated.View
            className="absolute rounded-3xl"
            style={{
              left: 8,
              top: 7,
              width: tabWidth + 2,
              height: 50,
              backgroundColor: highlightColor,
              transform: [
                {
                  translateX: indicatorAnimation.interpolate({
                    inputRange: TABS.map((_, i) => i),
                    outputRange: TABS.map((_, i) => i * tabWidth),
                  }),
                },
              ],
            }}
          />
          {TABS.map(renderTab)}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="absolute bottom-0 left-0 right-0 bg-transparent">
      <LinearGradient
        pointerEvents='none'
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          zIndex: 0,
        }}
      />
      {Platform.OS === 'ios' ? (
        <View className="mx-4 mb-8 rounded-3xl overflow-hidden">
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={isDark ? 90 : 100}
            style={{ borderRadius: 30 }}
          >
            <View className="relative flex-row justify-center py-1.5 px-[8px]"
              style={{ height: 64, backgroundColor: isDark ? 'rgba(31,41,55,0.4)' : 'rgba(255,255,255,0.4)' }}
            >
              <Animated.View
                className="absolute rounded-3xl"
                style={{
                  left: 8,
                  top: 7,
                  width: tabWidth + 2,
                  height: 50,
                  backgroundColor: highlightColor,
                  transform: [
                    {
                      translateX: indicatorAnimation.interpolate({
                        inputRange: TABS.map((_, i) => i),
                        outputRange: TABS.map((_, i) => i * tabWidth),
                      }),
                    },
                  ],
                }}
              />
              {TABS.map(renderTab)}
            </View>
          </BlurView>
        </View>
      ) : (
        <TabBarContainer />
      )}
    </SafeAreaView>
  );
};

export default CustomTabBar;
