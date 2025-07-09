import { useDoctorDataStore } from "@/modules/consult/store/useDoctorDataStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewDoctorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const doctors = useDoctorDataStore((state) => state.doctors);
  const listenToDoctors = useDoctorDataStore((state) => state.listenToDoctors);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const unsubscribe = listenToDoctors();
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const doctor = doctors.find((d) => String(d.id) === String(id));

  if (loading || doctors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#a993ff" />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-black dark:text-white text-base">
          Doctor not found
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <Pressable onPress={router.back} className="mb-4 px-6 mt-4">
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "white" : "black"}
          />
        </Pressable>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 mb-2 px-6 "
      showsVerticalScrollIndicator={false}>

        <View className="items-center mb-6">
          <Image
            source={
              typeof doctor.avatar === "string"
                ? { uri: doctor.avatar }
                : require("../../assets/images/project/logo.png")
            }
            className="h-28 w-28 rounded-full mb-4"
          />
          <Text className="text-black dark:text-white text-2xl font-semibold">
            {doctor.name}
          </Text>
          <Text className="text-blue-600 dark:text-[#6c8bff] text-sm mt-1">
            {doctor.specialty}
          </Text>

          <View className="flex-row items-center mt-2">
            <Ionicons
              name="star"
              size={16}
              color={isDark ? "#facc15" : "#e1b712"}
            />
            <Text className="text-yellow-500 dark:text-yellow-400 text-base font-semibold ml-1">
              {doctor.rating}
            </Text>
            <Text className="text-gray-900 dark:text-gray-400 ml-2">
              {doctor.reviews} • Reviews
            </Text>
          </View>

          <Text className="text-center text-gray-700 dark:text-gray-300 mt-3 px-4">
            {doctor.tagline || "Dedicated to providing high-quality care."}
          </Text>
        </View>

        <SectionCard
          title="About Me"
          icon="person-circle-outline"
          content={doctor.about || "No description available."}
        />
        <SectionCard
          title="Experience"
          icon="briefcase-outline"
          content={doctor.experience || "Not provided"}
        />
        <SectionCard
          title="Education & Certifications"
          icon="school-outline"
          content={doctor.education || "Not provided"}
        />
        <SectionCard
          title="Languages"
          icon="language-outline"
          content={doctor.languages?.join(", ") || "Not specified"}
        />
        <SectionCard
          title="Availability"
          icon="time-outline"
          content={doctor.availability || "Not listed"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({
  title,
  content,
  icon,
}: {
  title: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden mb-2">
      <View className="p-5">
        <View className="flex-row items-center mb-2">
          <Ionicons
            name={icon}
            size={18}
            color={isDark ? "#ffffff" : "#111827"}
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-900 dark:text-white font-semibold text-base">
            {title}
          </Text>
        </View>
        <Text className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed ">
          {content}
        </Text>
      </View>
    </View>
  );
}
