import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, Text, useColorScheme, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get("window");
const SIZE = width * 0.83;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2.5;
const STROKE_WIDTH = 24;
const KNOB_RADIUS = 22;
const startAngle = -90;
const endAngle = 230;

const CycleVisualizer = ({ cycleLength, lastPeriodDate }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const angle = useSharedValue(270);
  const [day, setDay] = React.useState(1);
  const knobScale = useSharedValue(1);
  const progressAngle = useSharedValue(0);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [isToday, setIsToday] = React.useState(false);
  const [cyclePhase, setCyclePhase] = React.useState("menstrual");
  const [currentPhaseColor, setCurrentPhaseColor] = React.useState("#FF6B6B");

  const toRad = (deg) => {
    'worklet';
    return (deg * Math.PI) / 180;
  };

  const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
    'worklet';
    if (!isFinite(cx) || !isFinite(cy) || !isFinite(radius) || !isFinite(angleInDegrees)) {
      return { x: cx || 0, y: cy || 0 };
    }
    
    const rad = toRad(angleInDegrees);
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    
    return {
      x: isFinite(x) ? x : cx,
      y: isFinite(y) ? y : cy,
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    'worklet';
    if (!isFinite(x) || !isFinite(y) || !isFinite(radius) || !isFinite(startAngle) || !isFinite(endAngle)) {
      return `M ${x} ${y}`;
    }
    
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    
    if (!isFinite(start.x) || !isFinite(start.y) || !isFinite(end.x) || !isFinite(end.y)) {
      return `M ${x} ${y}`;
    }
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const getCyclePhase = (dayInCycle) => {
    'worklet';
    if (dayInCycle <= 5) return "menstrual";
    if (dayInCycle <= 13) return "follicular";
    if (dayInCycle <= 15) return "ovulation";
    return "luteal";
  };

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const getPhaseInfo = (phase) => {
    const phases = {
      menstrual: { phase: "menstrual", color: "#E53E3E", icon: "water" },
      follicular: { phase: "follicular", color: "#06B6D4", icon: "leaf" },
      ovulation: { phase: "ovulation", color: "#3B82F6", icon: "egg" },
      luteal: { phase: "luteal", color: "#10B981", icon: "moon" }
    };
    return phases[phase] || phases.menstrual;
  };

  useEffect(() => {
    const today = stripTime(new Date());
    const lastDate = new Date(lastPeriodDate);
    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLength);

    const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

    const diffTime = nextPeriod.getTime() - today.getTime();
    const remainingDays = Math.max(0, diffTime / MS_IN_A_DAY);
    setDaysLeft(remainingDays);

    const diffSinceLast = today.getTime() - lastDate.getTime();
    const diffDays = Math.max(0, diffSinceLast / MS_IN_A_DAY);
    const dayInCycle = (diffDays % cycleLength + cycleLength) % cycleLength;
    const arcSpan = (endAngle - startAngle + 360) % 360;
    const dayAngle = (dayInCycle / (cycleLength - 1)) * arcSpan;

    angle.value = startAngle + dayAngle;
  }, [lastPeriodDate, cycleLength]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      knobScale.value = withTiming(1.15, { duration: 150 });
    })
    .onUpdate((event) => {
      'worklet';
      const dx = event.x - CENTER;
      const dy = event.y - CENTER;
      const theta = Math.atan2(dy, dx);
      let deg = (theta * 180) / Math.PI;
      deg = (deg + 360) % 360;
      
      const arcSpan = (endAngle - startAngle + 360) % 360;
      const adjusted = (deg - startAngle + 360) % 360;
      const clamped = Math.min(Math.max(adjusted, 0), arcSpan);
      const constrainedAngle = startAngle + clamped;
      
      angle.value = constrainedAngle;
      progressAngle.value = withTiming(clamped, { duration: 100 });
    })
    .onEnd(() => {
      knobScale.value = withTiming(1, { duration: 200 });
    })
    .onFinalize(() => {
      knobScale.value = withTiming(1, { duration: 200 });
    });

  const arcPath = React.useMemo(
    () => describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle),
    []
  );

  const knobStyle = useAnimatedStyle(() => {
    "worklet";
    const rad = toRad(angle.value);
    const x = CENTER + RADIUS * Math.cos(rad);
    const y = CENTER + RADIUS * Math.sin(rad);

    return {
      transform: [
        { translateX: x - KNOB_RADIUS },
        { translateY: y - KNOB_RADIUS },
        { scale: knobScale.value }
      ]
    };
  });

  useDerivedValue(() => {
    'worklet';
    const arcSpan = (endAngle - startAngle + 360) % 360;
    const adjusted = (angle.value - startAngle + 360) % 360;
    const clamped = Math.min(adjusted, arcSpan);
    const calculatedDay = Math.round((clamped / arcSpan) * (cycleLength - 1)) + 1;

    const newDate = new Date(lastPeriodDate);
    newDate.setDate(newDate.getDate() + (calculatedDay - 1));
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString(undefined, options);
    const formatted = newDate.toLocaleDateString(undefined, options);

    const remainingDays = Math.max(0, (cycleLength + 1) - calculatedDay);
    const currentPhase = getCyclePhase(calculatedDay);

    runOnJS(setDay)(calculatedDay);
    runOnJS(setSelectedDate)(formatted);
    runOnJS(setDaysLeft)(remainingDays);
    runOnJS(setIsToday)(todayStr === formatted);
    runOnJS(setCyclePhase)(currentPhase);
    
    const phaseColors = {
      menstrual: "#F87171",
      follicular: "#22D3EE",
      ovulation: "#60A5FA",
      luteal: "#34D399"
    };
    runOnJS(setCurrentPhaseColor)(phaseColors[currentPhase]);
  }, [angle, cycleLength, lastPeriodDate]);

  const currentPhaseInfo = getPhaseInfo(cyclePhase);

  const animatedProgressProps = useAnimatedProps(() => {
    'worklet';
    const validAngle = isFinite(angle.value) ? angle.value : startAngle;
    const progressPath = describeArc(CENTER, CENTER, RADIUS, startAngle, validAngle);
    return {
      d: progressPath,
    };
  });

  return (
    <View className="flex-1 items-center justify-center px-4 pb-6">
      <View className="bg-white dark:bg-gray-800 rounded-3xl px-6 pb-24 pt-16" >
        <GestureDetector gesture={panGesture}>
          <Animated.View className="relative" style={{ width: SIZE, height: SIZE }}>
            <Svg width={SIZE} height={SIZE}>
              <Path
                d={arcPath}
                stroke={isDark ? "#374151" : "#F1F5F9"}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
              />

              <AnimatedPath
                animatedProps={animatedProgressProps}
                stroke={currentPhaseColor}
                strokeWidth={STROKE_WIDTH - 2}
                fill="none"
                strokeLinecap="round"
                opacity={0.9}
              />

              {[5, 13, 15].map((phaseDay, index) => {
                const phaseAngle = startAngle + (phaseDay / cycleLength) * (endAngle - startAngle);
                const { x, y } = polarToCartesian(CENTER, CENTER, RADIUS, phaseAngle);
                return (
                  <Circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={2}
                    fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
                  />
                );
              })}
            </Svg>
            
            <View className="absolute" style={{ 
              left: CENTER - 18, 
              top: CENTER - 85,
              alignItems: 'center' 
            }}>
              <View className="w-9 h-9 rounded-xl items-center justify-center" 
                    style={{ backgroundColor: currentPhaseColor + '20' }}>
                <Ionicons name={currentPhaseInfo.icon} size={20} color={currentPhaseColor} />
              </View>
            </View>
            
            <View className="absolute items-center justify-center mt-4" style={{ width: SIZE, height: SIZE }}>
              <View className="items-center">
                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {isToday ? "Today" : selectedDate}
                </Text>
                
                <Text className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                  {day}
                </Text>
                
                <Text className="text-sm text-gray-600 dark:text-gray-300 capitalize mb-3" 
                      style={{ color: currentPhaseColor }}>
                  {currentPhaseInfo.phase} phase
                </Text>
                
                <View className="px-4 py-2 rounded-full" 
                     style={{ backgroundColor: currentPhaseColor + '15' }}>
                  <Text className="text-sm font-medium" style={{ color: currentPhaseColor }}>
                    {daysLeft > 0 ? `${Math.ceil(daysLeft)} days left` : "Period expected"}
                  </Text>
                </View>
              </View>
            </View>

            <Animated.View
              className="rounded-full shadow-lg border-2 absolute items-center justify-center bg-white dark:bg-gray-800"
              style={[
                knobStyle,
                {
                  width: KNOB_RADIUS * 2,
                  height: KNOB_RADIUS * 2,
                  borderRadius: KNOB_RADIUS,
                  borderColor: isToday ? "#60A5FA" : currentPhaseColor,
                  elevation: 8,
                  shadowColor: currentPhaseColor,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                },
              ]}
            >
              <View className="w-3 h-3 rounded-full" 
                   style={{ backgroundColor: currentPhaseColor }} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View className="absolute flex-row justify-between w-full" style={{ width: SIZE, height: SIZE + 50}}>
        {[
          { phase: "Menstrual", color: "#FF6B6B", days: "1-5", position: { bottom: '17%', left: '1%' } },
          { phase: "Follicular", color: "#4ECDC4", days: "6-13", position: { bottom: '0%', left: '22%' } },
          { phase: "Ovulation", color: "#45B7D1", days: "14-15", position: { bottom: '0%', right: '22%' } },
          { phase: "Luteal", color: "#96CEB4", days: "16+", position: { bottom: '17%', right: '1%' } }
        ].map((phase, index) => (
          <View key={index} className="absolute items-center flex-1" style={phase.position}>
            <View className="w-3 h-3 rounded-full" 
                 style={{ backgroundColor: phase.color }} />
            <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {phase.phase}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {phase.days}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CycleVisualizer;