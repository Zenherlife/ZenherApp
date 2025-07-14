import { useShopStore } from "@/modules/shop/store/useShopStore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  Image as RNImage,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShopScreen() {
  const { products, fetchProducts } = useShopStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
  fetchProducts();
}, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);


  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
    >
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View className="px-5 pt-4 pb-2">
              <Text className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                Shop
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-base">
                Curated picks to support your wellness
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="py-4"
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-5 h-10 rounded-full justify-center items-center mr-3 border ${
                    selectedCategory === category
                      ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedCategory === category
                        ? "text-white dark:text-gray-900"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </SafeAreaView>
  );
}
type Product = {
  id: number;
  title: string;
  image: string;
  amazonLink: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
};
function ProductCard({ product }: { product: Product }) {
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const gradientColors = isDark
    ? ["#6366F1", "#8B5CF6"]
    : ["#93C5FD", "#C084FC"];
  const pillTextColor = isDark ? "white" : "white";
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRedirectPress = async () => {
    try {
      await Linking.openURL(product.amazonLink);
    } catch (error) {
      console.error("Error opening Amazon link:", error);
    }
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );

  const formatPrice = (price?: number | null): string => {
    if (price === null || price === undefined || isNaN(price)) {
      return "NA";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Animated.View style={[{ width: "48%", marginBottom: 20 }, animatedStyle]}>
      <Pressable
        onPress={handleRedirectPress}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        className="rounded-2xl bg-white dark:bg-gray-800 p-3"
        style={{
          borderRadius: 20,
          shadowColor: `${isDark ? "#111827" : "#888888"}`,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 1,
          shadowRadius: 20,
          elevation: 15,
        }}
      >
        <View className="rounded-xl overflow-hidden relative mb-2">
          <RNImage
            source={{ uri: product.image }}
            style={{
              width: "100%",
              height: 120,
              resizeMode: "cover",
            }}
          />

          <View className="absolute top-2 right-2 bg-red-400 px-2 py-1 rounded-full">
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 8 }}>
              {discountPercent}% OFF
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            marginBottom: 6,
          }}
        >
          <Text
            style={{ color: pillTextColor, fontWeight: "600", fontSize: 8 }}
          >
            {product.category}
          </Text>
        </LinearGradient>

        <Text
          className="text-gray-900 dark:text-white text-base font-semibold mb-1"
          numberOfLines={2}
        >
          {product.title}
        </Text>

        <View className="flex-row items-center space-x-2">
          <Text className="text-green-600 dark:text-green-400 font-bold text-base mr-1">
            {formatPrice(product.discountedPrice)}
          </Text>
          <Text className="text-gray-500 line-through text-sm">
            {formatPrice(product.originalPrice)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}