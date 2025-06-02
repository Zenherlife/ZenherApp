import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

const products = [
  {
    id: 1,
    title: 'Organic Cotton Pads',
    image: 'https://images.pexels.com/photos/8532612/pexels-photo-8532612.jpeg?auto=compress&w=120',
    price: '₹84.00',
    rating: 4.5,
    reviews: 128,
    tag: 'Eco-Friendly',
  },
  {
    id: 2,
    title: 'Period Pain Relief Patch',
    image: 'https://images.pexels.com/photos/8532613/pexels-photo-8532613.jpeg?auto=compress&w=120',
    price: '₹105.00',
    rating: 4.7,
    reviews: 89,
    tag: 'Top Rated',
  },
  {
    id: 3,
    title: 'Monthly Subscription',
    image: 'https://images.pexels.com/photos/8532614/pexels-photo-8532614.jpeg?auto=compress&w=120',
    price: '₹79.00',
    rating: 4.8,
    reviews: 245,
    tag: 'Best Seller',
  },
];

const articles = [
  {
    id: 1,
    title: 'Understanding Your Cycle',
    desc: 'Learn the phases of your cycle and how they affect your body.',
    image: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/valentines-day-2028246_1280.png',
  },
  {
    id: 2,
    title: 'Nutrition Tips for Hormones',
    desc: 'Discover foods that support your hormonal health.',
    image: 'https://cdn.pixabay.com/photo/2016/11/18/14/25/girl-1839623_1280.jpg',
  },
  {
    id: 3,
    title: 'Managing PMS Naturally',
    desc: 'Effective strategies to ease premenstrual symptoms.',
    image: 'https://cdn.pixabay.com/photo/2017/01/31/13/14/valentines-day-2028246_1280.png',
  },
];

const insights = [
  {
    id: 1,
    title: 'Master Your Cycle Phases',
    desc: 'Explore the four key stages of your menstrual cycle and their impact on your wellbeing.',
    icon: '🌙',
    bg: 'bg-indigo-50',
  },
  {
    id: 2,
    title: 'Ease PMS Naturally',
    desc: 'Uncover holistic remedies and lifestyle tips to soothe PMS discomfort.',
    icon: '🌿',
    bg: 'bg-green-50',
  },
  {
    id: 3,
    title: 'Nourish for Hormone Harmony',
    desc: 'Learn which foods support balanced hormones throughout your cycle.',
    icon: '🥑',
    bg: 'bg-yellow-50',
  },
];

