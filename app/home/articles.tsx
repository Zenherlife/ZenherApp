import useArticleStore from "@/modules/articles/store/useArticleStore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";



const ArticlesScreen = () => {
  const { articles, fetchArticles } = useArticleStore();
  const [selected, setSelected] = useState("All");
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchArticles();
  }, []);

  const filtered =
    selected === "All"
      ? articles
      : articles.filter((a) => a.category === selected);

  const categories = [
    "All",
    ...Array.from(
      new Set(articles.map((article) => article.category))
    ),
  ];

  const renderFeaturedArticle = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity className="mb-8">
          <LinearGradient
            colors={
              colorScheme === "dark"
                ? ["#1f2937", "#374151"]
                : ["#eef2ff", "#f3e8ff"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 border border-gray-100 dark:border-gray-600 overflow-hidden"
          >
            <View className="flex-row items-center mb-3">
              <View className="bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full">
                <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wide">
                  Featured
                </Text>
              </View>
              <View className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full ml-2">
                <Text className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {item.category}
                </Text>
              </View>
            </View>

            <Text className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
              {item.title}
            </Text>

            <Text className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
              {item.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#6366f1", "#a855f7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text className="text-white font-bold text-sm">
                    {item.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </LinearGradient>
                <View>
                  <Text className="text-gray-900 dark:text-white font-semibold text-sm">
                    {item.author.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    {item.author.credentials}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 dark:text-white font-semibold text-sm">
                  {item.readTime}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderRegularArticle = ({ item, index }) => {
    if (index === 0) return null;

    return (
      <TouchableOpacity className="mb-6">
        <View className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden">
          <View className="p-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <Text className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {item.category}
                </Text>
              </View>
              <Text className="text-gray-400 dark:text-gray-500 text-xs ml-3">
                {item.readTime}
              </Text>
            </View>

            <Text className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              {item.title}
            </Text>

            <Text className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              {item.description}
            </Text>

            <View className="mb-4">
              <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-2">
                Key Points:
              </Text>
              <View className="flex-row flex-wrap">
                {item.keyPoints.slice(0, 2).map((point, i) => (
                  <View
                    key={i}
                    className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-gray-700 dark:text-gray-300 text-xs">
                      •{" "}
                      {point.length > 30
                        ? point.substring(0, 30) + "..."
                        : point}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#3b82f6", "#14b8a6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Text className="text-white font-bold text-xs">
                    {item.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </LinearGradient>
                <View>
                  <Text className="text-gray-900 dark:text-white font-medium text-sm">
                    {item.author.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">
                    {item.author.role}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 pt-4 pb-4">
        <Text className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Articles
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-base">
          Expert insights on women's health and wellness
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-8"
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelected(category)}
            className={`px-5 h-10 rounded-full justify-center items-center mr-3 border ${
              selected === category
                ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selected === category
                  ? "text-white dark:text-gray-900"
                  : "text-gray-700 dark:text-gray-300"
              }`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24}}
        ListFooterComponent={() =>
          <View className="h-24" ></View>
        }
        ListHeaderComponent={() =>
          filtered.length > 0
            ? renderFeaturedArticle({ item: filtered[0], index: 0 })
            : null
        }
        renderItem={renderRegularArticle}
        ItemSeparatorComponent={() => <View className="h-0" />}
      />
    </View>
  );
};

export default ArticlesScreen;
