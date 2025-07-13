import useArticleStore from "@/modules/articles/store/useArticleStore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 400;
const PARALLAX_HEADER_HEIGHT = 350;

const ArticleDetailScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter()
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const { selectedArticle } = useArticleStore();

  if (!selectedArticle) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">
          No article selected
        </Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, PARALLAX_HEADER_HEIGHT],
    outputRange: [0, -PARALLAX_HEADER_HEIGHT * 0.5],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, PARALLAX_HEADER_HEIGHT * 0.5, PARALLAX_HEADER_HEIGHT],
    outputRange: [1, 0.8, 0.3],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, PARALLAX_HEADER_HEIGHT * 0.3, PARALLAX_HEADER_HEIGHT * 0.8],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${selectedArticle.title}`,
        url: `https://example.com/articles/${selectedArticle.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const formatContent = (content) => {
    if (!content) return null;
    
    const sections = [
      { title: "Introduction", content: content.introduction },
      { title: "Key Findings", content: content.keyFindings },
      { title: "Causes", content: content.causes },
      { title: "Management", content: content.management },
      { title: "Conclusion", content: content.conclusion },
      { title: "References", content: content.references },
    ];

    return sections.map((section, sectionIndex) => {
      if (!section.content) return null;
      
      return (
        <View key={sectionIndex} className="mb-6">
          {section.content.split('\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            
            const key = `${sectionIndex}-${index}`;
            
            if (paragraph.startsWith('##') || paragraph.match(/^[A-Z][a-z\s]+$/)) {
              return (
                <Text key={key} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                  {paragraph.replace(/^##\s*/, '')}
                </Text>
              );
            }
            
            if (paragraph.startsWith('###') || paragraph.match(/^[A-Z][a-z\s]+Factors$/)) {
              return (
                <Text key={key} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                  {paragraph.replace(/^###\s*/, '')}
                </Text>
              );
            }
            
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <Text key={key} className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                  {paragraph.replace(/\*\*/g, '')}
                </Text>
              );
            }
            
            if (paragraph.startsWith('•')) {
              return (
                <Text key={key} className="text-gray-700 dark:text-gray-300 text-base leading-relaxed ml-4 mb-2">
                  {paragraph}
                </Text>
              );
            }
            
            return (
              <Text key={key} className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">
                {paragraph}
              </Text>
            );
          })}
        </View>
      );
    });
  };

  const heroImage = selectedArticle.heroImage || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop";
  
  const authorAvatar = selectedArticle.author?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face";

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}
      >
        <Image
          source={{ uri: heroImage }}
          style={{
            width: SCREEN_WIDTH,
            height: HEADER_HEIGHT,
            resizeMode: 'cover',
            backgroundColor: 'white'
          }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 150,
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          paddingTop: 50,
          paddingHorizontal: 20,
          backgroundColor: colorScheme === 'dark' ? 'rgba(17, 24, 39, 1)' : 'rgba(249, 250, 251, 1)',
          opacity: titleOpacity,
          zIndex: 1000,
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center" numberOfLines={1}>
            {selectedArticle.title}
          </Text>
          <TouchableOpacity onPress={handleShare} className="p-2">
            <Feather name="share" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={{ height: PARALLAX_HEADER_HEIGHT }} />

        <View className="bg-gray-50 dark:bg-gray-900 -mt-8 rounded-t-3xl overflow-hidden">
          <View className="px-6 pt-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-full">
                <Text className="text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                  {selectedArticle.category}
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-4">
                {selectedArticle.readTime}
              </Text>
            </View>

            <Text className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {selectedArticle.title}
            </Text>

            <Text className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              {selectedArticle.description}
            </Text>

            <View className="flex-row items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: authorAvatar }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View>
                  <Text className="text-gray-900 dark:text-white font-semibold text-base">
                    {selectedArticle.author?.name || 'Unknown Author'}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {selectedArticle.author?.credentials || selectedArticle.author?.role || 'Specialist'}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(selectedArticle.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => setIsLiked(!isLiked)}
                  className="flex-row items-center mr-6"
                >
                  <Feather 
                    name="heart" 
                    size={20} 
                    color={isLiked ? '#ef4444' : (colorScheme === 'dark' ? '#9ca3af' : '#6b7280')}
                    fill={isLiked ? '#ef4444' : 'transparent'}
                  />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {selectedArticle.likes || 0}
                  </Text>
                </TouchableOpacity>
                
                <View className="flex-row items-center mr-6">
                  <Feather name="message-circle" size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {selectedArticle.comments || 0}
                  </Text>
                </View>
                
                <TouchableOpacity onPress={handleShare} className="flex-row items-center">
                  <Feather name="share" size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {selectedArticle.shares || 0}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
                <Feather 
                  name="bookmark" 
                  size={20} 
                  color={isBookmarked ? '#3b82f6' : (colorScheme === 'dark' ? '#9ca3af' : '#6b7280')}
                  fill={isBookmarked ? '#3b82f6' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            {selectedArticle.keyPoints && (
              <View className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <Text className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Key Points
                </Text>
                {selectedArticle.keyPoints.map((point, index) => (
                  <Text key={index} className="text-blue-800 dark:text-blue-200 text-base mb-2">
                    • {point}
                  </Text>
                ))}
              </View>
            )}

            <View className="mb-8">
              {formatContent(selectedArticle.content)}
            </View>

            <View className="mb-8">
              <Text className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                Related Topics
              </Text>
              <View className="flex-row flex-wrap">
                {selectedArticle.tags?.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full mr-3 mb-3 border border-gray-200 dark:border-gray-600"
                  >
                    <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <LinearGradient
              colors={colorScheme === 'dark' ? ['#1f2937', '#374151'] : ['#eef2ff', '#f3e8ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-600 overflow-hidden"
            >
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Found this helpful?
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-base mb-4">
                Share your thoughts and help other women on their health journey.
              </Text>
              <TouchableOpacity className="bg-gray-900 dark:bg-white py-3 px-6 rounded-full self-start">
                <Text className="text-white dark:text-gray-900 font-semibold">
                  Leave a Comment
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View className="h-20" />
      </Animated.ScrollView>

      <View className="absolute bottom-8 right-6">
        <TouchableOpacity onPress={() => router.back()}>
          <LinearGradient
            colors={['#6366f1', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Feather name="arrow-up" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArticleDetailScreen;