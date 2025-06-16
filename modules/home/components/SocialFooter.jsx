import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Linking, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const SocialFooter = () => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#d1d5db' : '#374151';

  const socialLinks = [
    { icon: <Ionicons name="logo-whatsapp" size={22} color={iconColor} />, url: 'https://wa.me/7310212507' },
     { icon: <FontAwesome6 name="x-twitter" size={20} color={iconColor} />, url: 'https://x.com/zenherofficial?t=dvq11Gf3ToZiHiMIrwsRnw&s=09' },
    { icon: <Ionicons name="logo-instagram" size={22} color={iconColor} />, url: 'https://www.instagram.com/zenher.in/' },
    { icon: <Ionicons name="logo-linkedin" size={22} color={iconColor} />, url: 'https://www.linkedin.com/company/zenher/' },
  ];

  const openLink = async (url) => {
    await Linking.openURL(url);
  }

  return (
    <View className="mt-10 mb-6 items-center">
      <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">Connect with us</Text>
      <View className="flex-row gap-4">
        {socialLinks.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => openLink(item.url)}
            className="w-10 h-10 rounded-2xl items-center justify-center bg-gray-100 dark:bg-gray-800"
            activeOpacity={0.7}
          >
            {item.icon}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SocialFooter;
