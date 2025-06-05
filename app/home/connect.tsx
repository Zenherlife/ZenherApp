import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

const user = {
  name: 'Animesh Shukla',
  email: 'animeshshuklafoundation@gmail.com',
};

const healthProfile = [
  { title: 'My health record', icon: 'document-text-outline', onPress: () => {} },
  { title: 'Birth Control', icon: 'medkit-outline', onPress: () => {} },
];

const appPreferences = [
  { title: 'Customize tracking', icon: 'options-outline', onPress: () => {} },
  { title: 'Reminders and notifications', icon: 'notifications-outline', onPress: () => {} },
  { title: 'Settings', icon: 'settings-outline', onPress: () => {} },
  { title: 'Clue Connect', icon: 'people-outline', onPress: () => {} },
];

const resources = [
  { title: 'Tracking guidance', icon: 'help-circle-outline', onPress: () => Linking.openURL('https://zenherapp.vercel.app/help') },
  { title: 'Support', icon: 'mail-outline', onPress: () => Linking.openURL('mailto:support@zenher.com') },
];

export default function ConnectScreen() {
  return (
    <ScrollView className="flex-1 mt-12 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Profile Card */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mx-4 mt-8 mb-4 p-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{user.name}</Text>
          <Text className="text-gray-500 dark:text-gray-300">{user.email}</Text>
        </View>
        <Pressable onPress={() => {}}>
          <Ionicons name="chevron-forward" size={28} color="#a21caf" />
        </Pressable>
      </View>

      {/* Health Profile Section */}
      <Section title="Health profile" items={healthProfile} />

      {/* App Preferences Section */}
      <Section title="App preferences" items={appPreferences} />

      {/* Resources Section */}
      <Section title="Resources" items={resources} />
    </ScrollView>
  );
}

function Section({ title, items }: { title: string; items: any[] }) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 dark:text-white px-6 mb-2 mt-2">{title}</Text>
      <View className="bg-white dark:bg-gray-800 rounded-2xl mx-4">
        {items.map((item, idx) => (
          <Pressable
            key={item.title}
            onPress={item.onPress}
            className={`flex-row items-center px-6 py-4 ${idx !== items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
          >
            <Ionicons name={item.icon} size={22} color="#a21caf" style={{ marginRight: 16 }} />
            <Text className="flex-1 text-gray-900 dark:text-white text-base">{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#a3a3a3" />
          </Pressable>
        ))}
      </View>
    </View>
  );
} 