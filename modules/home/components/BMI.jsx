import { useUserDataStore } from '@/modules/auth/store/useUserDataStore'
import React from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

const BMI = ({onPress}) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'
	const { weight, height } = useUserDataStore()
	const userWeight = weight || 70
	const userHeight = height || 175
	
	const bmiValue = userWeight / ((userHeight / 100) ** 2)
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
			style={{
				shadowColor: isDark ? "transparent" : "rgba(0, 0, 0, 0.2)",
				shadowOffset: { width: 0, height: 8 },
				shadowOpacity: 0.3,
				shadowRadius: 16,
				elevation: 13,
			}}
		>
			<View 
				className="absolute top-0 left-0 right-0 h-1 opacity-20"
				style={{ backgroundColor: color }}
			/>
			
			<Text className="text-[#888] dark:text-[#bbb] text-base mt-4 font-medium">
				Body Mass Index
			</Text>
			
			<View className="flex-1 items-center justify-center px-4">
				<View className="items-center mb-3">
					<Text className="text-[#333] dark:text-[#eee] text-5xl font-bold text-center">
						{bmi}
					</Text>
					<Text className="text-[#666] dark:text-[#aaa] text-sm font-medium mt-1">
						kg/m²
					</Text>
				</View>
				
				<View className="items-center mb-4">
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
				
				<View className="w-full max-w-[200px] mb-2">
					<View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<View className="flex-row h-full">
							<View className="flex-1 bg-blue-500" />
							<View className="flex-[1.65] bg-green-500" />
							<View className="flex-1 bg-yellow-500" />
							<View className="flex-1 bg-red-500" />
						</View>
					</View>
				</View>
			</View>
			
			{(!weight || !height) && (
				<View className="absolute bottom-2 right-2">
					<View className="bg-yellow-500 w-2 h-2 rounded-full opacity-60" />
				</View>
			)}
		</TouchableOpacity>
	)
}

export default BMI