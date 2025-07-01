import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import WellnessModal from "@/modules/home/components/WellnessModal";
import {
  SelectedDate,
  WellnessCategory,
  WellnessOption,
  WellnessOptions,
} from "@/modules/home/utils/types";
import { useWellnessStore } from "@/modules/track/store/useWellnessStore";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { uid } = useUserDataStore();

  const {
    entries,
    loading: wellnessLoading,
    error: wellnessError,
    addOrUpdateEntry,
    subscribeToMonth,
    setCurrentMonth,
    currentMonth,
    currentYear,
  } = useWellnessStore();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayEntry = entries[todayKey];

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [quote, setQuote] = useState("");

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const wellnessOptions: WellnessOptions = {
    flow: [
      { label: "Light", color: "#fef3c7", textColor: "#d97706" },
      { label: "Medium", color: "#fed7aa", textColor: "#ea580c" },
      { label: "Heavy", color: "#fca5a5", textColor: "#dc2626" },
      { label: "Super Heavy", color: "#f87171", textColor: "#b91c1c" },
    ],
    feelings: [
      { label: "Mood Swings", color: "#e0e7ff", textColor: "#6366f1" },
      { label: "Not in Control", color: "#fee2e2", textColor: "#ef4444" },
      { label: "Fine", color: "#f0fdf4", textColor: "#22c55e" },
      { label: "Happy", color: "#fef3c7", textColor: "#f59e0b" },
      { label: "Sad", color: "#dbeafe", textColor: "#3b82f6" },
      { label: "Confident", color: "#ecfdf5", textColor: "#10b981" },
      { label: "Excited", color: "#fdf2f8", textColor: "#ec4899" },
      { label: "Irritable", color: "#fef2f2", textColor: "#f87171" },
      { label: "Anxious", color: "#f3e8ff", textColor: "#a855f7" },
      { label: "Insecure", color: "#f1f5f9", textColor: "#64748b" },
      { label: "Grateful", color: "#f0f9ff", textColor: "#0ea5e9" },
      { label: "Indifferent", color: "#f8fafc", textColor: "#6b7280" },
    ],
    sleep: [
      {
        label: "Trouble Falling Asleep",
        color: "#fef2f2",
        textColor: "#dc2626",
      },
      { label: "Woke Up Refreshed", color: "#f0fdf4", textColor: "#16a34a" },
      { label: "Woke Up Tired", color: "#fefce8", textColor: "#ca8a04" },
      { label: "Restless Sleep", color: "#fdf4ff", textColor: "#c026d3" },
      { label: "Vivid Dreams", color: "#eff6ff", textColor: "#2563eb" },
      { label: "Night Sweats", color: "#fff7ed", textColor: "#ea580c" },
    ],
  };

  useEffect(() => {
    if (!uid) return;

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    setCurrentMonth(month, year);

    const unsubscribe = subscribeToMonth(uid, month, year);

    return unsubscribe;
  }, [uid, currentDate, subscribeToMonth, setCurrentMonth]);

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const animateTransition = (direction: "next" | "prev"): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "next" ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(direction === "next" ? 20 : -20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const changeMonth = (direction: "next" | "prev"): void => {
    animateTransition(direction);

    const newDate = new Date(currentDate);
    if (direction === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const handleDayPress = (day: number | null): void => {
    if (!day) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setSelectedDate({
      day,
      month,
      year,
      key: dateKey,
    });
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  const updateWellnessData = async (
    category: WellnessCategory,
    option: WellnessOption
  ): Promise<void> => {
    if (!selectedDate || !uid) return;

    try {
      await addOrUpdateEntry(uid, selectedDate.key, category, option);
    } catch (error) {
      console.error("Error updating wellness data:", error);
    }
  };

  const isToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isAfterToday = (day: number | null): boolean => {
    if (!day) return false;
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    inputDate.setHours(0, 0, 0, 0);

    return inputDate > today;
  };

  const hasWellnessData = (day: number | null): boolean => {
    if (!day) return false;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const entry = entries[dateKey];
    return entry && (entry.flow || entry.feelings || entry.sleep);
  };

  const getWellnessData = () => {
    const wellnessData: Record<string, any> = {};

    Object.values(entries).forEach((entry) => {
      wellnessData[entry.date] = {
        flow: entry.flow,
        feelings: entry.feelings,
        sleep: entry.sleep,
      };
    });

    return wellnessData;
  };

  const days = getDaysInMonth(currentDate);

  const WellnessChip = ({ option }: { option: WellnessOption }) => (
    <View
      className="px-5 py-2 mr-2 mb-2 rounded-2xl"
      style={{
        backgroundColor: option.color,
        shadowColor: option.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text
        className="text-sm font-semibold tracking-wide"
        style={{ color: option.textColor }}
      >
        {option.label}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 dark:bg-gray-900 bg-gray-50">
       <ScrollView
    contentContainerStyle={{ paddingBottom: 100 }}
    showsVerticalScrollIndicator={false}
  >
      <View className="px-6 pt-6 pb-3">
        <View
          className={`p-4 rounded-2xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <Text
            className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Today
          </Text>
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View className="px-6 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => changeMonth("prev")}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={isDark ? "#f3f4f6" : "#374151"} />
          </TouchableOpacity>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <Text
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </Animated.View>

          <TouchableOpacity
            onPress={() => changeMonth("next")}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
            activeOpacity={0.7}
          >
            <ChevronRight size={24} color={isDark ? "#f3f4f6" : "#374151"} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        className={`mx-4 rounded-3xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <View className="flex-row border-b border-gray-200 dark:border-gray-700">
          {weekDays.map((day) => (
            <View key={day} className="flex-1 py-4">
              <Text
                className={`text-center text-sm font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          }}
          className="p-2"
        >
          <View className="flex-row flex-wrap">
            {days.map((day, index) => (
              <View key={index} className="w-1/7" style={{ width: `14.28%` }}>
                {day ? (
                  <TouchableOpacity
                    disabled={isAfterToday(day)}
                    onPress={() => handleDayPress(day)}
                    className={`m-1 h-12 rounded-xl items-center justify-center relative ${
                      isAfterToday(day) && "opacity-50"
                    } ${isToday(day) && "bg-blue-500/70 shadow-lg"} ${
                      hasWellnessData(day)
                        ? `${!isToday(day) && "bg-gray-100 dark:bg-gray-700"}`
                        : "border-[1.3px] dark:border-gray-700 border-gray-300 border-dashed"
                    } `}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-base font-medium ${
                        isToday(day)
                          ? "text-white font-bold"
                          : isDark
                          ? "text-gray-200"
                          : "text-gray-900"
                      }`}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="m-1 h-12" />
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {wellnessError && (
        <View className="mx-4 mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <Text className="text-red-600 dark:text-red-400 text-sm">
            {wellnessError}
          </Text>
        </View>
      )}

      <WellnessModal
        visible={modalVisible}
        selectedDate={selectedDate}
        wellnessData={getWellnessData()}
        wellnessOptions={wellnessOptions}
        onClose={closeModal}
        onUpdateWellnessData={updateWellnessData}
        loading={wellnessLoading}
      />
      {(todayEntry?.flow || todayEntry?.feelings || todayEntry?.sleep) ? (
  // ✅ When user has selected today's moods
  <View className="mt-6 px-6">
    <View
      className={`rounded-2xl px-5 py-5 shadow-sm ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {/* Header with arrow button */}
      <View className="flex-row items-center justify-between mb-3">
        <Text
          className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Your selections for today
        </Text>

        {/* Edit arrow button */}
        <TouchableOpacity
          onPress={() => {
            setSelectedDate({
              day: today.getDate(),
              month: today.getMonth(),
              year: today.getFullYear(),
              key: todayKey,
            });
            setModalVisible(true);
          }}
          className={`w-9 h-9 items-center justify-center rounded-xl ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}
          activeOpacity={0.7}
        >
          <ArrowUpRight size={20} color={isDark ? "#93c5fd" : "#3b82f6"} />
        </TouchableOpacity>
      </View>

      {/* Mood Data Display */}
      {todayEntry.flow && (
        <View className="mb-3">
          <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Flow
          </Text>
          <View className="flex-row flex-wrap">
            <WellnessChip option={todayEntry.flow} />
          </View>
        </View>
      )}

      {todayEntry.feelings && (
        <View className="mb-3">
          <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Feelings
          </Text>
          <View className="flex-row flex-wrap">
            <WellnessChip option={todayEntry.feelings} />
          </View>
        </View>
      )}

      {todayEntry.sleep && (
        <View>
          <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Sleep
          </Text>
          <View className="flex-row flex-wrap">
            <WellnessChip option={todayEntry.sleep} />
          </View>
        </View>
      )}
    </View>
  </View>
) : (
  // 🆕 When user has not selected today's moods
  <TouchableOpacity
    onPress={() => {
      setSelectedDate({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        key: todayKey,
      });
      setModalVisible(true);
    }}
    activeOpacity={0.9}
    className="mt-6 px-6"
  >
    <View
      className={`rounded-2xl px-5 py-6 shadow-sm items-start ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <Text
        className={`text-lg font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        How are you feeling today?
      </Text>
      <Text
        className={`text-sm ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        Tap to record your current mood, flow, and sleep.
      </Text>
    </View>
  </TouchableOpacity>
)}

        </ScrollView>
    </View>
  );
};

export default CalendarScreen;
