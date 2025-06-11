import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

export default function SettingSection({ title, items }) {
  return (
    <View className="mx-4 mb-6">
      <View className="flex-row items-center mb-4 px-2">
        {/* <View className="w-1 h-8 bg-[#c894fc] rounded-full mr-3" /> */}
        <Text className="text-[1.375rem] font-black text-gray-900 dark:text-white">{title}</Text>
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {items.map((item, idx) => (
          <MenuItem
            key={item.title}
            item={item}
            isLast={idx === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function MenuItem({ item, isLast }) {
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
      className={`${!isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
    >
      <Animated.View style={animatedStyle}>
        <View className="flex-row items-center px-5 py-4">
          <View className="w-12 h-12 bg-[#9966cc] rounded-2xl items-center justify-center shadow-lg mr-4">
            <Ionicons name={item.icon} size={24} color="white" />
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-900 dark:text-white text-lg font-bold mb-1">{item.title}</Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm">{item.subtitle}</Text>
          </View>
          
          <View className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
            <Ionicons name="chevron-forward" size={20} color="#a855f7" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}