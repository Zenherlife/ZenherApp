import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PeriodScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const setField = useUserDataStore((state) => state.setField);
  const updateUserData = useUserDataStore((state) => state.updateUserData);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { mode } = useLocalSearchParams<{ mode?: "add" | "edit" }>();
  const isEdit = mode === "edit";

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-6">
      {/* Back Button */}
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "black"}
        />
      </TouchableOpacity>

      {/* Red Drop Icon */}
      <View className="items-center justify-center mt-12 mb-6">
        <View className="bg-red-500 rounded-full w-20 h-20 items-center justify-center">
          <Ionicons name="water" size={30} color="white" />
        </View>
      </View>

      {/* Title */}
      <Text className="text-black dark:text-white text-2xl font-bold text-center mb-2">
        When did your last period start?
      </Text>

      {/* Subtitle */}
      <Text className="text-black dark:text-white text-center opacity-80 mb-4">
        We can then predict your next period.
      </Text>

      {/* Calendar */}
      <Calendar
        current={new Date().toISOString().split("T")[0]}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: isDark ? "white" : "#283593",
          },
        }}
        theme={{
          todayTextColor: "#ff5656",
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: isDark ? "#ffffff" : "black",
          dayTextColor: isDark ? "#ffffff" : "black",
          monthTextColor: isDark ? "#ffffff" : "black",
          arrowColor: isDark ? "#ffffff" : "black",
          textDisabledColor: "gray",
          selectedDayTextColor: isDark ? "#000000" : "white",
        }}
      />

      {/* Buttons */}
      <View className="flex-row justify-between mt-6 px-2 gap-4">
        {isEdit ? (
          <>
            <TouchableOpacity
              className="flex-1 h-14 bg-gray-300 dark:bg-white/30 rounded-full  items-center justify-center px-8"
              onPress={() => {
                router.back();
              }}
            >
              <Text className="text-black dark:text-white font-semibold text-lg">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-14 bg-indigo-800 dark:bg-white rounded-full items-center justify-center px-8"
              onPress={async () => {
                setField("lastPeriodDate", selectedDate);
                await updateUserData({ lastPeriodDate: selectedDate });
                router.back();
              }}
            >
              <Text className="text-white dark:text-black font-semibold text-lg">
                Update
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              className="flex-1 h-14 bg-gray-300 dark:bg-white/30 rounded-full  items-center justify-center px-8"
              onPress={() => {
                router.push("./AverageCycle");
              }}
            >
              <Text className="text-black dark:text-white font-semibold text-lg">
                Not sure
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-14 bg-indigo-800 dark:bg-white rounded-full items-center justify-center px-8"
              onPress={() => {
                setField("lastPeriodDate", selectedDate);
                router.push("./AverageCycle");
              }}
            >
              <Text className="text-white dark:text-black font-semibold text-lg">
                Next
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
