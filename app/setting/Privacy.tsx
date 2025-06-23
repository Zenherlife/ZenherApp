import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-6 pb-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text className="ml-4 text-2xl font-semibold text-black dark:text-white">Privacy Policy</Text>
      </View>

      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 80 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Policy Sections */}
        {sections.map((section, index) => (
          <View
            key={index}
            className="mb-4 p-4 "
            
          >
            <Text className="text-[18px] font-bold text-black dark:text-white mb-2">
              {section.title}
            </Text>
            <Text className="text-[15px] text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
              {section.content}
            </Text>
          </View>
        ))}

        {/* Contact Us */}
        {/* <View
          className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
          style={{
            shadowColor: isDark ? '#000' : '#ccc',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text className="text-[18px] font-bold text-black dark:white mb-2">
            Contact Us
          </Text>
          <Text className="text-[15px] text-gray-700 dark:text-gray-200 leading-7">
            📧 support@zenher.in{'\n'}
            🌐 https://www.zenher.in
          </Text>
        </View> */}

        {/* Effective Date */}
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Effective Date: June 22, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const sections = [
  {
    title: '1. Information We Collect',
    content:
      `- Name, email, and password during sign up\n` +
      `- Date of birth and profile details\n` +
      `- App usage and activity data`,
  },
  {
    title: '2. How We Use Your Information',
    content:
      `- To create and manage your account\n` +
      `- Show personalized reminders and content\n` +
      `- Improve features and user experience`,
  },
  {
    title: '3. Data Sharing',
    content:
      `We do not sell your data. Limited data may be shared with trusted services for secure storage and authentication only.`,
  },
  {
    title: '4. Your Rights',
    content:
      `- You may view, update, or delete your data anytime\n` +
      `- You can request account deletion by contacting us`,
  },
  {
    title: '5. Security',
    content:
      `We follow industry-standard practices to protect your data, but no method is 100% secure.`,
  },
  {
    title: '6. Children’s Privacy',
    content:
      `ZenHer is not intended for users under 18. If we become aware of such data, we will delete it immediately.`,
  },
  {
    title: '7. Changes to This Policy',
    content:
      `We may update this policy from time to time. Please revisit this screen to stay informed.`,
  },
];
