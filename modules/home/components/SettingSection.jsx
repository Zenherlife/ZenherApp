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
        <Text className="text-xl font-black text-gray-900 dark:text-white">{title}</Text>
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
          <View className="flex-row items-center py-3">
            <View className="w-10 h-10 bg-indigo-100/50 border border-indigo-300 dark:bg-indigo-900/40 dark:border-indigo-500 rounded-2xl items-center justify-center shadow mr-4">
              <Ionicons
                name={item.icon}
                size={20}
                color={colorScheme === 'dark' ? '#a5b4fc' : '#4338ca'}
              />
            </View>

            <Text className="flex-1 text-gray-900 dark:text-white text-base font-semibold">
              {item.title}
            </Text>

            <View className="bg-gray-100 dark:bg-gray-700 rounded-full p-1.5">
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colorScheme === 'dark' ? '#818cf8' : '#6366f1'}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
