import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, Text, useColorScheme, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const SIZE = width * 0.95;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2.5;
const STROKE_WIDTH = 24;
const KNOB_RADIUS = 26;
const startAngle = -90;
const endAngle = 230;

const CycleVisualizer = ({ cycleLength, lastPeriodDate }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const angle = useSharedValue(270);
  const [day, setDay] = React.useState(1);
  const knobScale = useSharedValue(1);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [isToday, setIsToday] = React.useState(false);

 const toRad = (deg) => {
  'worklet';
  return (deg * Math.PI) / 180;
};
  const polarToCartesian = (cx, cy, radius, angleInDegrees) => {
    const rad = toRad(angleInDegrees);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  useEffect(() => {
    const today = new Date();
    const lastDate = new Date(lastPeriodDate);
    const nextPeriod = new Date(lastDate);
    nextPeriod.setDate(lastDate.getDate() + cycleLength);

    const diffTime = nextPeriod.getTime() - today.getTime();
    const remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    setDaysLeft(remainingDays);

    const diffSinceLast = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffSinceLast / (1000 * 60 * 60 * 24));
    const dayInCycle = (diffDays % cycleLength + cycleLength) % cycleLength;
    const arcSpan = (endAngle - startAngle + 360) % 360;
    const dayAngle = (dayInCycle / (cycleLength - 1)) * arcSpan;

    angle.value = startAngle + dayAngle;
  }, [lastPeriodDate]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      knobScale.value = withTiming(1.25, { duration: 150 });
    })
    .onUpdate((event) => {
      'worklet';
      const dx = event.x - CENTER;
      const dy = event.y - CENTER;
      const theta = Math.atan2(dy, dx);
      let deg = (theta * 180) / Math.PI;
      deg = (deg + 360) % 360;
      angle.value = deg;
    })
    .onEnd(() => {
      knobScale.value = withTiming(1, { duration: 150 });
    })
    .onFinalize(() => {
      knobScale.value = withTiming(1, { duration: 150 });
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
    const arcSpan = (endAngle - startAngle + 360) % 360;
    const adjusted = (angle.value - startAngle + 360) % 360;
    const clamped = Math.min(adjusted, arcSpan);
    const calculatedDay = Math.round((clamped / arcSpan) * (cycleLength - 1)) + 1;

    const newDate = new Date(lastPeriodDate);
    newDate.setDate(newDate.getDate() + (calculatedDay - 1));
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const todayStr = new Date().toLocaleDateString(undefined, options);
    const formatted = newDate.toLocaleDateString(undefined, options);

    const remainingDays = Math.max(0, (cycleLength + 1) - calculatedDay);

    runOnJS(setDay)(calculatedDay);
    runOnJS(setSelectedDate)(formatted);
    runOnJS(setDaysLeft)(remainingDays);
    runOnJS(setIsToday)(todayStr === formatted);
  });

  return (
    <View className="flex-1 items-center pt-12 bg-gray-50 dark:bg-gray-900">
      <GestureDetector gesture={panGesture}>
        <Animated.View className="relative" style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            <Path
              d={arcPath}
              stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={describeArc(
                CENTER,
                CENTER,
                RADIUS,
                endAngle - ((4 / (cycleLength - 1)) * (endAngle - startAngle)),
                endAngle
              )}
              stroke={isDark ? "#FFD700" : "#FFA500"}
              strokeWidth={STROKE_WIDTH * 0.6}
              fill="none"
              strokeLinecap="round"
            />
            {Array.from({ length: cycleLength }).map((_, index) => {
              const angle = startAngle + (index / cycleLength) * (endAngle - startAngle);
              const { x, y } = polarToCartesian(CENTER, CENTER, RADIUS - STROKE_WIDTH / 2 - 16, angle);
              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={1.7}
                  fill={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                />
              );
            })}
          </Svg>

          {/* Water icon */}
          {(() => {
            const midAngle = (endAngle + (startAngle + 360)) / 2;
            const { x, y } = polarToCartesian(CENTER, CENTER, RADIUS, midAngle);
            return (
              <View className="absolute" style={{ left: x - 14, top: y - 14 }}>
                <Ionicons name="water" size={28} color="#ff3d3d" />
              </View>
            );
          })()}

          {/* Center display */}
          <View className="absolute items-center justify-center" style={{ width: SIZE, height: SIZE, paddingHorizontal: 70 }}>
            <Text className="text-black dark:text-white/80 text-center font-semibold text-sm">
              {selectedDate === new Date().toDateString() ? "Today" : selectedDate}
            </Text>
            <Text className="text-black dark:text-white font-semibold text-center mt-1 text-2xl">
              {`Next period in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
            </Text>
          </View>

          {/* Knob */}
          <Animated.View
            className={`rounded-full bg-gray-300 dark:bg-gray-700 border-[3px] absolute items-center justify-center ${
              isToday ? "border-blue-500" : "border-white dark:border-gray-900"
            }`}
            style={[
              knobStyle,
              {
                width: KNOB_RADIUS * 2,
                height: KNOB_RADIUS * 2,
                borderRadius: KNOB_RADIUS,
              },
            ]}
          >
            <Text className="font-semibold text-[10px] text-black dark:text-white/70">Day</Text>
            <Text className="font-semibold text-xl leading-tight text-black dark:text-white">{day}</Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default CycleVisualizer;
