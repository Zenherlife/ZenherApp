import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BirthdateScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showParentalConsent, setShowParentalConsent] = useState(false);
  const setField = useUserDataStore((state) => state.setField);
  const router = useRouter();

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
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
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
    setCurrentYear(year);
    setShowYearPicker(false);
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
      router.push('./onboard/Policies');
    }
  };

  const handleParentalConsentClose = () => {
    setShowParentalConsent(false);
  };

  const handleGotIt = () => {
    if(selectedDate) {
      setField('dateOfBirth', selectedDate)
      router.push('./onboard/Policies')
      setShowParentalConsent(false);
    } 
    
  };

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="bg-[#ed6372] rounded-full w-20 h-20 justify-center items-center mb-6">
            <Feather name="gift" size={32} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">When were you born?</Text>
          <Text className="text-gray-400 text-center text-base px-4">
            Since cycles can change over time, this helps us customize the app for you.
          </Text>
        </View>

        {/* Month/Year Header */}
        <View className="flex-row items-center justify-between mb-6 px-4">
          <TouchableOpacity onPress={handlePrevMonth}>
            <Feather name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setShowYearPicker(true)}
            className="flex-row items-center"
          >
            <Text className="text-white text-lg font-medium">
              {months[currentMonth]} {currentYear}
            </Text>
            <Feather name="chevron-down" size={20} color="white" className="ml-2" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleNextMonth}>
            <Feather name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View className="flex-row mb-4">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-gray-400 text-sm font-medium">{day}</Text>
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
                          isSelected(day) ? 'bg-white' : ''
                        }`}
                      >
                        <Text
                          className={`text-base ${
                            isSelected(day) ? 'text-black font-semibold' : 'text-white'
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
            selectedDate ? 'bg-white' : 'bg-gray-700'
          }`}
          onPress={handleNext}
        >
          <Text className={`text-center text-base font-semibold ${
            selectedDate ? 'text-black' : 'text-gray-400'
          }`}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end'
        }}>
          <View style={{ 
            backgroundColor: '#1f2937',
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
              borderBottomColor: '#374151'
            }}>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Text style={{ color: '#9ca3af', fontSize: 18 }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                <Text style={{ color: '#22d3ee', fontSize: 18 }}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
              renderItem={({ item: year }) => (
                <TouchableOpacity
                  onPress={() => handleYearSelect(year)}
                  style={{
                    padding: 16,
                    backgroundColor: year === currentYear ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                    borderBottomWidth: 0.5,
                    borderBottomColor: '#374151'
                  }}
                >
                  <Text style={{
                    textAlign: 'center',
                    fontSize: 18,
                    color: year === currentYear ? '#22d3ee' : 'white',
                    fontWeight: year === currentYear ? '600' : 'normal'
                  }}>
                    {year}
                  </Text>
                </TouchableOpacity>
              )}
              initialScrollIndex={years.findIndex(y => y === currentYear)}
              getItemLayout={(data, index) => ({
                length: 57,
                offset: 57 * index,
                index,
              })}
            />
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
        <View className="flex-1 px-6 bg-gray-900">
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center px-4">
            {/* Icon */}
            <View className="bg-blue-400 rounded-full w-20 h-20 justify-center items-center mb-8">
              <Ionicons name='happy' color='#d7e0fd' size={44} />
            </View>

            {/* Title */}
            <Text className="text-white text-3xl font-bold text-center mb-8">
              Before we get started
            </Text>

            {/* Description */}
            <View className="mb-12">
              <Text className="text-white text-lg text-center mb-6">
                Please ask your parent or guardian to help you set up your Zenher account.
              </Text>
              
              <Text className="text-white text-base text-center mb-6">
                As you're younger than 16 years old, we're legally required to ask a parent or guardian for:
              </Text>
              
              <View className="space-y-3">
                <View className="flex-row items-start">
                  <Text className="text-white text-base mr-2">•</Text>
                  <Text className="text-white text-base flex-1">
                    Their permission for you to use the Zenher app
                  </Text>
                </View>
                
                <View className="flex-row items-start">
                  <Text className="text-white text-base mr-2">•</Text>
                  <Text className="text-white text-base flex-1">
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
              className="bg-white py-4 rounded-full"
            >
              <Text className="text-black text-center text-base font-semibold">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}