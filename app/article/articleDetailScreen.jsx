import { Feather } from "@expo/vector-icons";
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

const ArticleDetailScreen = ({ route, navigation }) => {
  const colorScheme = useColorScheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const article = {
    id: 1,
    title: "Understanding Hormonal Health: A Complete Guide for Women",
    description: "Comprehensive insights into how hormones affect every aspect of women's health and practical steps to optimize hormonal balance naturally.",
    category: "Health",
    readTime: "8 min read",
    date: "2024-12-15",
    author: {
      name: "Dr. Sarah Johnson",
      credentials: "MD, Endocrinologist",
      role: "Women's Health Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
    },
    heroImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    content: `
Hormonal health is fundamental to women's overall well-being, influencing everything from mood and energy levels to reproductive health and metabolism. Understanding how hormones work and how to support them naturally can transform your health journey.

## The Hormone Symphony

Your body produces over 50 different hormones, each playing a crucial role in maintaining balance. The key players in women's health include:

**Estrogen** - Often called the "female hormone," estrogen regulates the menstrual cycle, supports bone health, and influences mood and cognitive function.

**Progesterone** - The calming hormone that balances estrogen, supports sleep, and maintains pregnancy.

**Testosterone** - Yes, women need testosterone too! It supports muscle mass, bone density, and libido.

**Cortisol** - Your stress hormone that, when balanced, helps you respond to challenges effectively.

**Insulin** - Regulates blood sugar and affects weight management and energy levels.

## Signs of Hormonal Imbalance

Recognizing the signs of hormonal imbalance is the first step toward restoration:

- Irregular or painful periods
- Unexplained weight gain or difficulty losing weight
- Mood swings, anxiety, or depression
- Fatigue and low energy
- Sleep disturbances
- Skin issues like acne or dryness
- Hair loss or excessive hair growth
- Low libido

## Natural Ways to Support Hormonal Health

### 1. Nutrition for Hormone Balance

What you eat directly impacts your hormone production. Focus on:

- **Healthy fats**: Avocados, nuts, seeds, and olive oil provide the building blocks for hormone production
- **Quality protein**: Supports stable blood sugar and provides amino acids for hormone synthesis
- **Fiber-rich foods**: Help eliminate excess hormones from the body
- **Antioxidant-rich vegetables**: Combat inflammation that can disrupt hormone balance

### 2. Stress Management

Chronic stress elevates cortisol, which can suppress other hormones. Incorporate:

- Regular meditation or mindfulness practices
- Deep breathing exercises
- Yoga or gentle movement
- Adequate sleep (7-9 hours nightly)
- Boundaries around work and personal time

### 3. Movement and Exercise

Regular physical activity supports hormone balance by:

- Improving insulin sensitivity
- Reducing cortisol levels
- Supporting healthy weight management
- Enhancing mood through endorphin release

### 4. Sleep Optimization

Quality sleep is when many hormones are produced and regulated:

- Maintain a consistent sleep schedule
- Create a dark, cool sleeping environment
- Limit screens before bedtime
- Consider magnesium supplementation

## When to Seek Professional Help

While lifestyle changes can significantly improve hormonal health, sometimes professional support is necessary. Consider consulting a healthcare provider if:

- Symptoms persist despite lifestyle changes
- You experience severe PMS or menstrual irregularities
- You're struggling with fertility
- You have symptoms of thyroid dysfunction
- You're considering hormone replacement therapy

## The Path Forward

Remember that hormonal health is a journey, not a destination. Small, consistent changes in your daily habits can lead to significant improvements in how you feel. Start with one or two changes and gradually build upon them.

Your hormones are powerful chemical messengers that deserve respect and care. By understanding their roles and supporting them naturally, you can unlock better energy, mood, and overall vitality.

## Key Takeaways

- Hormones work together in a delicate balance
- Nutrition, stress management, and sleep are foundational
- Small lifestyle changes can have big impacts
- Professional guidance may be needed for complex issues
- Consistency is key to seeing lasting results

Take control of your hormonal health today, and experience the transformative power of balanced hormones.
    `,
    tags: ["Women's Health", "Hormones", "Wellness", "Natural Health"],
    readingProgress: 0,
    likes: 1247,
    comments: 89,
    shares: 156
  };

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
        message: `Check out this article: ${article.title}`,
        url: `https://example.com/articles/${article.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;
      
      if (paragraph.startsWith('## ')) {
        return (
          <Text key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </Text>
        );
      }
      
      if (paragraph.startsWith('### ')) {
        return (
          <Text key={index} className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </Text>
        );
      }
      
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <Text key={index} className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            {paragraph.replace(/\*\*/g, '')}
          </Text>
        );
      }
      
      if (paragraph.startsWith('- ')) {
        return (
          <Text key={index} className="text-gray-700 dark:text-gray-300 text-base leading-relaxed ml-4 mb-2">
            • {paragraph.replace('- ', '')}
          </Text>
        );
      }
      
      return (
        <Text key={index} className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4">
          {paragraph}
        </Text>
      );
    });
  };

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
          source={{ uri: article.heroImage }}
          style={{
            width: SCREEN_WIDTH,
            height: HEADER_HEIGHT,
            resizeMode: 'cover',
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
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white flex-1 text-center" numberOfLines={1}>
            {article.title}
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
        {/* Header Spacer */}
        <View style={{ height: PARALLAX_HEADER_HEIGHT }} />

        {/* Content */}
        <View className="bg-gray-50 dark:bg-gray-900 -mt-8 rounded-t-3xl overflow-hidden">
          <View className="px-6 pt-8">
            {/* Category Badge */}
            <View className="flex-row items-center mb-4">
              <View className="bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-full">
                <Text className="text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
                  {article.category}
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-4">
                {article.readTime}
              </Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4">
              {article.title}
            </Text>

            {/* Description */}
            <Text className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              {article.description}
            </Text>

            {/* Author Info */}
            <View className="flex-row items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: article.author.avatar }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View>
                  <Text className="text-gray-900 dark:text-white font-semibold text-base">
                    {article.author.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {article.author.credentials}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Engagement Stats */}
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
                    {article.likes}
                  </Text>
                </TouchableOpacity>
                
                <View className="flex-row items-center mr-6">
                  <Feather name="message-circle" size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {article.comments}
                  </Text>
                </View>
                
                <TouchableOpacity onPress={handleShare} className="flex-row items-center">
                  <Feather name="share" size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
                  <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    {article.shares}
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

            {/* Article Content */}
            <View className="mb-8">
              {formatContent(article.content)}
            </View>


            <View className="mb-8">
              <Text className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                Related Topics
              </Text>
              <View className="flex-row flex-wrap">
                {article.tags.map((tag, index) => (
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

        {/* Bottom Spacer */}
        <View className="h-20" />
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-8 right-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
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