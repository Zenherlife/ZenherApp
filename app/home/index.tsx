import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import CycleVisualizer from "@/modules/home/components/CycleVisualizer";
import WaterModal from "@/modules/home/components/WaterModal";
import {
  ChevronRight
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const user = useUserDataStore((state) => (state))
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { uid, water, setWaterField, setUser } = useUserDataStore();

  const motivationalQuotes = [
    "Stay hydrated, stay glowing 💧",
    "Water you doing? Keep drinking! 🥤",
    "Your body thanks you! 💙",
    "Hydration = motivation 🚀",
    "One glass closer to greatness! ✨",
  ];
  const [quote, setQuote] = useState("");

  const waterIntake = water.intake;
  const waterGoal = water.goal;
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  
  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;


  return (
    <View className='flex-1 dark:bg-gray-900 bg-gray-50' >
    <GestureHandlerRootView className="flex-1 bg-white">
      <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <CycleVisualizer cycleLength={user.averageCycle - 1} lastPeriodDate={user.lastPeriodDate} />
      {/* Water Box */}
      <View className=" px-6 pb-8 pt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-40 mt-4 ml-4 mr-4 ">
        {/* Top-left Modal Open Button */}
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Water Intake
          </Text>

          <TouchableOpacity
            onPress={() => setWaterModalVisible(true)}
            className="bg-blue-500 rounded-full p-1"
            activeOpacity={0.8}
          >
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View
          className={`w-full h-4 rounded-full overflow-hidden ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <View
            style={{ width: `${(waterIntake / waterGoal) * 100}%` }}
            className="h-full bg-blue-400"
          />
        </View>

        <Text
          className={`text-sm mt-1 mb-4 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {waterIntake}ml of {waterGoal}ml
        </Text>

        {/* Add/Reduce Buttons */}
        <View className="flex-row justify-between space-x-4">
          {/* Subtract Water */}
          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.max(waterIntake - water.cupSize, 0);
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [formatDateKey(new Date())]: newIntake

                  },
                },
              });
            }}
            className="flex-1 bg-gray-200 dark:bg-white py-3 rounded-xl items-center mr-1 active:scale-95"
            activeOpacity={0.9}
          >
            <Text className="font-semibold text-base text-black">
              - {water.cupSize}ml
            </Text>
          </TouchableOpacity>

          {/* Add Water */}
          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.min(
                waterIntake + water.cupSize,
                waterGoal
              );
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [formatDateKey(new Date())]: newIntake

                  },
                },
              });

              const random =
                motivationalQuotes[
                  Math.floor(Math.random() * motivationalQuotes.length)
                ];
              setQuote(random);
            }}
            className="flex-1 bg-blue-600 py-3 rounded-xl items-center ml-1 active:scale-95"
            activeOpacity={0.9}
          >
            <Text className="text-white font-semibold text-base">
              + {water.cupSize}ml
            </Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Quote */}
        {quote !== "" && (
          <Text
            className={`text-sm italic text-center mt-3 ${
              isDark ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {quote}
          </Text>
        )}
      </View>

      <WaterModal
        visible={waterModalVisible}
        onClose={() => setWaterModalVisible(false)}
        goal={water.goal}
        setGoal={(newGoal) => {
          setWaterField("goal", newGoal);
          setUser({
            uid,
            water: {
              ...water,
              goal: newGoal,
            },
          });
        }}
        intake={water.intake}
      />
      </ScrollView>
    </GestureHandlerRootView>
    </View>
  );
}
