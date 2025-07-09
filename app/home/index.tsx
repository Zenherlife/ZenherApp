import LayoutHeader from "@/components/LayoutHeader";
import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import CycleVisualizer from "@/modules/home/components/CycleVisualizer";
import WaterTracker from "@/modules/home/components/WaterProgress";
import React from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const user = useUserDataStore((state) => (state))
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className='flex-1 dark:bg-gray-900 bg-gray-50' >
      <LayoutHeader />
      <GestureHandlerRootView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <CycleVisualizer cycleLength={user.averageCycle - 1} lastPeriodDate={user.lastPeriodDate} />
          <WaterTracker />
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
}
