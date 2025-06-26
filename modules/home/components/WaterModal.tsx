import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { X } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
  visible: boolean;
  onClose: () => void;
  goal: number;
  setGoal: (goal: number) => void;
  intake: number;
}

const WaterModal: React.FC<Props> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const scrollRef = useRef<ScrollView>(null);

  const { uid, water, setWaterField, setUser } = useUserDataStore();

  const progress = Math.min(water.intake / water.goal, 1);
  const history = Object.values(water.history || {});
  const totalBars = history.length;
  const visibleBars = 6;
  const barMaxHeight = 80;

  const getPastNDays = (n: number) => {
    const result: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isToday = i === 0;
      result.push(isToday ? 'Today' : `${d.getDate()}/${d.getMonth() + 1}`);
    }
    return result;
  };

  const barLabels = getPastNDays(totalBars);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [visible]);

  const handleSave = async () => {
    const today = new Date().toDateString();
    setWaterField('history', {
      ...water.history,
      [today]: water.intake,
    });

    await setUser({ uid, water });
    onClose();
  };

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <View className="absolute inset-0 bg-black/30" />
        <View
          className={`rounded-t-3xl px-6 pt-8 pb-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          style={{ maxHeight: screenHeight * 0.9 }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Water Details</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Goal Input */}
            <Text className={`mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Daily Goal (ml)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(water.goal)}
              onChangeText={(text) => setWaterField('goal', Number(text))}
              className="mb-4 px-4 py-2 rounded-xl text-lg font-bold bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />

            {/* Cup Size Input */}
            <Text className={`mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Cup Size (ml)</Text>
            <TextInput
              keyboardType="numeric"
              value={String(water.cupSize)}
              onChangeText={(value) => setWaterField('cupSize', Number(value))}
              placeholder="250"
              className="mb-4 px-4 py-2 rounded-xl text-lg font-bold bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />

            {/* Custom Amount */}
            <Text className={`mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Custom Amount (ml)</Text>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={String(water.customAmount)}
              onChangeText={(value) => setWaterField('customAmount', Number(value))}
              className="mb-6 px-4 py-2 rounded-xl text-lg font-bold bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />

            {/* Bottle */}
            <View className="items-center mb-6">
              <View className="w-16 h-40 border-2 border-blue-400 rounded-full overflow-hidden bg-white dark:bg-gray-800">
                <View style={{ height: `${progress * 100}%` }} className="absolute bottom-0 w-full bg-blue-400" />
              </View>
              <Text className={`mt-3 font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Math.floor(progress * 100)}% of goal reached
              </Text>
              {progress === 1 && (
                <Text className="mt-2 text-center text-green-400 font-medium italic">Goal reached! 💧 Stay refreshed!</Text>
              )}
            </View>

            {/* Last 14 Days */}
            <View className="mb-6" style={{ height: 190 }}>
              <Text className={`mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Last 14 Days</Text>
              <ScrollView
                horizontal
                ref={scrollRef}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ width: screenWidth * (totalBars / visibleBars) }}
                className="px-2 py-3 rounded-xl"
              >
                <View className="flex-row justify-between items-end pb-2 w-full h-full">
                  {history.map((val, idx) => {
                    const percentOfGoal = Math.min(val / water.goal, 1);
                    const heightPx = percentOfGoal * barMaxHeight;
                    return (
                      <View key={idx} style={{ width: screenWidth / visibleBars }} className="items-center">
                        <View
                          className="w-6 bg-blue-400 rounded-md"
                          style={{ height: heightPx, maxHeight: barMaxHeight, minHeight: 1 }}
                        />
                        <Text className={`mt-1 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {barLabels[idx]}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {(val / 1000).toFixed(1)}L
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 py-4 rounded-2xl items-center active:scale-95"
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-base">Save Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WaterModal;
