import { useOnboardingStore } from '@/modules/auth/store/onboardingStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native'; // Optional icon lib
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function PeriodScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const setField = useOnboardingStore((state) => state.setField);
  const router = useRouter()

  return (
    <View className="flex-1 bg-black px-6 pt-10">
      
      {/* Back Arrow */}
      <TouchableOpacity className="absolute top-10 left-6 z-10">
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      {/* Red Drop Icon */}
      <View className="items-center justify-center mt-12 mb-6">
        <View className="bg-red-500 rounded-full w-20 h-20 items-center justify-center">
          <MaterialCommunityIcons name="water" size={30} color="white" />
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
            selectedColor: '#0ea5e9', // Tailwind sky-500
          },
        }}
        theme={{
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
        <TouchableOpacity className="flex-1 h-14 bg-cyan-900 rounded-full  items-center justify-center px-8" 
          onPress={() => {
            router.push('./reminder')
          }}
          >
          <Text className="text-cyan-400 font-semibold text-lg">Not sure</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 h-14 bg-cyan-400 rounded-full items-center justify-center px-8" 
        onPress={() => {
          setField('lastPeriodDate', selectedDate)
            router.push('./reminder')
        }}
        >
          <Text className="text-black font-semibold text-lg">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
