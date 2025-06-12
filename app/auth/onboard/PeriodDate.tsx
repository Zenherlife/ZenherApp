import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PeriodScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const setField = useUserDataStore((state) => state.setField);
  const router = useRouter()

  return (
  <SafeAreaView className="flex-1 bg-gray-900 px-6">
    {/* Back Button */}
    <TouchableOpacity className="mt-4" onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>

    {/* Red Drop Icon */}
    <View className="items-center justify-center mt-12 mb-6">
      <View className="bg-red-500 rounded-full w-20 h-20 items-center justify-center">
        <Ionicons name="water" size={30} color="white" />
      </View>
    </View>

    {/* Title */}
    <Text className="text-white text-2xl font-bold text-center mb-2">When did your last period start?</Text>

    {/* Subtitle */}
    <Text className="text-white text-center opacity-80 mb-4">We can then predict your next period.</Text>

    {/* Calendar */}
    <Calendar
      current={new Date().toISOString().split('T')[0]}
      onDayPress={(day) => setSelectedDate(day.dateString)}
      markedDates={{
        [selectedDate]: {
          selected: true,
          selectedColor: 'white', 
        },
      }}
      theme={{
        todayTextColor: '#ff5656',
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#ffffff',
        dayTextColor: '#ffffff',
        monthTextColor: '#ffffff',
        arrowColor: '#ffffff',
        textDisabledColor: 'gray',
        selectedDayTextColor: '#000000',
      }}
    />

    {/* Buttons */}
    <View className="flex-row justify-between mt-6 px-2 gap-4">
      <TouchableOpacity className="flex-1 h-14 bg-white/30 rounded-full  items-center justify-center px-8" 
        onPress={() => {
          router.push('./AverageCycle')
        }}
        >
        <Text className="text-white font-semibold text-lg">Not sure</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1 h-14 bg-white rounded-full items-center justify-center px-8" 
        onPress={() => {
        setField('lastPeriodDate', selectedDate)
          router.push('./AverageCycle')
      }}
      >
        <Text className="text-black font-semibold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
}
