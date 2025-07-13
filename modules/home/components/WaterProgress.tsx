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

const Glass = ({ progress, width = 40, height = 48 }) => {
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
    const waveLength = width;

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

  const progressPercent = Math.round((intake / goal) * 100);

  return (
    <TouchableOpacity
      onPress={() => setWaterModalVisible(true)}
      className="flex-1 aspect-[0.95] bg-white dark:bg-gray-800 rounded-[1.9rem] items-center relative overflow-hidden"
    >
      <Text className="text-[#888] dark:text-[#bbb] text-base mt-4 font-medium">
        Stay hydrated
      </Text>
      
      <View className="flex-1 items-center justify-center">
        <Text className={`${progressPercent >= 100 ? "text-[#7dc5f2]" : "text-neutral-800"} text-4xl font-bold text-center dark:text-[#eee]`}>
          {intake}
          <Text className="text-[#9e9e9e] dark:text-[#aaa] text-xl font-medium"> ml</Text>
        </Text>
        
        <Text className="text-sm text-[#666] dark:text-[#ccc] mt-2">
          {progressPercent}% of {goal}ml
        </Text>
      </View>
      
      <View className="flex-1 flex-row items-end mb-5 justify-center">
        <Glass progress={progress} />
        
        <View className="ml-3 gap-3">
          <View className="flex-row gap-x-3 justify-center">
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
              className="bg-[#F1F5F9] dark:bg-gray-700 p-2.5 rounded-full active:scale-95"
            >
              <Ionicons name="remove" color={isDark ? "white" : "#666"} size={16} />
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
              className="bg-[#85c9ee] dark:bg-[#3b82f6] p-2.5 rounded-full active:scale-95"
            >
              <Ionicons name="add" color="white" size={16} />
            </TouchableOpacity>
          </View>
          
          <Text className="text-xs text-[#888] dark:text-[#aaa] text-center">
            {water.cupSize}ml per cup
          </Text>
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
    </TouchableOpacity>
  );
}