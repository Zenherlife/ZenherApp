import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const CalendarScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const animateTransition = (direction) => {
    // Start animations
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
      // Reset and fade back in
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

  const changeMonth = (direction) => {
    animateTransition(direction);
    
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleDayPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
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

      {/* Calendar */}
      <View className={`mx-4 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        {/* Week Days Header */}
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

        {/* Calendar Days */}
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
                    onPress={handleDayPress}
                    className={`m-1 h-12 rounded-2xl items-center justify-center ${
                      isToday(day)
                        ? 'bg-blue-500 shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  </TouchableOpacity>
                ) : (
                  <View className="m-1 h-12" />
                )}
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Today's Date Indicator */}
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
    </View>
  );
};

export default CalendarScreen;