export default function HomeScreen() {
  // Animation for the button
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Animation for the illustration (gentle up/down float)
  const [float, setFloat] = useState(true);
  const floatValue = useSharedValue(0);
  floatValue.value = withSpring(float ? -10 : 10, { damping: 2, stiffness: 40, mass: 0.5 });
  setTimeout(() => setFloat(!float), 2000);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatValue.value }],
  }));

  // For demo: cycle day and total days
  const currentDay = 5;
  const totalDays = 28;
  const progress = currentDay / totalDays;

  const logo = require('../assets/images/project/logo.png');
  const heroImage = require('../assets/images/project/hero-image.png');

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Fixed Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 flex-row items-center justify-between px-6 h-16 shadow-md" style={{ elevation: 4 }}>
        <View className="flex-row items-center">
          <Image
            source={logo}
            className="h-7 w-7 mr-2"
            contentFit="contain"
          />
          <Text className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Zenher</Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <Pressable className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Ionicons name="notifications-outline" size={22} color="#6B7280" />
          </Pressable>
          <View className="h-8 w-8 rounded-full bg-black items-center justify-center">
            <Text className="text-white font-bold">SM</Text>
          </View>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, alignItems: 'center', paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="flex-row items-center mb-8">
          <Image
            source={logo}
            className="h-8 w-8 mr-2"
            contentFit="contain"
          />
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Zenher</Text>
        </View>
        {/* Title */}
        <Text className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">Discover Zenher</Text>
        {/* Subtitle */}
        <Text className="text-lg text-center text-gray-500 dark:text-gray-300 mb-8 max-w-md">
          Effortlessly track your cycle, connect with wellness experts, and unlock personalized health insights—all in one beautifully designed space.
        </Text>
        {/* Hero Illustration (local image) */}
        <View className="mb-8 w-full items-center">
          <Image
            source={heroImage}
            className="h-64 w-64 max-w-full"
            contentFit="contain"
          />
        </View>
        {/* Get Started Button (polished) */}
        <Pressable
          className="w-56 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 py-4 shadow-xl mb-10"
          android_ripple={{ color: '#a21caf' }}
          style={{ elevation: 4 }}
        >
          <Text className="text-white text-lg font-bold text-center">Get Started</Text>
        </Pressable>
        {/* Your Cycle Card */}
        <View className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6 relative">
          {/* Day badge */}
          <View className="absolute right-4 top-4 bg-gradient-to-r from-pink-400 to-purple-400 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">Day {currentDay}</Text>
          </View>
          <Text className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">Your Cycle</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-300 mb-4">Day {currentDay} of {totalDays}</Text>
          <View className="flex-row items-center mb-4">
            {/* Circular Progress */}
            <Svg height="70" width="70" className="mr-4">
              <Circle
                cx="35"
                cy="35"
                r="30"
                stroke="#E5E7EB"
                strokeWidth="7"
                fill="none"
              />
              <Circle
                cx="35"
                cy="35"
                r="30"
                stroke="#A21CAF"
                strokeWidth="7"
                fill="none"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={2 * Math.PI * 30 * (1 - progress)}
                strokeLinecap="round"
                rotation="-90"
                origin="35,35"
              />
            </Svg>
            <View>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">{currentDay}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-300 text-center">Current Day</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 mt-2">
            <View className="flex-row items-center">
              <Text className="text-lg mr-2">📅</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-200">Next Period</Text>
            </View>
            <Text className="text-sm font-bold text-purple-600">23 days</Text>
          </View>
        </View>
        {/* Your Consultations Card */}
        <View className="w-full bg-blue-50 dark:bg-blue-950 rounded-2xl shadow-md p-5 mb-6">
          <Text className="text-lg font-extrabold text-gray-900 dark:text-white mb-3">Your Consultations</Text>
          <View className="bg-blue-100 dark:bg-blue-900 rounded-xl p-4 flex-row items-center mb-4">
            {/* Doctor Avatar */}
            <View className="h-12 w-12 rounded-full bg-blue-300 dark:bg-blue-700 items-center justify-center mr-4">
              <Text className="text-lg font-bold text-white">SJ</Text>
            </View>
            {/* Doctor Info */}
            <View className="flex-1">
              <Text className="font-bold text-gray-900 dark:text-white">Dr. Sarah Johnson</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-300 mb-1">Gynecologist</Text>
              <View className="flex-row items-center mb-1">
                <Text className="text-xs mr-2">📅</Text>
                <Text className="text-xs text-gray-700 dark:text-gray-200">May 10, 2025</Text>
                <Text className="text-xs mx-2">⏰</Text>
                <Text className="text-xs text-gray-700 dark:text-gray-200">3:00 PM</Text>
              </View>
              <View className="flex-row mt-2 space-x-2">
                <Pressable className="flex-1 rounded-full bg-teal-400 py-2 items-center justify-center shadow"
                  android_ripple={{ color: '#2dd4bf' }}>
                  <Text className="text-white font-bold">Join Call</Text>
                </Pressable>
                <Pressable className="flex-1 rounded-full bg-red-100 dark:bg-red-900 py-2 items-center justify-center border border-red-300 dark:border-red-700">
                  <Text className="text-red-600 dark:text-red-200 font-bold">Reschedule</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {/* Recommended for You Carousel */}
        <View className="w-full mb-6">
          <Text className="text-lg font-extrabold text-gray-900 dark:text-white mb-3">Recommended for You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
            {products.map((product) => (
              <View key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 mx-2 w-48">
                <Image
                  source={{ uri: product.image }}
                  className="h-24 w-full rounded-lg mb-2"
                  contentFit="cover"
                />
                <Text className="font-bold text-gray-900 dark:text-white mb-1" numberOfLines={2}>{product.title}</Text>
                <View className="flex-row items-center mb-1">
                  <Text className="text-xs text-yellow-500 mr-1">★</Text>
                  <Text className="text-xs text-gray-700 dark:text-gray-200 mr-1">{product.rating}</Text>
                  <Text className="text-xs text-gray-400">({product.reviews})</Text>
                  {product.tag && (
                    <Text className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{product.tag}</Text>
                  )}
                </View>
                <Text className="font-bold text-base text-gray-900 dark:text-white mb-2">{product.price}</Text>
                <Pressable className="bg-blue-600 rounded-full py-2 items-center">
                  <Text className="text-white font-bold">Add to Cart</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Explore Our Articles */}
        <View className="w-full mb-6">
          <Text className="text-lg font-extrabold text-gray-900 dark:text-white mb-3">Explore Our Articles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
            {articles.map((article) => (
              <View key={article.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 mx-2 w-64">
                <Image
                  source={{ uri: article.image }}
                  className="h-28 w-full rounded-lg mb-2"
                  contentFit="cover"
                />
                <Text className="font-bold text-gray-900 dark:text-white mb-1" numberOfLines={2}>{article.title}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-300" numberOfLines={2}>{article.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* Wellness Insights */}
        <View className="w-full mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-extrabold text-gray-900 dark:text-white">Wellness Insights</Text>
            <Pressable className="px-4 py-1 rounded-full border border-purple-500">
              <Text className="text-purple-600 font-bold">Explore All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
            {insights.map((insight) => (
              <View key={insight.id} className={`rounded-2xl shadow-md p-4 mx-2 w-64 ${insight.bg} dark:bg-gray-800`}>
                <View className="h-10 w-10 rounded-full bg-white items-center justify-center mb-3">
                  <Text className="text-2xl">{insight.icon}</Text>
                </View>
                <Text className="font-bold text-gray-900 dark:text-white mb-1" numberOfLines={2}>{insight.title}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-300" numberOfLines={3}>{insight.desc}</Text>
                <View className="flex-row justify-end mt-2">
                  <Text className="text-xl text-gray-400">→</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
} 