import { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function MoodTracker({ isDark = false }) {
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  
  // Sample mood data
  const moodLogs = [
    { date: "2025-07-09", mood: "happy", intensity: 4, note: "Great day!" },
    { date: "2025-07-10", mood: "fine", intensity: 3, note: "Peaceful" },
    { date: "2025-07-11", mood: "anxious", intensity: 2, note: "Work pressure" },
    { date: "2025-07-12", mood: "excited", intensity: 5, note: "Amazing news!" },
    { date: "2025-07-13", mood: "happy", intensity: 2, note: "Long day" },
  ];

  const moodEmojis = {
    moodSwings: { emoji: "🔄", color: ["#f0f4ff", "#f0f4ff"], textColor: "#6366f1" },
    notInControl: { emoji: "🤯", color: ["#fef7f0", "#fef7f0"], textColor: "#ea580c" },
    fine: { emoji: "🙂", color: ["#f0fdf4", "#f0fdf4"], textColor: "#059669" },
    happy: { emoji: require('@/assets/images/emojis/happy.png'), color: ["#fffbeb", "#fffbeb"], textColor: "#d97706" },
    sad: { emoji: "😢", color: ["#eff6ff", "#eff6ff"], textColor: "#3b82f6" },
    confident: { emoji: "💪", color: ["#ecfdf5", "#ecfdf5"], textColor: "#059669" },
    excited: { emoji: "🤩", color: ["#fdf2f8", "#fdf2f8"], textColor: "#ec4899" },
    irritable: { emoji: "😤", color: ["#fef2f2", "#fef2f2"], textColor: "#dc2626" },
    anxious: { emoji: "😟", color: ["#f3e8ff", "#f3e8ff"], textColor: "#9333ea" },
    insecure: { emoji: "😔", color: ["#f8fafc", "#f8fafc"], textColor: "#64748b" },
    grateful: { emoji: "🙏", color: ["#f0f9ff", "#f0f9ff"], textColor: "#0284c7" },
    indifferent: { emoji: "😐", color: ["#f9fafb", "#f9fafb"], textColor: "#6b7280" },
  };

  const todayMood = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return moodLogs.find(log => log.date === today);
  }, [moodLogs]);


  const handleMoodSelect = (mood) => {
    console.log('Selected mood:', mood);
  };

  return (
    <TouchableOpacity
      onPress={() => setMoodModalVisible(true)}
      className="flex-1 aspect-[0.95] bg-white dark:bg-gray-800 rounded-[1.9rem] items-center relative overflow-hidden"
    >
      
      <Text className="text-[#888] dark:text-[#bbb] text-base mt-4 font-medium">
        How are you?
      </Text>
      
      <View className="flex-1 items-center justify-center px-4 pb-2">
        {todayMood ? (
          <View className="flex-1 items-center justify-center">
            <Image source={moodEmojis[todayMood.mood].emoji} className='w-24 h-24 mb-2'/>
            <Text className="text-[#333] dark:text-[#eee] text-lg font-bold capitalize">
              {todayMood.mood}
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-4xl mb-2">🤔</Text>
            <Text className="text-[#333] dark:text-[#eee] text-base font-semibold">
              Track mood
            </Text>
            <Text className="text-xs text-[#666] dark:text-[#ccc] mt-1 text-center">
              Tap to log
            </Text>
          </View>
        )}
      </View>
    
    </TouchableOpacity>
  );
}