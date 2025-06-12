import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

export default function SettingSection({ title, items }) {
  return (
    <View className="mx-4 mb-6">
      <View className="flex-row items-center mb-4 px-2">
        <Text className="text-[1.375rem] font-black text-gray-900 dark:text-white">{title}</Text>
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
        {items.map((item, idx) => (
          <View key={item.title}>
            <MenuItem item={item} isLast={idx === items.length - 1} />
            {idx !== items.length - 1 && (
              <View className="h-[1px] bg-gray-200 dark:bg-gray-700 mx-4" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function MenuItem({ item, isLast }) {
  const colorScheme = useColorScheme();
  const scaleValue = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={item.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        <View className="px-5">
          <View className="flex-row items-center py-4">
            <View className="w-12 h-12 bg-indigo-100/50 border border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-500 rounded-2xl items-center justify-center shadow-lg mr-4">
              <Ionicons
                name={item.icon}
                size={24}
                color={colorScheme === 'dark' ? '#a5b4fc' : '#4338ca'}
              />
            </View>

            <View className="flex-1">
              <Text className="text-gray-900 dark:text-white text-lg font-bold mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-sm">
                {item.subtitle}
              </Text>
            </View>

            <View className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colorScheme === 'dark' ? '#818cf8' : '#6366f1'}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
