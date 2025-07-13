import { Calendar, ChevronLeft, ChevronRight, CircleDot, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface DatePickerProps {
  value?: string;
  onDateChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  theme?: 'light' | 'dark' | 'auto';
  containerStyle?: string;
  inputStyle?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  disabled = false,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value) {
      const [yyyy, mm, dd] = value.split("-");
      setSelectedDate(new Date(Number(yyyy), Number(mm) - 1, Number(dd)));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (minDate && selected < minDate) return;
    if (maxDate && selected > maxDate) return;
    
    setSelectedDate(selected);
    onDateChange?.(selected);
    closeModal();
  };

  const openModal = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={{ width: '14.28%' }} className="h-10 items-center justify-center" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const isSelectedDay = isSelected(day);
      const isDayDisabled = isDisabled(day);

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          onPress={() => handleDateSelect(day)}
          disabled={isDayDisabled}
          activeOpacity={0.7}
          style={{
            width: '14.28%',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            marginVertical: 2,
            backgroundColor: isSelectedDay 
              ? '#3b82f6' 
              : isCurrentDay 
                ? isDarkMode 
                  ? '#374151' 
                  : '#f3f4f6'
                : 'transparent',
            borderWidth: isCurrentDay && !isSelectedDay ? 2 : 0,
            borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
            opacity: isDayDisabled ? 0.3 : 1,
            transform: [{ scale: isSelectedDay ? 1.1 : 1 }],
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: isSelectedDay 
                ? '#ffffff' 
                : isDarkMode 
                  ? '#f3f4f6' 
                  : '#1f2937',
              opacity: isDayDisabled ? 0.5 : 1,
            }}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const themeClasses = {
    container: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    input: isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-100' 
      : 'bg-white border-gray-200 text-gray-900',
    modal: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    button: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
  };

    const getDaysAgo = (date: Date) => {
      if (!date) return null;
      const today = new Date();
      const lastPeriod = new Date(date);
      const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const daysAgo = selectedDate ? getDaysAgo(selectedDate) : null

    const getStatusColor = () => {
      if (!daysAgo) return isDarkMode ? '#e879f9' : '#ec4899';
      if (daysAgo <= 7) return '#ef4444';
      if (daysAgo <= 28) return '#f59e0b';
      return '#6b7280';
    };

    const getStatusGradient = (): string[] => {
      if (!daysAgo) {
        return isDarkMode
          ? ['#7e22ce', '#d946ef']
          : ['#f5e1f7', '#ecd9fa'];
      }

      if (daysAgo <= 7) {
        return isDarkMode
          ? ['#b91c1c', '#fb7185']
          : ['#fde2e4', '#fbb1bd'];
      }

      if (daysAgo <= 28) {
        return isDarkMode
          ? ['#b45309', '#fbbf24']
          : ['#fef6e4', '#fde68a'];
      }

      return isDarkMode
        ? ['#4b5563', '#9ca3af']
        : ['#f3f4f6', '#e5e7eb'];
    };


    const getStatusText = () => {
      if (!daysAgo) return 'Track your cycle';
      if (daysAgo === 1) return '1 day ago';
      if (daysAgo <= 7) return `${daysAgo} days ago`;
      if (daysAgo <= 28) return `${daysAgo} days ago`;
      return `${daysAgo} days ago (overdue)`;
    };


  return (
    <View className="px-4 pt-2">
      <LinearGradient
        colors={getStatusGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          marginBottom: 16,
          padding: 24,
          borderWidth: 2,
          borderColor: isDarkMode ? getStatusColor() + "30" : getStatusColor() + "60",
          shadowColor: getStatusColor(),
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
      <TouchableOpacity
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.8}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >

      <View className="flex-row items-center justify-between mb-4">
        <Text className={`
          text-sm font-medium tracking-wide uppercase
          ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}
        `}>
          Last Period
        </Text>
        
        <View className="flex-row items-center">
          <CircleDot 
            size={12} 
            color={getStatusColor()} 
            fill={getStatusColor()}
          />
          <Text className={`
            ml-2 text-xs font-medium
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`
            text-2xl font-bold mb-1
            ${selectedDate 
              ? (isDarkMode ? 'text-white' : 'text-gray-900')
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            }
          `}>
            {selectedDate ? formatDate(selectedDate) : 'Not tracked yet'}
          </Text>
          
          <Text className={`
            text-sm
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            {selectedDate 
              ? 'Tap to update your last period date'
              : 'Tap to add your last period date'
            }
          </Text>
        </View>

        <View className={`p-3 rounded-full`} 
          style={{
            backgroundColor: getStatusColor() + "30"
          }}
        >
          <Calendar
            size={24}
            color={getStatusColor()}
            strokeWidth={2}
          />
        </View>
      </View>
    </TouchableOpacity>
    </LinearGradient>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 20,
            }}
            className={`
              w-full max-w-sm rounded-3xl p-6 mx-4
              ${themeClasses.modal}
            `}
          >
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                activeOpacity={0.7}
                className={`p-2 rounded-full ${themeClasses.button}`}
              >
                <ChevronLeft 
                  size={20} 
                  color={isDarkMode ? '#d1d5db' : '#374151'} 
                />
              </TouchableOpacity>
              
              <Text className={`text-lg font-bold ${themeClasses.text}`}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                activeOpacity={0.7}
                className={`p-2 rounded-full ${themeClasses.button}`}
              >
                <ChevronRight 
                  size={20} 
                  color={isDarkMode ? '#d1d5db' : '#374151'} 
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row mb-4">
              {weekDays.map((day) => (
                <View key={day} style={{ width: '14.28%' }} className="items-center">
                  <Text className={`text-xs font-semibold ${themeClasses.textSecondary}`}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row flex-wrap">
              {renderCalendar()}
            </View>

            <View className="flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  handleDateSelect(today.getDate());
                }}
                activeOpacity={0.7}
                className="py-2 px-4 rounded-full bg-blue-500"
              >
                <Text className="text-white font-medium">Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeModal}
                activeOpacity={0.7}
                className={`p-2 rounded-full ${themeClasses.button}`}
              >
                <X size={20} color={isDarkMode ? '#d1d5db' : '#374151'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePicker;