import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import WaterModal from "./WaterModal";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const formatDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Wave = ({ progress }) => {
  const wavePhase = useSharedValue(0);
  const wavePhase2 = useSharedValue(0);

  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(1000, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    wavePhase2.value = withRepeat(
      withTiming(1000, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const waveWidth = 180;
    const waveHeight = 4;
    const waveLength = waveWidth / 2;

    let path = `M0 ${100}`;
    for (let x = 0; x <= waveWidth; x += 1) {
      const y =
        Math.sin(((x - wavePhase.value) / waveLength) * Math.PI * 2) *
          waveHeight +
        140 -
        progress.value;
      path += ` L${x} ${y}`;
    }
    path += ` L${waveWidth} 200 L0 200 Z`;
    return { d: path };
  });

  const animatedProps2 = useAnimatedProps(() => {
    const waveWidth = 180;
    const waveHeight = 4;
    const waveLength = waveWidth / 2;

    let path = `M0 ${100}`;
    for (let x = 0; x <= waveWidth; x += 1) {
      const y =
        Math.sin(((x + wavePhase2.value) / waveLength) * Math.PI * 2) *
          waveHeight +
        140 -
        progress.value;
      path += ` L${x} ${y}`;
    }
    path += ` L${waveWidth} 200 L0 200 Z`;
    return { d: path };
  });

  return (
    <Svg height="200" width="100%">
      <Defs>
        <LinearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#5fb3fc" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#0f6ae0" stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
      <AnimatedPath animatedProps={animatedProps} fill="url(#waterGradient)" />
      <AnimatedPath animatedProps={animatedProps2} fill="url(#waterGradient)" />
    </Svg>
  );
};

export default function WaterTracker() {
  const { uid, water, setWaterField, setUser } = useUserDataStore();
  const todayKey = formatDateKey(new Date());
  const intake = water.history?.[todayKey] ?? 0;
  const goal = water.goal;
  const progress = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [waterModalVisible, setWaterModalVisible] = useState(false);

  useEffect(() => {
    if (goal > 0) {
      progress.value = withTiming((intake / goal) * 100, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [intake, goal]);

  return (
    <View
      className="flex-row w-auto h-32 mx-4 bg-white dark:bg-gray-800 rounded-full my-4 items-center"
      style={{
        shadowColor: isDark ? "transparent" : "#bcbaba",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 13,
      }}
    >
      <TouchableOpacity
        onPress={() => setWaterModalVisible(true)}
        className="absolute top-4 right-8 bg-gray-200 dark:bg-gray-700 p-3 rounded-full"
      >
        <Ionicons
          name="arrow-forward"
          size={16}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <View className="w-32 h-32 rounded-full overflow-hidden justify-center items-center border-[8px] border-white dark:border-gray-800 relative">
        <Wave progress={progress} />
      </View>
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-black dark:text-white text-base font-semibold mb-2">
          Stay hydrated
        </Text>
        <Text className="text-[#5fb3fc] text-sm mb-2 font-medium">
          {Math.round((intake / goal) * 100)}% of daily goal
        </Text>

        <View className="flex-row gap-x-3">
          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.max(intake - water.cupSize, 0);
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [formatDateKey(new Date())]: newIntake,
                  },
                },
              });
            }}
            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
          >
            <Text className="text-black dark:text-white font-semibold">
              - {water.cupSize}ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const newIntake = Math.min(intake + water.cupSize, goal);
              setWaterField("intake", newIntake);
              setUser({
                uid,
                water: {
                  ...water,
                  intake: newIntake,
                  history: {
                    ...water.history,
                    [formatDateKey(new Date())]: newIntake,
                  },
                },
              });
            }}
            className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600"
          >
            <Text className="text-black dark:text-white font-semibold">
              + {water.cupSize}ml
            </Text>
          </TouchableOpacity>
        </View>
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
    </View>
  );
}
