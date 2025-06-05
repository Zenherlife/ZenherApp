import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function BirthdateScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
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

  const calendarDays = generateCalendarDays();

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Feather name="arrow-left" size={28} color="#22d3ee" />
        </TouchableOpacity>

        <View className="items-center mb-8">
          <View className="bg-orange-500 rounded-full w-20 h-20 justify-center items-center mb-6">
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

        {/* Calendar Grid */}
        <View className="mb-8">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
            <View key={weekIndex} className="flex-row mb-2">
              {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => (
                <View key={dayIndex} className="flex-1 items-center">
                  {day ? (
                    <TouchableOpacity
                      onPress={() => handleDayPress(day)}
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        isSelected(day) ? 'bg-cyan-400' : ''
                      }`}
                    >
                      <Text className={`text-base ${
                        isSelected(day) ? 'text-black font-semibold' : 'text-white'
                      }`}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="w-10 h-10" />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          disabled={!selectedDate}
          className={`mx-4 py-4 rounded-full mb-8 ${
            selectedDate ? 'bg-cyan-400' : 'bg-gray-700'
          }`}
          onPress={() => router.push('./signup')}
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
    </View>
  );
}