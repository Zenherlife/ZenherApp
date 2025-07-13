import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, Pressable, useColorScheme, View } from "react-native";
import Animated, {
	interpolate,
	runOnJS,
	useAnimatedStyle,
	useDerivedValue,
	withSpring
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FloatingContentProps = {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

const { height, width } = Dimensions.get("window");

export const FloatingContent: React.FC<FloatingContentProps> = ({
	visible,
	onClose,
	children
}) => {

	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'
	const insets = useSafeAreaInsets()
	const [shouldRender, setShouldRender] = useState(visible);
	const [animationStarted, setAnimationStarted] = useState(false);

	const progress = useDerivedValue(() => {
		if (visible && animationStarted) {
			return withSpring(1, {
				damping: 15,
				stiffness: 110,
				mass: 0.8,
				overshootClamping: false,
				restSpeedThreshold: 0.001,
				restDisplacementThreshold: 0.001
			});
		} else if (!visible) {
			return withSpring(0, {
				damping: 15,
				stiffness: 150,
				mass: 0.6
			}, (finished) => {
				if (finished) {
					runOnJS(setShouldRender)(false);
					runOnJS(setAnimationStarted)(false);
				}
			});
		}
		return 0;
	});

	const backdropAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
	}));

	const cardAnimatedStyle = useAnimatedStyle(() => {
		const topRadius = interpolate(progress.value, [0, 0.8, 1], [200, 180, 28]);

		return {
			opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0.8, 1]),
			borderTopLeftRadius: topRadius,
			borderTopRightRadius: topRadius,
			borderBottomLeftRadius: 28,
			borderBottomRightRadius: 28,
			height: interpolate(progress.value, [0, 1], [150, height - insets.top - 113]),
			width: interpolate(progress.value, [0, 1], [200, width - 16]),
			transform: [
				{ translateY: interpolate(progress.value, [0, 1], [height - insets.top, insets.top]) }
			]
		}
	});

	useEffect(() => {
		if (visible) {
			setShouldRender(true);
			requestAnimationFrame(() => {
				setAnimationStarted(true);
			});
		} else {
			setAnimationStarted(false);
		}
	}, [visible]);

	useEffect(() => {
		const onBackPress = () => {
			if (visible) {
				onClose();
				return true;
			}
			return false;
		};

		const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

		return () => subscription.remove();
	}, [visible, onClose]);

	if (!shouldRender) {
		return null;
	}

	return (
		<>
			<Animated.View
				className="absolute inset-0"
				style={[
					backdropAnimatedStyle,
					{
						backgroundColor: isDark ? "#a391a3" : "rgba(0,0,0,0.6)"
					}
				]}
				pointerEvents={visible ? "auto" : "none"}
			>
				<Pressable className="flex-1" onPress={onClose} />
			</Animated.View>

			<Animated.View
				className="absolute self-center items-center justify-center bg-white overflow-hidden"
				style={cardAnimatedStyle}
			>
				<View 
					className="w-full"
					style={{
						height: height - insets.top - 113,
						width: width - 16
					}}>
					{children}
				</View>
			</Animated.View>
		</>
	);
};