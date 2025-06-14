import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import WheelSpinner from '@/modules/home/components/WheelSpinner';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CycleLengthSelector = () => {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: 'add' | 'edit' }>();
  const isEdit = mode === 'edit';
  const {averageCycle, setField, uid} = useUserDataStore((state) => state);
  const [selectedCycle, setSelectedCycle] = useState(averageCycle || 28);

  useEffect(() => {
    if (averageCycle) {
      setSelectedCycle(averageCycle);
    }
  }, [averageCycle]);

	const handleSubmit = async () => {
		if (isEdit) {
			await firestore()
				.collection('users')
				.doc(uid)
				.update({
					averageCycle: selectedCycle,
				});
			router.back();
		} else {
			setField('averageCycle', selectedCycle);
			router.push('./Reminder');
		}
	};


  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-6">
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View className="items-center pt-12">
        <View className="items-center justify-center mb-6">
          <View className="bg-blue-500 rounded-full w-20 h-20 items-center justify-center">
            <Ionicons name="calendar" size={30} color="white" />
          </View>
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-3">
          {isEdit ? 'Update Your Average Cycle' : 'How long is your average cycle?'}
        </Text>

        <Text className="text-gray-400 text-base text-center px-8">
          {isEdit
            ? 'Change your cycle length anytime. Cycles usually last 24–38 days.'
            : 'A little hint – cycles usually last 24–38 days'}
        </Text>
      </View>

      <WheelSpinner
        data={Array.from({ length: 15 }, (_, i) => `${i + 24} Days`)}
        visibleCount={5}
        initialIndex={selectedCycle - 24}
        onValueChange={(value, index) => setSelectedCycle(index + 24)}
      />

      <View className="flex-row justify-between px-2 gap-4 mb-20 mt-8">
        {isEdit ? (
          <>
            <TouchableOpacity
              className="flex-1 h-14 bg-white/20 rounded-full items-center justify-center"
              onPress={() => router.back()}
            >
              <Text className="text-white font-semibold text-lg">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-14 bg-white rounded-full items-center justify-center"
              onPress={handleSubmit}
            >
              <Text className="text-black font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              className="flex-1 h-14 bg-white/30 rounded-full items-center justify-center"
              onPress={() => router.push('./Reminder')}
            >
              <Text className="text-white font-semibold text-lg">Not sure</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-14 bg-white rounded-full items-center justify-center"
              onPress={handleSubmit}
            >
              <Text className="text-black font-semibold text-lg">Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CycleLengthSelector;
