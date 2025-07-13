import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import WellnessScreen from '@/modules/home/components/WellnessBottomSheet';
import { SelectedDate, WellnessCategory, WellnessOption, WellnessOptions } from '@/modules/home/utils/types';
import { useWellnessStore } from '@/modules/track/store/useWellnessStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  View,
  useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArticleIcon from './ArticleIcon';
import CalendarIcon from './CalendarIcon';
import ConsultIcon from './ConsultIcon';
import { FloatingContent } from './FABWithAnimatedContent';
import HomeIcon from './HomeIcon';

const { width: screenWidth } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const TABS = [
    { key: 'index', label: 'Home', icon: (isDark: boolean, focused: boolean) => <HomeIcon isDark={isDark} focused={focused} /> },
    { key: 'track', label: 'Track', icon: (isDark: boolean, focused: boolean) => <CalendarIcon isDark={isDark} focused={focused} /> },
    { key: 'shop', label: 'Shop', icon: (isDark: boolean, focused: boolean) => <ConsultIcon isDark={isDark} focused={focused} /> },
    { key: 'articles', label: 'Explore', icon: (isDark: boolean, focused: boolean) => <ArticleIcon isDark={isDark} focused={focused} /> },
  ];

  const wellnessOptions: WellnessOptions = {
    flow: [
      { label: "Light", color: "#fef7f0", textColor: "#d97706" },
      { label: "Medium", color: "#fef3e2", textColor: "#ea580c" },
      { label: "Heavy", color: "#fef2f2", textColor: "#dc2626" },
      { label: "Super Heavy", color: "#fce7f3", textColor: "#be185d" },
    ],
    feelings: [
      { label: "Mood Swings", color: "#f0f4ff", textColor: "#6366f1" },
      { label: "Not in Control", color: "#fef7f0", textColor: "#ea580c" },
      { label: "Fine", color: "#f0fdf4", textColor: "#059669" },
      { label: "Happy", color: "#fffbeb", textColor: "#d97706" },
      { label: "Sad", color: "#eff6ff", textColor: "#3b82f6" },
      { label: "Confident", color: "#ecfdf5", textColor: "#059669" },
      { label: "Excited", color: "#fdf2f8", textColor: "#ec4899" },
      { label: "Irritable", color: "#fef2f2", textColor: "#dc2626" },
      { label: "Anxious", color: "#f3e8ff", textColor: "#9333ea" },
      { label: "Insecure", color: "#f8fafc", textColor: "#64748b" },
      { label: "Grateful", color: "#f0f9ff", textColor: "#0284c7" },
      { label: "Indifferent", color: "#f9fafb", textColor: "#6b7280" },
    ],
    sleep: [
      { label: "Trouble Falling Asleep", color: "#fef7f0", textColor: "#dc2626" },
      { label: "Woke Up Refreshed", color: "#f0fdf4", textColor: "#059669" },
      { label: "Woke Up Tired", color: "#fffbeb", textColor: "#d97706" },
      { label: "Restless Sleep", color: "#fdf4ff", textColor: "#c026d3" },
      { label: "Vivid Dreams", color: "#eff6ff", textColor: "#2563eb" },
      { label: "Night Sweats", color: "#fff7ed", textColor: "#ea580c" },
    ],
    pain: [
      { label: "Pain Free", color: "#f0fdf4", textColor: "#059669" },
      { label: "Cramps", color: "#fef2f2", textColor: "#dc2626" },
      { label: "Ovulation", color: "#fdf2f8", textColor: "#ec4899" },
      { label: "Breast Tenderness", color: "#fce7f3", textColor: "#be185d" },
      { label: "Headache", color: "#fef7f0", textColor: "#ea580c" },
      { label: "Migraine", color: "#fef2f2", textColor: "#b91c1c" },
      { label: "Migraine with Aura", color: "#f3e8ff", textColor: "#9333ea" },
      { label: "Lower Back", color: "#fffbeb", textColor: "#d97706" },
      { label: "Leg", color: "#eff6ff", textColor: "#3b82f6" },
      { label: "Joint", color: "#f8fafc", textColor: "#64748b" },
      { label: "Vulvar", color: "#fdf4ff", textColor: "#c026d3" },
    ],
    energy: [
      { label: "Exhausted", color: "#fef2f2", textColor: "#dc2626" },
      { label: "Tired", color: "#fef7f0", textColor: "#ea580c" },
      { label: "OK", color: "#fffbeb", textColor: "#d97706" },
      { label: "Energetic", color: "#ecfdf5", textColor: "#059669" },
      { label: "Fully Energized", color: "#f0fdf4", textColor: "#047857" },
    ],
  };

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
  const inactiveColor = isDark ? '#8e95a5' : '#64748b';
  const backgroundColor = isDark ? 'rgba(31, 41, 55, 1)' : 'rgba(255, 255, 255, 1)';
  const highlightColor = isDark ? 'rgba(165, 180, 252, 0.2)' : 'rgba(124, 58, 237, 0.1)';
  const floatingButtonColor = isDark ? '#8B5CF6' : '#7C3AED';
  const floatingButtonGradient = isDark
    ? ['#6366F1', '#8B5CF6']
    : ['#Ffc0cb', '#600FFF'];

  const containerPadding = 16;
  const tabBarWidth = screenWidth - containerPadding;
  const availableWidth = tabBarWidth - containerPadding * 2;
  const floatingButtonSpace = 55;
  const tabWidth = (availableWidth - floatingButtonSpace) / TABS.length;
  const prevTabIndexRef = React.useRef(0);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);

  const today = new Date()
  const {
    entries,
    loading: wellnessLoading,
    addOrUpdateEntry,
    getMonthEntries
  } = useWellnessStore();

  const { uid } = useUserDataStore();

  useEffect(() => {
    if (uid) {
        getMonthEntries(uid, today.getMonth(), today.getFullYear());
      }
  },[uid])

  const updateWellnessData = async (
    category: WellnessCategory,
    option: WellnessOption
  ): Promise<void> => {
    if (!selectedDate || !uid) return;

    try {
      await addOrUpdateEntry(uid, selectedDate.key, category, option);
    } catch (error) {
      console.error("Error updating wellness data:", error);
    }
  };

  const getWellnessData = () => {
    const wellnessData: Record<string, any> = {};
    Object.values(entries).forEach((entry) => {
      wellnessData[entry.date] = {
        flow: entry.flow,
        feelings: entry.feelings,
        sleep: entry.sleep,
        pain: entry.pain,
        energy: entry.energy
      };
    });
    return wellnessData;
  };

  useEffect(() => {
    const currentRouteKey = state.routes[state.index].name.toLowerCase();
    const toIndex = TABS.findIndex(tab => tab.key === currentRouteKey);

    if (toIndex !== -1) {
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
    }
  }, [state.index]);

  const getTabPosition = (index: number) => {
    if (index < 2) {
      return index * tabWidth;
    } else {
      return (index * tabWidth) + floatingButtonSpace;
    }
  };

  const handleFloatingButtonPress = () => {
    const monthStr = String(today.getMonth() + 1).padStart(2, "0");
    const dayStr = String(today.getDate()).padStart(2, "0");
    const dateKey =  `${today.getFullYear()}-${monthStr}-${dayStr}`;

    setSelectedDate({
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
      key: dateKey,
    });
    setIsOpen(!isOpen)
    if (Platform.OS === 'ios') {
      try {
        const { HapticFeedback } = require('expo-haptics');
        HapticFeedback?.impactAsync(HapticFeedback?.ImpactFeedbackStyle?.Medium);
      } catch {}
    }
  };

  const renderTab = (tab: any, index: number) => {
    const route = state.routes.find((r: any) => r.name.toLowerCase() === tab.key.toLowerCase());
    if (!route) return null;

    const routeIndex = state.routes.findIndex((r: any) => r.name.toLowerCase() === tab.key.toLowerCase());
    const isFocused = state.index === routeIndex;
    const color = isFocused ? activeColor : inactiveColor;
    // const iconName = isFocused ? tab.icon : tab.icon;

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
      <Animated.View 
        key={tab.key} 
        className="items-center justify-center absolute" 
        style={{ 
          width: tabWidth, 
          left: getTabPosition(index) + 10,
          transform: [{ scale: tabAnimations[index].scale }] 
        }}
      >
        <Pressable
          onPress={onPress}
          android_ripple={{ color: activeColor + '30', borderless: true, radius: 30 }}
          className="items-center justify-center rounded-2xl"
        >
          <Animated.View
            className="mb-[3px] rounded-xl"
            style={{ transform: [{ scale: tabAnimations[index].iconScale }] }}
          >
            {tab.icon?.(isDark, isFocused)}
            {/* <Image source={iconName} resizeMode='contain' style={{tintColor: color, height: 19, width: 19}} /> */}
          </Animated.View>
          <Animated.Text
            className="text-[10px] text-center"
            style={{ 
              fontWeight: isFocused ? '700' : '600', 
              color, 
              opacity: tabAnimations[index].labelOpacity 
            }}
          >
            {tab.label}
          </Animated.Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderFloatingButton = () => {

    return (
      <Animated.View 
        className="absolute -top-6 items-center justify-center"
        style={{
          left: '50%',
          marginLeft: -28,
        }}
      >
        <Pressable
          onPress={handleFloatingButtonPress}
          android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true, radius: 28 }}
          className="items-center justify-center"
        >
          <LinearGradient
            colors={floatingButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: floatingButtonColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View 
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: 'rgba(255,255,255,0.1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isOpen ? (
                <Ionicons name="close-outline" size={28} color="white" />
              ):
              (
                <Ionicons name="add" size={28} color="white" />
              )}
            </View>
          </LinearGradient>
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
        <View className="justify-center relative py-1.5 px-[8px]" style={{ height: 64 }}>
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
                    outputRange: TABS.map((_, i) => getTabPosition(i)),
                  }),
                },
              ],
            }}
          />
          {TABS.map(renderTab)}
        </View>
        {renderFloatingButton()}
      </View>
    </View>
  );


  return (
    <>
      <FloatingContent visible={isOpen} onClose={() => setIsOpen(false)}>
        <WellnessScreen
          selectedDate={selectedDate}
          wellnessData={getWellnessData()}
          wellnessOptions={wellnessOptions}
          onUpdateWellnessData={updateWellnessData}
          loading={wellnessLoading}
          onGoBack={() => setIsOpen(false)}
        />
      </FloatingContent>
    
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
            <View className="relative py-1.5 px-[8px]"
              style={{ 
                height: 64, 
                backgroundColor: isDark ? 'rgba(31,41,55,0.4)' : 'rgba(255,255,255,0.4)' 
              }}
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
                        outputRange: TABS.map((_, i) => getTabPosition(i)),
                      }),
                    },
                  ],
                }}
              />
              {TABS.map(renderTab)}
            </View>
            {renderFloatingButton()}
          </BlurView>
        </View>
      ) : (
        <TabBarContainer />
      )}
    </SafeAreaView>
    </>
  );
};

export default CustomTabBar;