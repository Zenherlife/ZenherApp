import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const AdjustHWScreen = () => {
  const [selectedHeight, setHeight] = useState(170);
  const [selectedWeight, setWeight] = useState(55);

  const router = useRouter();
  const {height, weight, uid } = useUserDataStore((state) => state);

  const colorScheme = useColorScheme();

	useEffect(() => {
		if (height && weight) {
			setHeight(height);
			setWeight(weight)
		}
	}, [height, weight]);

  const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 24.9) return 'Normal';
  if (bmi < 29.9) return 'Overweight';
  return 'Obese';
};

const getBMIColor = (bmi: number) => {
  if (bmi < 18.5) return '#f97316';
  if (bmi < 24.9) return '#22c55e';
  if (bmi < 29.9) return '#eab308';
  return '#ef4444';
};

const BMIIndicator = ({ bmi }: { bmi: number }) => {
  const category = getBMICategory(bmi);
  const color = getBMIColor(bmi);

  return (
    <View className="items-center mt-6">
      <Text className="text-black dark:text-white font-bold text-lg mb-2">Your BMI: {bmi.toFixed(1)}</Text>

      <View className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View
          style={{
            width: `${Math.min((bmi / 40) * 100, 100)}%`,
            backgroundColor: color,
          }}
          className="h-full rounded-full"
        />
      </View>

      <Text className="text-gray-600 dark:text-gray-300 text-sm mt-2">{category}</Text>
    </View>
  );
};


  const handleNext = async () => {
    await firestore()
				.collection('users')
				.doc(uid)
				.update({
					height: selectedHeight,
					weight: selectedWeight
				});
  };

  const renderCounter = (label: string, value: number, setValue: (v: number) => void, unit: string, min: number, max: number) => (
    <View className="items-center px-5 py-6 rounded-3xl bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 mx-6">
      <Text className="text-gray-600 dark:text-gray-300 text-sm mb-1">{label}</Text>
      <View className="flex-row items-center justify-between w-full">
        <Pressable
          className="p-3 bg-gray-300 dark:bg-gray-700 rounded-full"
          onPress={() => setValue(Math.max(min, value - 1))}
        >
          <Ionicons name="remove" size={22} color={colorScheme === 'dark' ? '#a1a1aa' : 'black'} />
        </Pressable>

        <View className="items-center mx-3">
          <Text className="text-black dark:text-white text-3xl font-bold">{value}</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-sm">{unit}</Text>
        </View>

        <Pressable
          className="p-3 bg-indigo-600 dark:bg-indigo-600/80 rounded-full"
          onPress={() => setValue(Math.min(max, value + 1))}
        >
          <Ionicons name="add" size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
	
	const bmi = weight / ((height / 100) ** 2);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 px-6">
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    	<BMIIndicator bmi={bmi} />
      <View className="items-center pt-10 pb-6">
        <Text className="text-black dark:text-white text-3xl font-extrabold text-center mb-1">
          Adjust Your Body Stats
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-base text-center">
          Tap to set your current height and weight
        </Text>
      </View>

      <View className="flex-1 gap-4">
        {renderCounter('Height', selectedHeight, setHeight, 'cm', 120, 230)}
        {renderCounter('Weight', selectedWeight, setWeight, 'kg', 30, 180)}
      </View>

      <View className="mt-auto mb-10 px-4">
        <TouchableOpacity
          className="h-14 bg-indigo-800 dark:bg-white rounded-full items-center justify-center"
          onPress={handleNext}
        >
          <Text className="text-white dark:text-black font-bold text-lg">Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdjustHWScreen;
