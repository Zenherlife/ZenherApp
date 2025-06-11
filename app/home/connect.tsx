import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import SettingSection from '@/modules/home/components/SettingSection';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import {
  Linking,
  ScrollView,
  Text,
  View
} from 'react-native';

export default function ConnectScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const { colorScheme } = useColorScheme();

  const profileCompletion = 0.7;

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mb-8">
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
            
            <View className="flex-row items-center mb-6">
              <View className="w-16 h-16 bg-[#976bc6] rounded-full items-center justify-center shadow-lg">
                <Text className="text-white text-2xl font-bold">
                  {(user?.displayName || " ")[0].toUpperCase()}
                </Text>
              </View>
              
              <View className="flex-1 ml-4">
                <Text className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {user?.displayName || " "}
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 font-medium">
                  {user?.email || " "}
                </Text>
              </View>
            </View>

            <View className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-900 dark:text-white font-bold">Profile Completion</Text>
                <Text className="text-purple-600 dark:text-purple-400 font-black text-lg">
                  {Math.round(profileCompletion * 100)}%
                </Text>
              </View>
              
              <View className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${profileCompletion * 100}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        <View>
          <SettingSection 
            title="Health & Wellness" 
            items={[
              { title: 'BMI & Health Metrics', icon: 'body-outline', subtitle: 'Track your vitals', onPress: () => router.push('/health/bmi') },
              { title: 'Cycle Management', icon: 'time-outline', subtitle: 'Customize your tracking', onPress: () => router.push('/settings/cycle') },
              { title: 'Smart Reminders', icon: 'notifications-outline', subtitle: 'Never miss important dates', onPress: () => router.push('/settings/reminders') },
            ]} 
          />

          <SettingSection 
            title="Personalization" 
            items={[
              { title: 'Tracking Preferences', icon: 'options-outline', subtitle: 'Customize your experience', onPress: () => {} },
              { title: 'Edit Profile', icon: 'create-outline', subtitle: 'Update your information', onPress: () => router.push('/settings/edit-profile') },
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
      </ScrollView>
    </View>
  );
}
