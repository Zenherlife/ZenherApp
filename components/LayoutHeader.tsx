import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const logo = require('../assets/images/project/logo.png');

export default function LayoutHeader({ right }: { right?: React.ReactNode }) {
  return (
    <SafeAreaView className="left-0 right-0 z-10 bg-white dark:bg-gray-900 flex-row items-center justify-between px-6 shadow-md" style={{ elevation: 4 }}>
      <View className="flex-row items-center">
        <Image
          source={logo}
          className="h-7 w-7 mr-2"
          contentFit="contain"
        />
        <Text className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Zenher</Text>
      </View>
      {right ? (
        right
      ) : (
        <View className="flex-row items-center space-x-4">
          <Pressable className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Ionicons name="notifications-outline" size={22} color="#6B7280" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
} 