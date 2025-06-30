import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import WaterModal from "@/modules/home/components/WaterModal";
import WellnessModal from "@/modules/home/components/WellnessModal";
import {
  SelectedDate,
  WellnessCategory,
  WellnessOption,
  WellnessOptions,
} from "@/modules/home/utils/types";
import { useWellnessStore } from "@/modules/track/store/useWellnessStore";
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { uid, water, setWaterField, setUser } = useUserDataStore();

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

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const waterIntake = water.intake;
  const waterGoal = water.goal;
  const [waterModalVisible, setWaterModalVisible] = useState(false);

  const motivationalQuotes = [
    "Stay hydrated, stay glowing 💧",
    "Water you doing? Keep drinking! 🥤",
    "Your body thanks you! 💙",
    "Hydration = motivation 🚀",
    "One glass closer to greatness! ✨",
  ];

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

  const handleDayPress = (day: number | null): void => {
    if (!day) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
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
      console.error('Error updating wellness data:', error);
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

  const inputDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today;
  };

  const hasWellnessData = (day: number | null): boolean => {
    if (!day) return false;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const entry = entries[dateKey];
    return entry && (entry.flow || entry.feelings || entry.sleep);
  };

  const getWellnessData = () => {
    const wellnessData: Record<string, any> = {};
    
    Object.values(entries).forEach(entry => {
      wellnessData[entry.date] = {
        flow: entry.flow,
        feelings: entry.feelings,
        sleep: entry.sleep,
      };
    });
    
    return wellnessData;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View className='flex-1 dark:bg-gray-900 bg-gray-50' >
      <View className="px-6 pt-6">
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
              <View
                key={index}
                className="w-1/7"
                style={{ width: `14.28%` }}
              >
                {day ? (
                  <TouchableOpacity
                    disabled={isAfterToday(day)}
                    onPress={() => handleDayPress(day)}
                    className={`m-1 h-12 rounded-xl items-center justify-center relative ${isAfterToday(day) && "opacity-50"} ${
                      isToday(day) && "bg-blue-500/70 shadow-lg" } ${hasWellnessData(day) ? `${(!isToday(day)) && "bg-gray-100 dark:bg-gray-700"}` : "border-[1.3px] dark:border-gray-700 border-gray-300 border-dashed"} `}
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

      {/* Water Box */}
      <View className=" px-6 pb-8 pt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-40 mt-4 ml-4 mr-4 ">
        {/* Top-left Modal Open Button */}
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Water Intake
          </Text>

          <TouchableOpacity
            onPress={() => setWaterModalVisible(true)}
            className="bg-blue-500 rounded-full p-1"
            activeOpacity={0.8}
          >
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View
          className={`w-full h-4 rounded-full overflow-hidden ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <View
            style={{ width: `${(waterIntake / waterGoal) * 100}%` }}
            className="h-full bg-blue-400"
          />
        </View>

        <Text
          className={`text-sm mt-1 mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {waterIntake}ml of {waterGoal}ml
        </Text>

        {/* Add/Reduce Buttons */}
        <View className="flex-row justify-between space-x-4">
          {/* Subtract Water */}
          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.max(waterIntake - water.cupSize, 0);
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [new Date().toDateString()]: newIntake,
                  },
                },
              });
            }}
            className="flex-1 bg-gray-200 dark:bg-white py-3 rounded-xl items-center mr-1 active:scale-95"
            activeOpacity={0.9}
          >
            <Text className="font-semibold text-base text-black">
              - {water.cupSize}ml
            </Text>
          </TouchableOpacity>

          {/* Add Water */}
          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.min(
                waterIntake + water.cupSize,
                waterGoal
              );
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [new Date().toDateString()]: newIntake,
                  },
                },
              });

              const random =
                motivationalQuotes[
                  Math.floor(Math.random() * motivationalQuotes.length)
                ];
              setQuote(random);
            }}
            className="flex-1 bg-blue-600 py-3 rounded-xl items-center ml-1 active:scale-95"
            activeOpacity={0.9}
          >
            <Text className="text-white font-semibold text-base">
              + {water.cupSize}ml
            </Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        {quote !== "" && (
          <Text
            className={`text-sm italic text-center mt-3 ${
              isDark ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {quote}
          </Text>
        )}
      </View>

      <WaterModal
        visible={waterModalVisible}
        onClose={() => setWaterModalVisible(false)}
        goal={water.goal}
        setGoal={(newGoal) => {
          setWaterField("goal", newGoal);
          setUser({
            uid,
            water: {
              ...water,
              goal: newGoal,
            },
          });
        }}
        intake={water.intake}
      />
    </View>
  );
};

export default CalendarScreen;