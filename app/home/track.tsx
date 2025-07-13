import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import WellnessScreen, { WellnessBottomSheetRef } from "@/modules/home/components/WellnessBottomSheet";
import {
  SelectedDate,
  WellnessCategory,
  WellnessOption,
  WellnessOptions,
} from "@/modules/home/utils/types";
import { useWellnessStore } from "@/modules/track/store/useWellnessStore";
import { Activity, Calendar, ChevronDown, ChevronUp } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MonthData {
  month: number;
  year: number;
  days: { day: number; dayName: string }[];
}

const WELLNESS_OPTIONS: WellnessOptions = {
  flow: [
    { label: "Light", color: "#fef7f0", textColor: "#d97706" },
    { label: "Medium", color: "#fef3e2", textColor: "#ea580c" },
    { label: "Heavy", color: "#fef2f2", textColor: "#dc2626" },
    { label: "Super Heavy", color: "#fce7f3", textColor: "#be185d" },
  ],
  feelings: [
    { label: "Mood Swings", color: "#f0f4ff", textColor: "#6366f1" },
    { label: "Not in Control", color: "#fef7f0", textColor: "#ea580c" },
    { label: "Fine", color: "#f0fdf4", textColor: "#059669" },
    { label: "Happy", color: "#fffbeb", textColor: "#d97706" },
    { label: "Sad", color: "#eff6ff", textColor: "#3b82f6" },
    { label: "Confident", color: "#ecfdf5", textColor: "#059669" },
    { label: "Excited", color: "#fdf2f8", textColor: "#ec4899" },
    { label: "Irritable", color: "#fef2f2", textColor: "#dc2626" },
    { label: "Anxious", color: "#f3e8ff", textColor: "#9333ea" },
    { label: "Insecure", color: "#f8fafc", textColor: "#64748b" },
    { label: "Grateful", color: "#f0f9ff", textColor: "#0284c7" },
    { label: "Indifferent", color: "#f9fafb", textColor: "#6b7280" },
  ],
  sleep: [
    { label: "Trouble Falling Asleep", color: "#fef7f0", textColor: "#dc2626" },
    { label: "Woke Up Refreshed", color: "#f0fdf4", textColor: "#059669" },
    { label: "Woke Up Tired", color: "#fffbeb", textColor: "#d97706" },
    { label: "Restless Sleep", color: "#fdf4ff", textColor: "#c026d3" },
    { label: "Vivid Dreams", color: "#eff6ff", textColor: "#2563eb" },
    { label: "Night Sweats", color: "#fff7ed", textColor: "#ea580c" },
  ],
  pain: [
    { label: "Pain Free", color: "#f0fdf4", textColor: "#059669" },
    { label: "Cramps", color: "#fef2f2", textColor: "#dc2626" },
    { label: "Ovulation", color: "#fdf2f8", textColor: "#ec4899" },
    { label: "Breast Tenderness", color: "#fce7f3", textColor: "#be185d" },
    { label: "Headache", color: "#fef7f0", textColor: "#ea580c" },
    { label: "Migraine", color: "#fef2f2", textColor: "#b91c1c" },
    { label: "Migraine with Aura", color: "#f3e8ff", textColor: "#9333ea" },
    { label: "Lower Back", color: "#fffbeb", textColor: "#d97706" },
    { label: "Leg", color: "#eff6ff", textColor: "#3b82f6" },
    { label: "Joint", color: "#f8fafc", textColor: "#64748b" },
    { label: "Vulvar", color: "#fdf4ff", textColor: "#c026d3" },
  ],
  energy: [
    { label: "Exhausted", color: "#fef2f2", textColor: "#dc2626" },
    { label: "Tired", color: "#fef7f0", textColor: "#ea580c" },
    { label: "OK", color: "#fffbeb", textColor: "#d97706" },
    { label: "Energetic", color: "#ecfdf5", textColor: "#059669" },
    { label: "Fully Energized", color: "#f0fdf4", textColor: "#047857" },
  ],
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WellnessTag = React.memo(({ type, entry, textColor, backgroundColor }: {
  type: string;
  entry: any;
  textColor: string;
  backgroundColor: string;
}) => (
  <View className="flex-row items-center mr-2 mb-2">
    <View className="flex-row items-center px-3 py-1.5 rounded-lg" style={{ backgroundColor }}>
      <View className="mr-2">
        <Text className="text-xs font-medium opacity-70" style={{ color: textColor }}>
          {type}
        </Text>
      </View>
      <View className="w-px h-3 opacity-30" style={{ backgroundColor: textColor }} />
      <View className="ml-2">
        <Text className="text-xs font-semibold" style={{ color: textColor }}>
          {entry.label}
        </Text>
      </View>
    </View>
  </View>
));

const MonthHeader = React.memo(({ monthData, isDark }: { monthData: MonthData; isDark: boolean }) => (
  <View className="mx-4 mb-6 mt-4">
    <View className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <View className="flex-row items-center justify-center">
        <Calendar size={20} color={isDark ? "#60a5fa" : "#3b82f6"} />
        <Text className={`ml-2 text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {MONTHS[monthData.month]} {monthData.year}
        </Text>
      </View>
    </View>
  </View>
));

const DayItem = React.memo(({ 
  day, 
  monthData, 
  isDark, 
  onDayPress, 
  formatDate, 
  getEntry, 
  isToday, 
  isAfterToday, 
  hasWellnessData 
}: { 
  day: any; 
  monthData: MonthData; 
  isDark: boolean;
  onDayPress: (day: number, month: number, year: number) => void;
  formatDate: (day: number, month: number, year: number) => string;
  getEntry: (dateKey: string) => any;
  isToday: (day: number, month: number, year: number) => boolean;
  isAfterToday: (day: number, month: number, year: number) => boolean;
  hasWellnessData: (day: number, month: number, year: number) => boolean;
}) => {
  const dateKey = formatDate(day.day, monthData.month, monthData.year);
  const entry = getEntry(dateKey);
  const isCurrentDay = isToday(day.day, monthData.month, monthData.year);
  const isFutureDay = isAfterToday(day.day, monthData.month, monthData.year);
  const hasData = hasWellnessData(day.day, monthData.month, monthData.year);

  const handlePress = useCallback(() => {
    onDayPress(day.day, monthData.month, monthData.year);
  }, [day.day, monthData.month, monthData.year, onDayPress]);

  return (
    <View className="mx-4 mb-3">
      <View className="flex-row items-center">
        <View className="w-10 mr-4">
          <Text className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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

        <TouchableOpacity
          disabled={isFutureDay}
          onPress={handlePress}
          className={`flex-1 rounded-2xl px-3 pt-3 pb-1 ${
            isFutureDay ? 'opacity-50' : 'opacity-100'
          } ${
            hasData
              ? `${isDark ? 'bg-gray-800' : 'bg-white border-2 border-gray-100'}`
              : `border-[1.5px] border-dashed ${isDark ? 'border-gray-600/70' : 'border-gray-300'}`
          }`}
          activeOpacity={0.7}
        >
          {hasData ? (
            <View className="flex-row flex-wrap">
              {entry?.flow && (
                <WellnessTag
                  type="Flow"
                  entry={entry.flow}
                  textColor={entry.flow.textColor}
                  backgroundColor={entry.flow.color}
                />
              )}
              {entry?.feelings && (
                <WellnessTag
                  type="Mood"
                  entry={entry.feelings}
                  textColor={entry.feelings.textColor}
                  backgroundColor={entry.feelings.color}
                />
              )}
              {entry?.sleep && (
                <WellnessTag
                  type="Sleep"
                  entry={entry.sleep}
                  textColor={entry.sleep.textColor}
                  backgroundColor={entry.sleep.color}
                />
              )}
              {entry?.pain && (
                <WellnessTag
                  type="Pain"
                  entry={entry.pain}
                  textColor={entry.pain.textColor}
                  backgroundColor={entry.pain.color}
                />
              )}
              {entry?.energy && (
                <WellnessTag
                  type="Energy"
                  entry={entry.energy}
                  textColor={entry.energy.textColor}
                  backgroundColor={entry.energy.color}
                />
              )}
            </View>
          ) : (
            <View className="flex-row items-center justify-center pt-1 pb-3">
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
});

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { uid } = useUserDataStore();
  const [isWellnessScreenOpen, setIsWellnessFabOpen] = useState(false);
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

  const flatListRef = useRef<FlatList>(null);
  const wellnessBottomSheetRef = useRef<WellnessBottomSheetRef>(null);

  const openWellnessSheet = () => {
    wellnessBottomSheetRef.current?.open();
  };

  const closeWellnessSheet = () => {
    wellnessBottomSheetRef.current?.close();
  };
  
  const formatDate = useCallback((day: number, month: number, year: number) => {
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  }, []);

  const getDaysInMonth = useCallback((date: Date) => {
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
  }, []);

  const isToday = useCallback((day: number, month: number, year: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }, []);

  const isAfterToday = useCallback((day: number, month: number, year: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(year, month, day);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate > today;
  }, []);

  const hasWellnessData = useCallback((day: number, month: number, year: number): boolean => {
    const dateKey = formatDate(day, month, year);
    const entry = entries[dateKey];
    return entry && (entry.flow || entry.feelings || entry.sleep || entry.pain || entry.energy);
  }, [entries, formatDate]);

  useEffect(() => {
    if (!uid) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    initializeCalendar(currentMonth, currentYear);
  }, [uid]);

  const initializeCalendar = useCallback(async (month: number, year: number) => {
    const initialMonths = [
      { month, year },
      // { month: month + 1, year: month === 11 ? year + 1 : year },
    ];

    const monthsWithDays = initialMonths.map(({ month, year }) => ({
      month,
      year,
      days: getDaysInMonth(new Date(year, month, 1)),
    }));

    setMonthsData(monthsWithDays);

    for (const { month, year } of initialMonths) {
      if (uid) {
        await getMonthEntries(uid, month, year);
      }
    }
  }, [uid, getDaysInMonth, getMonthEntries]);

  const loadPreviousMonth = useCallback(async () => {
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

    await getMonthEntries(uid, prevMonth, prevYear);
    
    setMonthsData(prev => [newMonthData, ...prev]);
    setLoadingMore(false);
  }, [uid, loadingMore, monthsData, getDaysInMonth, getMonthEntries]);

  const loadNextMonth = useCallback(async () => {
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

    await getMonthEntries(uid, nextMonth, nextYear);
    
    setMonthsData(prev => [...prev, newMonthData]);
    setLoadingMore(false);
  }, [uid, loadingMore, monthsData, getDaysInMonth, getMonthEntries]);

  const onRefresh = useCallback(async () => {
    if (!uid) return;
    
    setRefreshing(true);
    for (const { month, year } of monthsData) {
      await getMonthEntries(uid, month, year);
    }
    setRefreshing(false);
  }, [uid, monthsData, getMonthEntries]);

  const handleDayPress = useCallback((day: number, month: number, year: number): void => {
    const dateKey = formatDate(day, month, year);

    setSelectedDate({
      day,
      month,
      year,
      key: dateKey,
    });
    openWellnessSheet();
  }, [formatDate]);

  const closeModal = useCallback((): void => {
    setModalVisible(false);
    setSelectedDate(null);
  }, []);

  const updateWellnessData = useCallback(async (
    category: WellnessCategory,
    option: WellnessOption
  ): Promise<void> => {
    if (!selectedDate || !uid) return;

    try {
      await addOrUpdateEntry(uid, selectedDate.key, category, option);
    } catch (error) {
      console.error("Error updating wellness data:", error);
    }
  }, [selectedDate, uid, addOrUpdateEntry]);

  const getWellnessData = useCallback(() => {
    const wellnessData: Record<string, any> = {};
    Object.values(entries).forEach((entry) => {
      wellnessData[entry.date] = {
        flow: entry.flow,
        feelings: entry.feelings,
        sleep: entry.sleep,
        pain: entry.pain,
        energy: entry.energy
      };
    });
    return wellnessData;
  }, [entries]);

  const flatListData = useMemo(() => {
    return monthsData.flatMap(monthData => [
      { type: 'header', monthData, id: `header-${monthData.month}-${monthData.year}` },
      ...monthData.days.map(day => ({ 
        type: 'day', 
        day, 
        monthData,
        id: `day-${monthData.month}-${monthData.year}-${day.day}`,
      }))
    ]);
  }, [monthsData]);

  const ListHeaderComponent = useMemo(() => (
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
  ), [loadPreviousMonth, loadingMore, isDark]);

  const ListFooterComponent = useMemo(() => (
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
  ), [loadNextMonth, loadingMore, isDark]);

  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#3b82f6']}
      tintColor={isDark ? '#60a5fa' : '#3b82f6'}
    />
  ), [refreshing, onRefresh, isDark]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (item.type === 'header') {
      return <MonthHeader monthData={item.monthData} isDark={isDark} />;
    } else {
      return (
        <DayItem 
          day={item.day} 
          monthData={item.monthData} 
          isDark={isDark}
          onDayPress={handleDayPress}
          formatDate={formatDate}
          getEntry={getEntry}
          isToday={isToday}
          isAfterToday={isAfterToday}
          hasWellnessData={hasWellnessData}
        />
      );
    }
  }, [isDark, handleDayPress, formatDate, getEntry, isToday, isAfterToday, hasWellnessData]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const extraData = useMemo(() => ({ entries, isDark }), [entries, isDark]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-black text-gray-900 dark:text-white mb-1">
          Your Wellness Space
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-base">
          Monitor your cycle and daily wellness effortlessly
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        refreshControl={refreshControl}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        extraData={extraData}
        getItemLayout={undefined}
      />

      {wellnessError && (
        <View className="mx-4 mb-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-xl">
          <Text className="text-red-600 dark:text-red-400 text-sm font-medium">
            {wellnessError}
          </Text>
        </View>
      )}
      
        <WellnessScreen
          selectedDate={selectedDate}
          wellnessData={getWellnessData()}
          wellnessOptions={WELLNESS_OPTIONS}
          onUpdateWellnessData={updateWellnessData}
          loading={wellnessLoading}
          onGoBack={() => {}}
        />
    </SafeAreaView>
  );
};

export default CalendarScreen;