import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
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
    setIsVisible(false);
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
            borderRadius: 100,
            marginVertical: 2,
            backgroundColor: isSelectedDay 
              ? '#3b82f6' 
              : isCurrentDay 
                ? isDarkMode ? '#374151' : '#f3f4f6'
                : 'transparent',
            borderWidth: isCurrentDay && !isSelectedDay ? 1 : 0,
            borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
            opacity: isDayDisabled ? 0.4 : 1,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: isSelectedDay ? '600' : '400',
              color: isSelectedDay 
                ? '#ffffff' 
                : isCurrentDay
                  ? isDarkMode ? '#60a5fa' : '#3b82f6'
                  : isDarkMode 
                    ? '#f3f4f6' 
                    : '#1f2937',
            }}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const getDaysAgo = (date: Date) => {
    if (!date) return null;
    const today = new Date();
    const lastPeriod = new Date(date);
    const diffTime = Math.abs(today.getTime() - lastPeriod.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysAgo = selectedDate ? getDaysAgo(selectedDate) : null;

  const getStatusText = () => {
    if (!daysAgo) return 'Not tracked';
    if (daysAgo === 1) return '1 day ago';
    return `${daysAgo} days ago`;
  };

  return (
    <View className="px-4 pt-2">
      <TouchableOpacity
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.8}
        style={{ opacity: disabled ? 0.5 : 1 }}
        className={`
          p-6 rounded-3xl border-2 mb-4
          ${isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
          }
        `}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className={`
            text-sm font-medium
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            Last Period
          </Text>
          
          <Text className={`
            text-xs
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {getStatusText()}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`
              text-lg font-semibold mb-1
              ${selectedDate 
                ? (isDarkMode ? 'text-white' : 'text-gray-900')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }
            `}>
              {selectedDate ? formatDate(selectedDate) : 'Tap to select date'}
            </Text>
          </View>

          <Calendar
            size={20}
            color={isDarkMode ? '#9ca3af' : '#6b7280'}
            strokeWidth={2}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View
            className={`
              w-full max-w-sm rounded-3xl p-6 mx-4
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                activeOpacity={0.7}
                className={`
                  p-2 rounded-full
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}
              >
                <ChevronLeft 
                  size={20} 
                  color={isDarkMode ? '#d1d5db' : '#374151'} 
                />
              </TouchableOpacity>
              
              <Text className={`
                text-lg font-semibold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              
              <TouchableOpacity
                onPress={() => changeMonth(1)}
                activeOpacity={0.7}
                className={`
                  p-2 rounded-full
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}
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
                  <Text className={`
                    text-xs font-medium
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                  `}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row flex-wrap mb-6">
              {renderCalendar()}
            </View>

            <View className={`
              flex-row items-center justify-between pt-4 border-t
              ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <TouchableOpacity
                onPress={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  handleDateSelect(today.getDate());
                }}
                activeOpacity={0.8}
                className="flex-1 py-2 px-4 rounded-full bg-blue-500 mr-3"
              >
                <Text className="text-white font-medium text-center">Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeModal}
                activeOpacity={0.7}
                className={`
                  p-2 rounded-full
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}
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