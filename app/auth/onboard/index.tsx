import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import WheelSpinner from '@/modules/home/components/WheelSpinner';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BirthdateScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [tempSelectedYear, setTempSelectedYear] = useState(new Date().getFullYear()); 
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const setField = useUserDataStore((state) => state.setField);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark'; 

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Generate years from 1900 to current year
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse();

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDayPress = (day) => {
    if (day) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateString);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleYearSelect = (year) => {
    setTempSelectedYear(parseInt(year)); 
  };

  const handleYearPickerDone = () => {
    setCurrentYear(tempSelectedYear); 
    setShowYearPicker(false);
  };

  const handleYearPickerCancel = () => {
    setTempSelectedYear(currentYear); 
    setShowYearPicker(false);
  };

  const handleYearPickerOpen = () => {
    setTempSelectedYear(currentYear); 
    setShowYearPicker(true);
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dayString === selectedDate;
  };

  const handleNext = () => {
    if (!selectedDate) return;
    
    const age = calculateAge(selectedDate);
    
    if (age < 16) {
      setShowParentalConsent(true);
    } else {
      router.push('/auth/onboard/Policies');
    }
  };

  const handleParentalConsentClose = () => {
    setShowParentalConsent(false);
  };

  const handleGotIt = () => {
    if(selectedDate) {
      setField('dateOfBirth', selectedDate)
      router.push('/auth/onboard/Policies')
      setShowParentalConsent(false);
    } 
  };

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'dark'} />
      </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="bg-[#ed6372] rounded-full w-20 h-20 justify-center items-center mb-6">
            <Feather name="gift" size={32} color="white" />
          </View>
          <Text className="text-black dark:text-white text-2xl font-bold mb-2">When were you born?</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center text-base px-4">
            Since cycles can change over time, this helps us customize the app for you.
          </Text>
        </View>

        {/* Month/Year Header */}
        <View className="flex-row items-center justify-between mb-6 px-4">
          <TouchableOpacity onPress={handlePrevMonth}>
            <Feather name="chevron-left" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleYearPickerOpen}
            className="flex-row items-center"
          >
            <Text className="text-black dark:text-white text-lg font-medium">
              {months[currentMonth]} {currentYear}
            </Text>
            <Feather name="chevron-down" size={20} color={isDark ? 'white' : 'black'} className="ml-2" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleNextMonth}>
            <Feather name="chevron-right" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View className="flex-row mb-4">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-gray-600 dark:text-gray-400 text-sm font-medium">{day}</Text>
            </View>
          ))}
        </View>

        <View className="flex-1">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => {
            const weekDays = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);
            const isFirstRow = weekIndex === 0;
            const isLastRow = weekIndex === Math.ceil(calendarDays.length / 7) - 1;

            return (
              <View
                key={weekIndex}
                className={`flex-row mb-2 ${isFirstRow || isLastRow ? 'justify-start' : ''}`}
              >
                {weekDays.map((day, dayIndex) => (
                  <View key={dayIndex} className="w-[14.28%] items-center">
                    {day ? (
                      <TouchableOpacity
                        onPress={() => handleDayPress(day)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          isSelected(day) ? 'bg-indigo-800 dark:bg-white' : ''
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            isSelected(day) ? 'text-white dark:text-black font-semibold' : 'text-black dark:text-white'
                          }`}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="w-10 h-10" />
                    )}
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          disabled={!selectedDate}
          className={`mx-4 py-4 rounded-full mb-20 ${
            selectedDate ? 'bg-indigo-800 dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
          }`}
          onPress={handleNext}
        >
          <Text className={`text-center text-base font-semibold ${
            selectedDate ? 'text-white dark:text-black' : 'text-gray-700 dark:text-gray-400'
          }`}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleYearPickerCancel}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{ 
            backgroundColor: isDark ? '#111827' : 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: 400
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? '#111827' : 'white',
            }}>
              <TouchableOpacity onPress={handleYearPickerCancel}>
                <Text style={{ color: isDark ? '#9ca3af' : '#4e5157', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{ color: isDark ? 'white' : 'black', fontSize: 18, fontWeight: '600' }}>Select Year</Text>
              <TouchableOpacity onPress={handleYearPickerDone}>
                <Text style={{ color: isDark? '#9ca3af' : '#4e5157', fontSize: 18, fontWeight: 'bold' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full h-[1.4px] bg-neutral-800 dark:bg-white/10" />
            
            <View style={{ flex: 1, paddingVertical: 20 }}>
              <WheelSpinner
                data={years.map(String)} 
                initialIndex={years.indexOf(tempSelectedYear)} 
                onValueChange={handleYearSelect}
                itemHeight={50}
                visibleCount={5}
                textClassName={isDark ? 'text-white text-xl font-medium' : 'text-black text-xl font-medium'}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Parental Consent Modal */}
      <Modal
        visible={showParentalConsent}
        transparent={false}
        animationType="fade"
        onRequestClose={handleParentalConsentClose}
      >
        <View className="flex-1 px-6 bg-gray-50 dark:bg-gray-900">
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center px-4">
            {/* Icon */}
            <View className="bg-blue-400 rounded-full w-20 h-20 justify-center items-center mb-8">
              <Ionicons name='happy' color= '#d7e0fd' size={44} />
            </View>

            {/* Title */}
            <Text className="text-black dark:text-white text-3xl font-bold text-center mb-8">
              Before we get started
            </Text>

            {/* Description */}
            <View className="mb-12">
              <Text className="text-black dark:text-white text-lg text-center mb-6">
                Please ask your parent or guardian to help you set up your Zenher account.
              </Text>
              
              <Text className="text-black dark:text-white text-base text-center mb-6">
                As you're younger than 16 years old, we're legally required to ask a parent or guardian for:
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <Text className="text-black dark:text-white text-base mr-2">•</Text>
                  <Text className="text-black dark:text-white text-base flex-1">
                    Their permission for you to use the Zenher app
                  </Text>
                </View>
                
                <View className="flex-row items-start">
                  <Text className="text-black dark:text-white text-base mr-2">•</Text>
                  <Text className="text-black dark:text-white text-base flex-1">
                    Their help to set up your privacy settings
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Got it Button */}
          <View className="pb-20 px-4">
            <TouchableOpacity
            disabled={!selectedDate}
              onPress={handleGotIt}
              className="bg-indigo-800 dark:bg-white py-4 rounded-full"
            >
              <Text className="text-white dark:text-black text-center text-base font-semibold">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

