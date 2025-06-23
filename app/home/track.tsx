import WellnessModal from '@/modules/home/components/WellnessModal';
import { SelectedDate, WellnessCategory, WellnessData, WellnessOption, WellnessOptions } from '@/modules/home/utils/types';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const CalendarScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [wellnessData, setWellnessData] = useState<WellnessData>({});
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const wellnessOptions: WellnessOptions = {
    flow: [
      { label: 'Light', color: '#fef3c7', textColor: '#d97706' },
      { label: 'Medium', color: '#fed7aa', textColor: '#ea580c' },
      { label: 'Heavy', color: '#fca5a5', textColor: '#dc2626' },
      { label: 'Super Heavy', color: '#f87171', textColor: '#b91c1c' }
    ],
    feelings: [
      { label: 'Mood Swings', color: '#e0e7ff', textColor: '#6366f1' },
      { label: 'Not in Control', color: '#fee2e2', textColor: '#ef4444' },
      { label: 'Fine', color: '#f0fdf4', textColor: '#22c55e' },
      { label: 'Happy', color: '#fef3c7', textColor: '#f59e0b' },
      { label: 'Sad', color: '#dbeafe', textColor: '#3b82f6' },
      { label: 'Confident', color: '#ecfdf5', textColor: '#10b981' },
      { label: 'Excited', color: '#fdf2f8', textColor: '#ec4899' },
      { label: 'Irritable', color: '#fef2f2', textColor: '#f87171' },
      { label: 'Anxious', color: '#f3e8ff', textColor: '#a855f7' },
      { label: 'Insecure', color: '#f1f5f9', textColor: '#64748b' },
      { label: 'Grateful', color: '#f0f9ff', textColor: '#0ea5e9' },
      { label: 'Indifferent', color: '#f8fafc', textColor: '#6b7280' }
    ],
    sleep: [
      { label: 'Trouble Falling Asleep', color: '#fef2f2', textColor: '#dc2626' },
      { label: 'Woke Up Refreshed', color: '#f0fdf4', textColor: '#16a34a' },
      { label: 'Woke Up Tired', color: '#fefce8', textColor: '#ca8a04' },
      { label: 'Restless Sleep', color: '#fdf4ff', textColor: '#c026d3' },
      { label: 'Vivid Dreams', color: '#eff6ff', textColor: '#2563eb' },
      { label: 'Night Sweats', color: '#fff7ed', textColor: '#ea580c' }
    ]
  };

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

  const animateTransition = (direction: 'next' | 'prev'): void => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -20 : 20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(direction === 'next' ? 20 : -20);
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

  const changeMonth = (direction: 'next' | 'prev'): void => {
    animateTransition(direction);
    
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleDayPress = (day: number | null): void => {
    if (!day) return;

    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    setSelectedDate({ day, month: currentDate.getMonth(), year: currentDate.getFullYear(), key: dateKey });
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  const updateWellnessData = (category: WellnessCategory, option: WellnessOption): void => {
    if (!selectedDate) return;
    
    setWellnessData(prev => ({
      ...prev,
      [selectedDate.key]: {
        ...prev[selectedDate.key],
        [category]: option
      }
    }));
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

  const hasWellnessData = (day: number | null): boolean => {
    if (!day) return false;
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    return wellnessData[dateKey] && Object.keys(wellnessData[dateKey]).length > 0;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => changeMonth('prev')}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
            activeOpacity={0.7}
          >
            <ChevronLeft 
              size={24} 
              color={isDark ? '#f3f4f6' : '#374151'} 
            />
          </TouchableOpacity>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </Animated.View>

          <TouchableOpacity
            onPress={() => changeMonth('next')}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
            activeOpacity={0.7}
          >
            <ChevronRight 
              size={24} 
              color={isDark ? '#f3f4f6' : '#374151'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className={`mx-4 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <View className="flex-row border-b border-gray-200 dark:border-gray-700">
          {weekDays.map((day) => (
            <View key={day} className="flex-1 py-4">
              <Text className={`text-center text-sm font-semibold ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim }
            ],
          }}
          className="p-2"
        >
          <View className="flex-row flex-wrap">
            {days.map((day, index) => (
              <View key={index} className="w-1/7" style={{ width: `${100/7}%` }}>
                {day ? (
                  <TouchableOpacity
                    onPress={() => handleDayPress(day)}
                    className={`m-1 h-12 rounded-xl items-center justify-center relative ${
                      isToday(day)
                        ? 'bg-blue-500/70 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Text className={`text-base font-medium ${
                      isToday(day)
                        ? 'text-white font-bold'
                        : isDark
                        ? 'text-gray-200'
                        : 'text-gray-900'
                    }`}>
                      {day}
                    </Text>
                    {hasWellnessData(day) && (
                      <View className="absolute -top-1 -right-1">
                        <Circle size={8} color="#10b981" fill="#10b981" />
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View className="m-1 h-12" />
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View className="px-6 pt-8">
        <View className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Today
          </Text>
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      <WellnessModal
        visible={modalVisible}
        selectedDate={selectedDate}
        wellnessData={wellnessData}
        wellnessOptions={wellnessOptions}
        onClose={closeModal}
        onUpdateWellnessData={updateWellnessData}
      />
    </View>
  );
};

export default CalendarScreen;