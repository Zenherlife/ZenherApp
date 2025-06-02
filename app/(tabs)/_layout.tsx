import LayoutHeader from '@/components/LayoutHeader';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import "../../global.css";

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white">
      <LayoutHeader />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
            borderTopWidth: 0,
            height: 65,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                tint="light"
                intensity={80}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ) : null
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 8,
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName = '';
            switch (route.name) {
              case 'index':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'track':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'shop':
                iconName = focused ? 'cart' : 'cart-outline';
                break;
              case 'consult':
                iconName = focused ? 'call' : 'call-outline';
                break;
              case 'connect':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                return null;
            }
            return (
              <View className={`${focused ? 'bg-violet-100' : ''} p-2 rounded-full`}>
                <Ionicons name={iconName as any} size={size} color={color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            tabBarLabel: 'Home',
          }} 
        />
        <Tabs.Screen 
          name="track" 
          options={{ 
            title: 'Track',
            tabBarLabel: 'Track',
          }} 
        />
        <Tabs.Screen 
          name="shop" 
          options={{ 
            title: 'Shop',
            tabBarLabel: 'Shop',
          }} 
        />
        <Tabs.Screen 
          name="consult" 
          options={{ 
            title: 'Consult',
            tabBarLabel: 'Consult',
          }} 
        />
        <Tabs.Screen 
          name="connect" 
          options={{ 
            title: 'Profile',
            tabBarLabel: 'Profile',
          }} 
        />
      </Tabs>
    </View>
  );
} 