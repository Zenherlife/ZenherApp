import { useUserDataStore } from '@/modules/auth/store/useUserDataStore'
import React from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

const BMI = ({ onPress }) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'
	const { weight, height } = useUserDataStore()
	const userWeight = weight
	const userHeight = height

	const hasValidData = userWeight > 0 && userHeight > 0

	const bmiValue = hasValidData ? userWeight / ((userHeight / 100) ** 2) : 0
	const bmi = bmiValue.toFixed(1)

	const getBMICategory = (bmi) => {
		if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' }
		if (bmi < 25) return { category: 'Normal', color: '#10b981' }
		if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' }
		return { category: 'Obese', color: '#ef4444' }
	}

	const { category, color } = getBMICategory(parseFloat(bmi))

	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex-1 aspect-[0.95] bg-white dark:bg-gray-800 rounded-[1.9rem] items-center relative overflow-hidden"
		>
			<Text className="text-[#888] dark:text-[#bbb] text-base mt-4 font-medium">
				Body Mass Index
			</Text>

			<View className="flex-1 items-center justify-center px-4">
				{hasValidData ? (
					<>
						<View className="items-center mb-3">
							<Text className="text-[#333] dark:text-[#eee] text-5xl font-bold text-center">
								{bmi}
							</Text>
							<Text className="text-[#666] dark:text-[#aaa] text-sm font-medium mt-1">
								kg/m²
							</Text>
						</View>

						<View className="items-center mb-3">
							<View
								className="px-3 py-1.5 rounded-full"
								style={{ backgroundColor: `${color}20` }}
							>
								<Text
									className="text-sm font-semibold"
									style={{ color: color }}
								>
									{category}
								</Text>
							</View>
						</View>
					</>
				) : (
					<View className="items-center justify-center">
						<View className="items-center mb-4">
							<Text className="text-[#bbb] dark:text-[#666] text-4xl font-bold text-center">
								--
							</Text>
							<Text className="text-[#999] dark:text-[#777] text-sm font-medium mt-1">
								kg/m²
							</Text>
						</View>
						
						<View className="items-center px-4">
							<Text className="text-[#999] dark:text-[#777] text-sm text-center leading-5">
								{!userWeight && !userHeight 
									? "Add your weight and height to calculate BMI"
									: !userWeight 
									? "Add your weight to calculate BMI"
									: "Add your height to calculate BMI"
								}
							</Text>
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}

export default BMI