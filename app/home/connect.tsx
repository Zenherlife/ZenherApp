import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import SettingSection from '@/modules/home/components/SettingSection';
import SocialFooter from '@/modules/home/components/SocialFooter';
import { calculateProfileCompletion } from '@/modules/home/utils/profileUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function ConnectScreen() {
  const router = useRouter();
  const user = useUserDataStore((state) => (state))
  const { colorScheme } = useColorScheme();

  const profileCompletion = calculateProfileCompletion(user);

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView 
        className="flex-1 pt-6" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mb-8">
          <View className="bg-white dark:bg-gray-800 rounded-3xl px-4 pt-4 shadow-lg shadow-indigo-100 dark:shadow-none">
            <View className="flex-row items-center mb-4 gap-4">
              <View className="w-16 h-16 rounded-full bg-indigo-500 items-center justify-center shadow-lg shadow-indigo-300 overflow-hidden">
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-2xl font-black">
                    {(user?.displayName || " ")[0].toUpperCase()}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {user?.displayName || " "}
                </Text>
                <Text className="text-gray-500 dark:text-gray-300 font-medium text-sm" numberOfLines={1}>
                  {user?.email || " "}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/auth/logout')}
                className="rounded-full border-2 border-white/20 active:opacity-80"
              >
                <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2">
                  <Ionicons name="create-outline" size={20} color="#6366f1" />
                  <Text className="text-sm text-black dark:text-white ml-2">Edit</Text>
                </View>
              </Pressable>
            </View>
            {profileCompletion < 1 && (
            <View className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900 dark:text-white font-bold tracking-tight">
                  Profile Completion
                </Text>
                <Text className="text-indigo-500 font-extrabold text-lg tracking-wider">
                  {Math.round(profileCompletion * 100)}%
                </Text>
              </View>

              <View className="h-3 bg-gray-800 rounded-full overflow-hidden w-full relative">
                <LinearGradient
                  colors={['#6366f1', '#4f46e5', '#4338ca', '#818cf8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  className="absolute h-full bg-gray-800 right-0"
                  style={{
                    width: `${(1 - profileCompletion) * 100}%`,
                    borderTopRightRadius: 9999,
                    borderBottomRightRadius: 9999,
                  }}
                />
              </View>
              </View>
            )}
          </View>
        </View>

        <View>
          <SettingSection 
            title="Health & Wellness" 
            items={[
              { title: 'BMI & Health Metrics', icon: 'body-outline', subtitle: 'Track your vitals', onPress: () => router.push('/setting/BMI') },
              { title: 'Cycle Management', icon: 'time-outline', subtitle: 'Customize your tracking', onPress: () => router.push({ pathname: '/auth/onboard/AverageCycle', params: { mode: 'edit' } }) },
              { title: 'Smart Reminders', icon: 'notifications-outline', subtitle: 'Never miss important dates', onPress: () => router.push({ pathname:'/auth/onboard/reminder', params: {mode: 'edit'}}) },
            ]} 
          />

          <SettingSection 
            title="Personalization" 
            items={[
              { title: 'Tracking Preferences', icon: 'options-outline', subtitle: 'Customize your experience', onPress: () => {} },
              // { title: 'Edit Profile', icon: 'create-outline', subtitle: 'Update your information', onPress: () => router.push('/settings/edit-profile') },
              { title: 'Privacy & Security', icon: 'lock-closed-outline', subtitle: 'Manage data protection', onPress: () => {} },
            ]} 
          />

          <SettingSection 
            title="Support & Resources" 
            items={[
              { title: 'Help Center', icon: 'help-circle-outline', subtitle: 'Get guidance and tips', onPress: () => Linking.openURL('https://zenherapp.vercel.app/help') },
              { title: 'Contact Support', icon: 'mail-outline', subtitle: 'We\'re here to help', onPress: () => Linking.openURL('mailto:support@zenher.com') },
            ]} 
          />
        </View>

        <View className="items-center mt-6 px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-gray-600 dark:text-gray-300 font-bold text-center mb-2">
              🇮🇳 Crafted with ❤️ in India
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Zenher v1.0.0 • Empowering Women's Health
            </Text>
          </View>
        </View>

        <SocialFooter />
      </ScrollView>
    </View>
  );
}
