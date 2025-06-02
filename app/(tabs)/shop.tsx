import { Image } from 'expo-image';
import { FlatList, Linking, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const products = [
  {
    id: 1,
    title: 'Organic Cotton Pads',
    image: 'https://images.pexels.com/photos/8532612/pexels-photo-8532612.jpeg?auto=compress&w=120',
    amazonLink: 'https://www.amazon.in/dp/B07X6C9RMF?tag=your-affiliate-tag-20',
  },
  {
    id: 2,
    title: 'Period Relief Patch',
    image: 'https://images.pexels.com/photos/8532613/pexels-photo-8532613.jpeg?auto=compress&w=120',
    amazonLink: 'https://www.amazon.in/dp/B08L5WH6QZ?tag=your-affiliate-tag-20',
  },
  {
    id: 3,
    title: 'Monthly Subscription',
    image: 'https://images.pexels.com/photos/8532614/pexels-photo-8532614.jpeg?auto=compress&w=120',
    amazonLink: 'https://www.amazon.in/dp/B07X6C9RMF?tag=your-affiliate-tag-20',
  },
  {
    id: 4,
    title: 'Wellness Tea',
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=120',
    amazonLink: 'https://www.amazon.in/dp/B08L5WH6QZ?tag=your-affiliate-tag-20',
  },
];

export default function ShopScreen() {
  return (
    <View className="flex-1 mt-12 bg-gray-50 dark:bg-gray-900">
      <Text className="text-3xl font-extrabold text-gray-900 dark:text-white mt-8 mb-6 px-6">Shop</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ProductCard({ product }: { product: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAmazonPress = async () => {
    try {
      await Linking.openURL(product.amazonLink);
    } catch (error) {
      console.error('Error opening Amazon link:', error);
    }
  };

  return (
    <Animated.View style={[{ width: '48%', marginBottom: 16 }, animatedStyle]}>
      <Pressable
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={{ elevation: 2 }}
      >
        <Image
          source={{ uri: product.image }}
          className="h-40 w-full"
          contentFit="cover"
        />
        <View className="p-4">
          <Text className="font-medium text-gray-900 dark:text-white mb-3 text-center" numberOfLines={2}>
            {product.title}
          </Text>
          <Pressable 
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full py-2.5 items-center"
            onPress={handleAmazonPress}
          >
            <Text className="text-white font-medium text-sm">View on Amazon</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
} 