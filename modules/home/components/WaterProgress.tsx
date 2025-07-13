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
import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";
import WaterModal from "./WaterModal";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const formatDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Glass = ({ progress, width = 55, height = 70 }) => {
  const wavePhase = useSharedValue(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  useEffect(() => {
    wavePhase.value = withRepeat(
      withTiming(1000, { duration: 50000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const waveHeight = 3;
    const waveLength = width / 1.2;

    let path = `M0 ${height}`;
    for (let x = 0; x <= width; x += 1) {
      const y =
        Math.sin(((x - wavePhase.value) / waveLength) * Math.PI * 2) *
          waveHeight +
        height - (progress.value / 100) * height;
      path += ` L${x} ${y}`;
    }
    path += ` L${width} ${height} L0 ${height} Z`;
    return { d: path };
  });

  const glassPath = `
    M${width * 0.05} 0
    L${width * 0.95} 0
    L${width * 0.85} ${height - 10}
    Q${width * 0.85} ${height} ${width * 0.85 - 10} ${height}
    L${width * 0.15 + 10} ${height}
    Q${width * 0.15} ${height} ${width * 0.15} ${height - 10}
    Z
  `;

  const basePath = `
    M${width * 0.15} ${height - 10}
    L${width * 0.85} ${height - 10}
    L${width * 0.81} ${height + 6}
    Q${width * 0.81} ${height + 6} ${width * 0.81 - 4} ${height + 6}
    L${width * 0.19 + 4} ${height + 6}
    Q${width * 0.19} ${height + 6} ${width * 0.19} ${height + 6}
    Z
  `;
  
  return (
    <Svg width={width} height={height + 8}>
      <Defs>
        <ClipPath id="glassClip">
          <Path d={glassPath} />
        </ClipPath>
      </Defs>
      <Path
        d={basePath}
        fill={isDark ? "rgba(96, 165, 250, 0.15)" : "rgba(44, 147, 219, 0.12)"}
      />
      <AnimatedPath
        animatedProps={animatedProps}
        fill={isDark ? "#3b82f6" : "#bee2f5"}
        clipPath="url(#glassClip)"
      />
      {/* <Path
        d={glassPath}
        stroke="#5fb3fc"
        strokeWidth={2}
        fill="none"
      /> */}
      <Rect
        x="0"
        y="0"
        width={width / 2}
        height={height}
        fill={isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(7, 42, 89, 0.02)"}
        clipPath="url(#glassClip)"
      />

      <Rect
        x={width / 2}
        y="0"
        width={width / 2}
        height={height}
        fill={isDark ? "rgba(96, 165, 250, 0.18)" : "rgba(44, 147, 219, 0.12)"}
        clipPath="url(#glassClip)"
      />
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
      className="flex-row w-auto h-40 mx-4 bg-white dark:bg-gray-800 rounded-full my-4 items-center"
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
        className="absolute top-4 right-8 bg-gray-200 dark:bg-gray-700 p-4 rounded-full"
      >
        <Ionicons
          name="arrow-forward"
          size={16}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <View className="w-40 justify-center items-center relative">
        <Glass progress={progress} />
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
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full border border-gray-300 dark:border-gray-600"
          >
             <Ionicons name="remove" color={isDark ? "white" : "black"} size={24} />
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
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full border border-gray-300 dark:border-gray-600"
          >
            <Ionicons name="add" color={isDark ? "white" : "black"} size={24} />
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
