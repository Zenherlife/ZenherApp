import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import CycleVisualizer from "@/modules/home/components/CycleVisualizer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const user = useUserDataStore((state) => (state))

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      
      <CycleVisualizer cycleLength={user.averageCycle - 1} lastPeriodDate={user.lastPeriodDate} />
    </GestureHandlerRootView>
  );
}
