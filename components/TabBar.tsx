import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  useColorScheme,
} from 'react-native';

const TABS = [
  {
    key: 'index',
    label: 'Home',
    iconOutline: 'home-outline',
    iconFilled: 'home',
  },
  {
    key: 'track',
    label: 'Track',
    iconOutline: 'calendar-outline',
    iconFilled: 'calendar',
  },
  {
    key: 'shop',
    label: 'Shop',
    iconOutline: 'cart-outline',
    iconFilled: 'cart',
  },
  {
    key: 'consult',
    label: 'Consult',
    iconOutline: 'call-outline',
    iconFilled: 'call',
  },
  {
    key: 'connect',
    label: 'Profile',
    iconOutline: 'person-outline',
    iconFilled: 'person',
  },
];

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeColor = isDark ? '#A5B4FC' : '#7C3AED';
  const inactiveColor = isDark ? '#6B7280' : '#9CA3AF';
  const backgroundColor = isDark ? '#111827' : '#FFFFFF';
  const borderColor = isDark ? '#1F2937' : '#E5E7EB';

  const TabBarContent = () => (
    <View
      style={{
        flexDirection: 'row',
        height: 75,
        borderTopWidth: 1,
        borderTopColor: borderColor,
        backgroundColor: Platform.OS === 'android' ? backgroundColor : 'transparent',
      }}
    >
      {TABS.map((tab, index) => {
        const route = state.routes.find((r: any) => r.name === tab.key);
        if (!route) return null;

        const isFocused = state.index === state.routes.findIndex((r: any) => r.name === tab.key);
        const color = isFocused ? activeColor : inactiveColor;
        const iconName = isFocused ? tab.iconFilled : tab.iconOutline;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={tab.key}
            onPress={onPress}
            style={{
              flex: 1,
              paddingVertical: 6,
            }}
            android_ripple={{
              color: activeColor + '20',
              borderless: true,
            }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  padding: 6,
                  borderRadius: 999,
                  backgroundColor: isFocused
                    ? isDark
                      ? 'rgba(165, 180, 252, 0.1)'
                      : 'rgba(124, 58, 237, 0.1)'
                    : 'transparent',
                }}
              >
                <Ionicons name={iconName as any} size={18} color={color} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color,
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
                }}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <BlurView
          tint={isDark ? 'dark' : 'light'}
          intensity={80}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <TabBarContent />
      </View>
    );
  }

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <TabBarContent />
    </View>
  );
};

export default CustomTabBar;
