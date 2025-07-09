import { useDoctorDataStore } from "@/modules/consult/store/useDoctorDataStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConsultScreen() {
  const doctors = useDoctorDataStore((state) => state.doctors);
  const listenToDoctors = useDoctorDataStore((state) => state.listenToDoctors);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [selected, setSelected] = useState("All");
  const floatingButtonColor = isDark ? "#8B5CF6" : "#7C3AED";
  const floatingButtonGradient = isDark
    ? ["#6366F1", "#8B5CF6"]
    : ["#93C5FD", "#C084FC"];

  useEffect(() => {
    const unsubscribe = listenToDoctors();
    return () => unsubscribe();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(doctors.map((d) => d.specialty))),
  ];
  const filtered =
    selected === "All"
      ? doctors
      : doctors.filter((d) => d.specialty === selected);

  const renderDoctor = ({ item: doctor }) => (
    <View className="mb-6">
      <View
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: isDark ? "#4b5563" : "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={isDark ? ["#1f2937", "#374151"] : ["#eef2ff", "#f3e8ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 24,
            borderRadius: 24,
          }}
        >
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row items-center">
              <Image
                source={
                  typeof doctor.avatar === "string"
                    ? { uri: doctor.avatar }
                    : require("../../assets/images/project/logo.png")
                }
                className="h-14 w-14 rounded-full mr-4 mb-2"
              />
              <View className="flex-1">
                <Text
                  className="text-lg font-bold text-gray-900 dark:text-white"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {doctor.name}
                </Text>

                <View className="flex-row items-center justify-between ">
                  
                    <Text className="text-sm text-indigo-700 dark:text-indigo-300">
                      {doctor.specialty}
                    </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name="star"
                    size={14}
                    color={isDark ? "#facc15" : "#e1b712"}
                  />
                  <Text className="text-sm text-gray-900 dark:text-white ml-1">
                    {doctor.rating}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    ({doctor.reviews})
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
            {doctor.description ||
              `Expert in ${doctor.specialty} with ${doctor.experience} experience.`}
          </Text>

          <View className="mb-3">
            <Text className="text-gray-900 dark:text-white font-semibold text-sm mb-2">
              Details:
            </Text>
            <View className="flex-row flex-wrap">
              <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-gray-700 dark:text-gray-300 text-xs">
                  🎓 {doctor.education}
                </Text>
              </View>
              <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-gray-700 dark:text-gray-300 text-xs">
                  🌐 {doctor.languages.join(", ")}
                </Text>
              </View>
              <View className="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-gray-700 dark:text-gray-300 text-xs">
                  🕒 {doctor.availability}
                </Text>
              </View>
            </View>
          </View>

          
          <View className="flex-row  space-x-3">
            <Pressable className="flex-1 rounded-xl bg-white py-3 items-center justify-center border border-gray-300 mr-1">
              <Text className="text-black font-medium">Book Consultation</Text>
            </Pressable>

            <Pressable
              className="flex-1 rounded-xl overflow-hidden ml-1"
              onPress={() =>
                router.push({
                  pathname: "/consult/viewdoctorprofile",
                  params: { id: doctor.id },
                })
              }
            >
              <LinearGradient
                colors={floatingButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  shadowColor: floatingButtonColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                }}
              >
                <Text className="text-white font-semibold">View Profile</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-black text-gray-900 dark:text-white mb-1">
          Doctors
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-base">
          Consult top-rated professionals
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-4"
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
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Text className="text-gray-400 dark:text-gray-500 text-base">
            No doctors found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctor}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 100,
            borderRadius: 24,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
