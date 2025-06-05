import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

const days = [
  [27, 28, 29, 30, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
];

const flowOptions = [
  { label: 'Light', icon: '💧', color: '#FFB6C1' },
  { label: 'Medium', icon: '💧💧', color: '#FF69B4' },
  { label: 'Heavy', icon: '💧💧💧', color: '#FF1493' },
];

const moodOptions = [
  { label: 'Happy', icon: '😊', color: '#FFD700' },
  { label: 'Calm', icon: '😌', color: '#98FB98' },
  { label: 'Irritable', icon: '😤', color: '#FFA07A' },
  { label: 'Sad', icon: '😢', color: '#87CEEB' },
  { label: 'Anxious', icon: '😰', color: '#DDA0DD' },
];

const symptoms = [
  { label: 'Cramps', icon: '🤕' },
  { label: 'Headache', icon: '🤯' },
  { label: 'Bloating', icon: '🎈' },
  { label: 'Tender Breasts', icon: '💝' },
  { label: 'Acne', icon: '😶' },
  { label: 'Fatigue', icon: '😴' },
];

export default function TrackScreen() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [periodStartDate, setPeriodStartDate] = useState<number | null>(null);
  const [cycleDay, setCycleDay] = useState(1);

  const handleDatePress = (day: number) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedFlow === 'Heavy' && !periodStartDate) {
      setPeriodStartDate(selectedDate);
      setCycleDay(1);
    }
    setShowModal(false);
    setSelectedFlow(null);
    setSelectedMood(null);
    setSelectedSymptoms([]);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header with Cycle Info */}
      <View className="px-6 pt-8 pb-4">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">Your Cycle</Text>
        <View className="flex-row items-center mt-2">
          <View className="bg-pink-100 px-3 py-1 rounded-full mr-2">
            <Text className="text-sm font-bold text-pink-700">Day {cycleDay}</Text>
          </View>
          {periodStartDate && (
            <View className="bg-purple-100 px-3 py-1 rounded-full">
              <Text className="text-sm font-bold text-purple-700">Period Started: {periodStartDate}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Calendar Card */}
      <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mx-4 p-4 mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">May 2025</Text>
          <View className="flex-row space-x-2">
            <Pressable className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Ionicons name="chevron-back" size={18} color="#a1a1aa" />
            </Pressable>
            <Pressable className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Ionicons name="chevron-forward" size={18} color="#a1a1aa" />
            </Pressable>
          </View>
        </View>

        {/* Calendar Grid */}
        <View className="mb-2">
          <View className="flex-row justify-between mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
              <Text key={d} className="text-xs font-bold text-gray-400 w-8 text-center">{d}</Text>
            ))}
          </View>
          {days.map((week, i) => (
            <View key={i} className="flex-row justify-between mb-2">
              {week.map((day, j) => (
                <Pressable 
                  key={j} 
                  className="w-8 h-8 items-center justify-center"
                  onPress={() => handleDatePress(day)}
                >
                  <View className={`w-8 h-8 rounded-full items-center justify-center ${
                    selectedDate === day ? 'bg-purple-200' : ''
                  }`}>
                    <Text className={`text-sm font-bold ${
                      selectedDate === day ? 'text-purple-700' : 'text-gray-700 dark:text-gray-200'
                    }`}>{day}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Quick Stats */}
      <View className="flex-row mx-4 mb-6 space-x-4">
        <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4">
          <Text className="text-sm text-gray-500 dark:text-gray-400">Cycle Length</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">28 days</Text>
        </View>
        <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4">
          <Text className="text-sm text-gray-500 dark:text-gray-400">Next Period</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">In 14 days</Text>
        </View>
      </View>

      {/* Modal for Detailed Logging */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-[400px]">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Log for May {selectedDate}, 2025
            </Text>

            {/* Flow Selection */}
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">Flow:</Text>
            <View className="flex-row justify-between mb-6">
              {flowOptions.map((flow) => (
                <Pressable
                  key={flow.label}
                  className={`px-4 py-2 rounded-full ${
                    selectedFlow === flow.label ? 'bg-pink-500' : 'bg-gray-200'
                  }`}
                  onPress={() => setSelectedFlow(flow.label)}
                >
                  <Text className={`font-bold ${
                    selectedFlow === flow.label ? 'text-white' : 'text-gray-700'
                  }`}>{flow.icon} {flow.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Mood Selection */}
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">Mood:</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {moodOptions.map((mood) => (
                <Pressable
                  key={mood.label}
                  className={`px-4 py-2 rounded-full ${
                    selectedMood === mood.label ? 'bg-purple-500' : 'bg-gray-200'
                  }`}
                  onPress={() => setSelectedMood(mood.label)}
                >
                  <Text className={`font-bold ${
                    selectedMood === mood.label ? 'text-white' : 'text-gray-700'
                  }`}>{mood.icon} {mood.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Symptoms Selection */}
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">Symptoms:</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {symptoms.map((symptom) => (
                <Pressable
                  key={symptom.label}
                  className={`px-4 py-2 rounded-full ${
                    selectedSymptoms.includes(symptom.label) ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onPress={() => toggleSymptom(symptom.label)}
                >
                  <Text className={`font-bold ${
                    selectedSymptoms.includes(symptom.label) ? 'text-white' : 'text-gray-700'
                  }`}>{symptom.icon} {symptom.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Save Button */}
            <Pressable
              className="bg-purple-600 py-3 rounded-xl"
              onPress={handleSave}
            >
              <Text className="text-white font-bold text-center">Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
} 