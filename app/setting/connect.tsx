import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import SocialFooter from "@/modules/home/components/SocialFooter";
import { calculateProfileCompletion } from "@/modules/home/utils/profileUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectScreen() {
  const router = useRouter();
  const user = useUserDataStore((state) => state);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const profileCompletion = calculateProfileCompletion(user);

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content");
  }, [isDark]);
  return (
    <SafeAreaView className="flex-1 dark:bg-gray-900 bg-backLight ">
      <View className="flex-row justify-between items-center mb-2 px-6">
        <TouchableOpacity
          className="flex-row items-center mt-4"
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="text-black dark:text-white text-2xl font-semibold ml-4">
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 pt-2"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mb-4">
          <View className="bg-white dark:bg-gray-800 rounded-3xl px-4 pt-4 shadow-lg shadow-indigo-100 dark:shadow-none">
            <View className="flex-row items-center mb-4 gap-4">
              <View className="w-16 h-16 rounded-full bg-indigo-500 items-center justify-center shadow-lg shadow-indigo-300 overflow-hidden">
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-2xl font-black">
                    {(user?.displayName || " ")[0].toUpperCase()}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {user?.displayName || " "}
                </Text>
                <Text
                  className="text-gray-500 dark:text-gray-300 font-medium text-sm"
                  numberOfLines={1}
                >
                  {user?.email || " "}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push("/auth/logout")}
                className="rounded-full border-2 border-white/20 active:opacity-80"
              >
                <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2">
                  <Ionicons name="create-outline" size={20} color="#6366f1" />
                  <Text className="text-sm text-black dark:text-white ml-2">
                    Edit
                  </Text>
                </View>
              </Pressable>
            </View>
            {profileCompletion < 1 && (
              <View className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-900 dark:text-white font-bold tracking-tight">
                    Profile Completion
                  </Text>
                  <Text className="text-indigo-500 font-extrabold text-lg tracking-wider">
                    {Math.round(profileCompletion * 100)}%
                  </Text>
                </View>

                <View className="h-3 bg-gray-800 rounded-full overflow-hidden w-full relative">
                  <LinearGradient
                    colors={["#6366f1", "#4f46e5", "#4338ca", "#818cf8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />

                  <View
                    className="absolute h-full bg-gray-800 right-0"
                    style={{
                      width: `${(1 - profileCompletion) * 100}%`,
                      borderTopRightRadius: 9999,
                      borderBottomRightRadius: 9999,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="px-6">
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2 mt-6">
            HEALTH & WELLNESS
          </Text>
          {[
            {
              title: "BMI & Health Metrics",
              icon: "body-outline",
              onPress: () => router.push("/setting/BMI"),
            },
            {
              title: "Cycle Management",
              icon: "time-outline",
              onPress: () =>
                router.push({
                  pathname: "/auth/onboard/AverageCycle",
                  params: { mode: "edit" },
                }),
            },
            {
              title: "Smart Reminders",
              icon: "notifications-outline",
              onPress: () =>
                router.push({
                  pathname: "/auth/onboard/reminder",
                  params: { mode: "edit" },
                }),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center py-4"
              onPress={item.onPress}
            >
              <View className="flex-row items-center space-x-4">
                <Ionicons name={item.icon} size={22} color={isDark ? "white" : "black"} />
                <Text className="text-black dark:text-white text-base ml-4">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={ isDark ? "#aaa" : "#787878"} />
            </TouchableOpacity>
          ))}

          <View className="border-t border-gray-400 dark:border-gray-700 my-4" />

          
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">PERSONALIZATION</Text>
          {[
            {
              title: "Tracking Preferences",
              icon: "options-outline",
              onPress: () => {},
            },
            {
              title: "Privacy Policy",
              icon: "lock-closed-outline",
              onPress: () => router.push("/setting/Privacy"),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center py-4"
              onPress={item.onPress}
            >
              <View className="flex-row items-center space-x-4">
                <Ionicons name={item.icon} size={22} color={isDark ? "white" : "black"} />
                <Text className="text-black dark:text-white text-base ml-4">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={ isDark ? "#aaa" : "#787878"} />
            </TouchableOpacity>
          ))}

          <View className="border-t border-gray-400 dark:border-gray-700 my-4" />

          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            SUPPORT & RESOURCES
          </Text>
          {[
            {
              title: "Help Center",
              icon: "help-circle-outline",
              onPress: () =>
                Linking.openURL("https://zenherapp.vercel.app/help"),
            },
            {
              title: "Contact Support",
              icon: "mail-outline",
              onPress: () => Linking.openURL("mailto:support@zenher.com"),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center py-4"
              onPress={item.onPress}
            >
              <View className="flex-row items-center space-x-4">
                <Ionicons name={item.icon} size={22} color={isDark ? "white" : "black"} />
                <Text className="text-black dark:text-white text-base ml-4">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={ isDark ? "#aaa" : "#787878"} />
            </TouchableOpacity>
          ))}
        </View>

        

        <SocialFooter />
      </ScrollView>
    </SafeAreaView>
  );
}
