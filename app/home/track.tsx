import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import WellnessModal from "@/modules/home/components/WellnessModal";
import {
  SelectedDate,
  WellnessCategory,
  WellnessOption,
  WellnessOptions,
} from "@/modules/home/utils/types";
import { useWellnessStore } from "@/modules/track/store/useWellnessStore";
import { Activity, Calendar, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface MonthData {
  month: number;
  year: number;
  days: { day: number; dayName: string }[];
}

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { uid } = useUserDataStore();

  const {
    entries,
    loading: wellnessLoading,
    error: wellnessError,
    addOrUpdateEntry,
    getMonthEntries,
    getEntry,
  } = useWellnessStore();

  const [monthsData, setMonthsData] = useState<MonthData[]>([]);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

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
      { label: "Trouble Falling Asleep", color: "#fef2f2", textColor: "#dc2626" },
      { label: "Woke Up Refreshed", color: "#f0fdf4", textColor: "#16a34a" },
      { label: "Woke Up Tired", color: "#fefce8", textColor: "#ca8a04" },
      { label: "Restless Sleep", color: "#fdf4ff", textColor: "#c026d3" },
      { label: "Vivid Dreams", color: "#eff6ff", textColor: "#2563eb" },
      { label: "Night Sweats", color: "#fff7ed", textColor: "#ea580c" },
    ],
  };

  // Initialize with current month and load data
  useEffect(() => {
    if (!uid) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    initializeCalendar(currentMonth, currentYear);
  }, [uid]);

  const initializeCalendar = async (month: number, year: number) => {
    const initialMonths = [
      { month: month - 1, year: month === 0 ? year - 1 : year },
      { month, year },
      { month: month + 1, year: month === 11 ? year + 1 : year },
    ];

    const monthsWithDays = initialMonths.map(({ month, year }) => ({
      month,
      year,
      days: getDaysInMonth(new Date(year, month, 1)),
    }));

    setMonthsData(monthsWithDays);

    // Load data for all initial months
    for (const { month, year } of initialMonths) {
      if (uid) {
        await getMonthEntries(uid, month, year);
      }
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      days.push({ day, dayName });
    }

    return days;
  };

  const loadPreviousMonth = async () => {
    if (!uid || loadingMore) return;
    
    setLoadingMore(true);
    const firstMonth = monthsData[0];
    const prevMonth = firstMonth.month === 0 ? 11 : firstMonth.month - 1;
    const prevYear = firstMonth.month === 0 ? firstMonth.year - 1 : firstMonth.year;

    const newMonthData = {
      month: prevMonth,
      year: prevYear,
      days: getDaysInMonth(new Date(prevYear, prevMonth, 1)),
    };

    // Load data for the new month
    await getMonthEntries(uid, prevMonth, prevYear);
    
    setMonthsData(prev => [newMonthData, ...prev]);
    setLoadingMore(false);
  };

  const loadNextMonth = async () => {
    if (!uid || loadingMore) return;
    
    setLoadingMore(true);
    const lastMonth = monthsData[monthsData.length - 1];
    const nextMonth = lastMonth.month === 11 ? 0 : lastMonth.month + 1;
    const nextYear = lastMonth.month === 11 ? lastMonth.year + 1 : lastMonth.year;

    const newMonthData = {
      month: nextMonth,
      year: nextYear,
      days: getDaysInMonth(new Date(nextYear, nextMonth, 1)),
    };

    // Load data for the new month
    await getMonthEntries(uid, nextMonth, nextYear);
    
    setMonthsData(prev => [...prev, newMonthData]);
    setLoadingMore(false);
  };

  const onRefresh = async () => {
    if (!uid) return;
    
    setRefreshing(true);
    // Reload data for all currently loaded months
    for (const { month, year } of monthsData) {
      await getMonthEntries(uid, month, year);
    }
    setRefreshing(false);
  };

  const formatDate = (day: number, month: number, year: number) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handleDayPress = (day: number, month: number, year: number): void => {
    const dateKey = formatDate(day, month, year);

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

  const isToday = (day: number, month: number, year: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isAfterToday = (day: number, month: number, year: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(year, month, day);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate > today;
  };

  const hasWellnessData = (day: number, month: number, year: number): boolean => {
    const dateKey = formatDate(day, month, year);
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

  const renderMonthHeader = (monthData: MonthData) => (
    <View className="mx-4 mb-6 mt-4">
      <View className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <View className="flex-row items-center justify-center">
          <Calendar size={20} color={isDark ? "#60a5fa" : "#3b82f6"} />
          <Text className={`ml-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {months[monthData.month]} {monthData.year}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDayItem = ({ item: day, index, monthData }: { item: any; index: number; monthData: MonthData }) => {
    const entry = getEntry(formatDate(day.day, monthData.month, monthData.year));
    const isCurrentDay = isToday(day.day, monthData.month, monthData.year);
    const isFutureDay = isAfterToday(day.day, monthData.month, monthData.year);
    const hasData = hasWellnessData(day.day, monthData.month, monthData.year);

    return (
      <View className="mx-4 mb-3">
        <View className="flex-row items-center">
          {/* Day Info */}
          <View className="w-16 mr-4">
            <Text className={`text-xs text-center mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {day.dayName}
            </Text>
            <View
              className={`h-10 w-10 rounded-full items-center justify-center self-center ${
                isCurrentDay ? 'bg-blue-500' : 'bg-transparent'
              }`}
            >
              <Text className={`text-lg font-medium ${
                isCurrentDay ? 'text-white' : isDark ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {day.day}
              </Text>
            </View>
          </View>

          {/* Wellness Data */}
          <TouchableOpacity
            disabled={isFutureDay}
            onPress={() => handleDayPress(day.day, monthData.month, monthData.year)}
            className={`flex-1 rounded-xl p-3 ${
              isFutureDay ? 'opacity-40' : 'opacity-100'
            } ${
              hasData
                ? `${isDark ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-blue-500`
                : `border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`
            }`}
            activeOpacity={0.7}
          >
            {hasData ? (
              <View className="flex-row flex-wrap">
                {entry?.flow && (
                  <View className="mr-2 mb-1 px-2 py-1 rounded-full" style={{ backgroundColor: entry.flow.color }}>
                    <Text className="text-xs font-medium" style={{ color: entry.flow.textColor }}>
                      {entry.flow.label}
                    </Text>
                  </View>
                )}
                {entry?.feelings && (
                  <View className="mr-2 mb-1 px-2 py-1 rounded-full" style={{ backgroundColor: entry.feelings.color }}>
                    <Text className="text-xs font-medium" style={{ color: entry.feelings.textColor }}>
                      {entry.feelings.label}
                    </Text>
                  </View>
                )}
                {entry?.sleep && (
                  <View className="mr-2 mb-1 px-2 py-1 rounded-full" style={{ backgroundColor: entry.sleep.color }}>
                    <Text className="text-xs font-medium" style={{ color: entry.sleep.textColor }}>
                      {entry.sleep.label}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="flex-row items-center justify-center py-4">
                <Activity size={16} color={isDark ? "#6b7280" : "#9ca3af"} />
                <Text className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tap to add
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const flatListRef = useRef<FlatList>(null);
  const flatListData = monthsData.flatMap(monthData => [
    { type: 'header', monthData },
    ...monthData.days.map(day => ({ type: 'day', day, monthData }))
  ]);
  const hasScrolledToToday = useRef(false);

  useEffect(() => {
    if (flatListData.length === 0 || hasScrolledToToday.current) return;

    const todayIndex = flatListData.findIndex(item =>
      item.type === 'day' &&
      isToday(item.day.day, item.monthData.month, item.monthData.year)
    );

    if (todayIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: todayIndex, animated: false });
      hasScrolledToToday.current = true;
    }
  }, [flatListData]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FlatList
        ref={flatListRef}
        data={flatListData}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={flatListData.findIndex(item =>
          item.type === 'day' &&
          isToday(item.day.day, item.monthData.month, item.monthData.year)
        )}
        getItemLayout={(data, index) => ({
    length: 92, // estimate height for item
    offset: 92 * index,
    index,
  })}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor={isDark ? '#60a5fa' : '#3b82f6'}
          />
        }
        ListHeaderComponent={
          <View className="flex-row justify-center py-4">
            <TouchableOpacity
              onPress={loadPreviousMonth}
              disabled={loadingMore}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-sm ${loadingMore ? 'opacity-50' : ''}`}
              activeOpacity={0.7}
            >
              <ChevronUp size={24} color={isDark ? "#60a5fa" : "#3b82f6"} />
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View className="flex-row justify-center py-4 pb-36">
            <TouchableOpacity
              onPress={loadNextMonth}
              disabled={loadingMore}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-sm ${loadingMore ? 'opacity-50' : ''}`}
              activeOpacity={0.7}
            >
              <ChevronDown size={24} color={isDark ? "#60a5fa" : "#3b82f6"} />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => {
          if (item.type === 'header') {
            return renderMonthHeader(item.monthData);
          } else {
            return renderDayItem({ item: item.day, index, monthData: item.monthData });
          }
        }}
        keyExtractor={(item, index) => {
          if (item.type === 'header') {
            return `header-${item.monthData.month}-${item.monthData.year}`;
          } else {
            return `day-${item.monthData.month}-${item.monthData.year}-${item.day.day}`;
          }
        }}
      />

      {wellnessError && (
        <View className="mx-4 mb-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-xl">
          <Text className="text-red-600 dark:text-red-400 text-sm font-medium">
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
    </View>
  );
};

export default CalendarScreen;