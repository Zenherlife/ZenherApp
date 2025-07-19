import React, { useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  Text,
  View,
  useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface WheelSpinnerProps {
  data: string[];
  itemHeight?: number;
  visibleCount?: number;
  onValueChange?: (value: string, index: number) => void;
  textClassName?: string;
  initialIndex?: number;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const WheelSpinner: React.FC<WheelSpinnerProps> = ({
  data,
  itemHeight = 42,
  visibleCount = 5,
  onValueChange,
  textClassName = 'text-black dark:text-white text-xl font-medium',
  initialIndex = 0,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const wheelHeight = itemHeight * visibleCount;
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  
  const [initialScrollDone, setInitialScrollDone] = React.useState(false);

  useEffect(() => {
    if (initialIndex != null && flatListRef.current && !initialScrollDone) {
      if (data.length > 0) {
        const offset = initialIndex * itemHeight;
        flatListRef.current?.scrollToOffset({
          offset: offset,
          animated: false,
        });
        setInitialScrollDone(true); 
      }
    }
  }, [initialIndex, data, itemHeight, initialScrollDone]);

  const handleMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(offsetY / itemHeight);
    onValueChange?.(data[selectedIndex], selectedIndex);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <View
        className="w-full overflow-hidden relative"
        style={{ height: wheelHeight }}
      >
        <AnimatedFlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item) => item}
          bounces={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{
            paddingVertical: (wheelHeight - itemHeight) / 2,
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 2) * itemHeight,
              (index - 1) * itemHeight,
              index * itemHeight,
              (index + 1) * itemHeight,
              (index + 2) * itemHeight,
            ];

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [0.7, 0.9, 1, 0.9, 0.7],
              extrapolate: "clamp",
            });

            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0.2, 0.5, 1, 0.5, 0.2],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                style={{
                  height: itemHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [{ scale }],
                  opacity,
                }}
              >
                <Text className={textClassName}>{item}</Text>
              </Animated.View>
            );
          }}
        />
        <View
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20"
          pointerEvents="none"
        >
          <View className="w-full h-[1.4px] bg-neutral-800 dark:bg-white/35" />
          <View style={{ height: itemHeight }} />
          <View className="w-full h-[1.4px] bg-neutral-800 dark:bg-white/35" />
        </View>
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ['rgba(17, 24, 39, 0.9)', 'transparent']
              : ['rgba(255,255,255,0.9)', 'transparent']
          }
          className="absolute top-0 left-0 right-0 z-10"
          style={{ height: 25 }}
          pointerEvents="none"
        />

        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ['transparent', 'rgba(17, 24, 39, 0.9)']
              : ['transparent', 'rgba(255,255,255,0.9)']
          }
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ height: 25 }}
          pointerEvents="none"
        />
      </View>
    </View>
  );
};

export default WheelSpinner;
