import BMI from "@/components/BMI";
import LayoutHeader from "@/components/LayoutHeader";
import MoodTracker from '@/components/MoodTracker';
import PeriodCycle from '@/components/PeriodCycle';
import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import CycleVisualizer from "@/modules/home/components/CycleVisualizer";
import WaterTracker from "@/modules/home/components/WaterProgress";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const user = useUserDataStore((state) => (state))
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
	const router = useRouter()
  return (
    <View className='flex-1 dark:bg-gray-900 bg-backLight' >
      <LayoutHeader />
      <GestureHandlerRootView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <CycleVisualizer cycleLength={user.averageCycle - 1} lastPeriodDate={user.lastPeriodDate} />
          <View className="flex-row flex-wrap mx-4 gap-4 mb-4">
            <PeriodCycle />
            <WaterTracker />
          </View>
          <View className="flex-row flex-wrap mx-4 gap-4">
            <MoodTracker />
            <BMI onPress={() => router.push('../setting/BMI')}/>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
}
