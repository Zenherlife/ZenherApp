import React, { useMemo } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PeriodCycle({ isDark = false }) {
  const periodLogs = [
    "2025-05-05",
    "2025-06-01", 
    "2025-06-28",
    "2025-07-25",
    "2025-08-22",
    "2025-09-18"
  ];

  const cycleData = useMemo(() => {
    const cycles = [];
    
    for (let i = 0; i < periodLogs.length - 1; i++) {
      const currentDate = new Date(periodLogs[i]);
      const nextDate = new Date(periodLogs[i + 1]);
      const cycleDuration = Math.ceil((nextDate - currentDate) / (1000 * 60 * 60 * 24));
      
      cycles.push({
        startDate: periodLogs[i],
        duration: cycleDuration,
      });
    }
    
    return cycles.slice(-8); // Show last 8 cycles for better visualization
  }, [periodLogs]);

  const averageCycle = useMemo(() => {
    if (cycleData.length === 0) return 28;
    return Math.round(cycleData.reduce((sum, cycle) => sum + cycle.duration, 0) / cycleData.length);
  }, [cycleData]);

  const lastPeriodDate = useMemo(() => {
    if (periodLogs.length === 0) return null;
    return new Date(periodLogs[periodLogs.length - 1]);
  }, [periodLogs]);

  const nextPeriodDate = useMemo(() => {
    if (!lastPeriodDate) return null;
    const next = new Date(lastPeriodDate);
    next.setDate(next.getDate() + averageCycle);
    return next;
  }, [lastPeriodDate, averageCycle]);

  const daysUntilNext = useMemo(() => {
    if (!nextPeriodDate) return 0;
    const today = new Date();
    const diffTime = nextPeriodDate - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [nextPeriodDate]);

  const currentPhase = useMemo(() => {
    if (!lastPeriodDate) return "Unknown";
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPeriod <= 5) return "Menstrual";
    if (daysSinceLastPeriod <= 13) return "Follicular";
    if (daysSinceLastPeriod <= 15) return "Ovulation";
    return "Luteal";
  }, [lastPeriodDate]);

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "Menstrual": return ["#FF6B6B", "#FF8E8E"];
      case "Follicular": return ["#4ECDC4", "#45B7B8"];
      case "Ovulation": return ["#FFE66D", "#FFD93D"];
      case "Luteal": return ["#A8E6CF", "#88D8A3"];
      default: return ["#95E1D3", "#B8E6B8"];
    }
  };

  const getBarHeight = (duration) => {
    const maxHeight = 100;
    const minHeight = 30;
    const maxDuration = Math.max(...cycleData.map(c => c.duration), 35);
    const minDuration = Math.min(...cycleData.map(c => c.duration), 21);
    return minHeight + ((duration - minDuration) / (maxDuration - minDuration)) * (maxHeight - minHeight);
  };


  const cardWidth = width * 0.5;

  return (
    <TouchableOpacity
      onPress={() => setWaterModalVisible(true)}
      className="flex-1 aspect-[0.95] bg-white dark:bg-gray-800 rounded-[1.9rem] items-center relative overflow-hidden"
    >

      <View className="items-center pt-4 pb-2">
        <Text className="text-[#888] dark:text-[#bbb] text-base font-medium">
          Cycle Tracker
        </Text>
      </View>

      <View className="items-center mb-4">
        <View className="bg-[#F8F9FA] dark:bg-gray-700 px-3 py-1.5 rounded-full">
          <Text className="text-xs font-medium" style={{ color: getPhaseColor(currentPhase)[0] }}>
            {currentPhase}
          </Text>
        </View>
      </View>
      
      <View className="flex-1 justify-end pb-2">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 16,
            alignItems: 'flex-end',
            minWidth: cardWidth,
          }}
        >
          <View className="flex-row items-end gap-3">
            {cycleData.map((cycle, index) => {
              const barHeight = getBarHeight(cycle.duration);
              
              return (
                <View key={index} className="items-center">
                  <Text className="text-xs text-[#666] dark:text-[#ccc] mb-2 font-medium">
                    {cycle.duration}
                  </Text>
                  <View
                    className="rounded-full"
                    style={{
                      backgroundColor: '#ede3ef',
                      width: 18,
                      height: barHeight,
                      opacity: index === cycleData.length - 1 ? 1 : 0.8,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
        
        <View className="mt-3" />
      </View>
    </TouchableOpacity>
  );
}