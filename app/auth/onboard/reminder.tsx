import { useSignUp } from '@/modules/auth/hooks/useSignUp';
import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PeriodReminderScreen() {
  const [schedule, setSchedule] = useState('1 day before');
  const [time, setTime] = useState(new Date());
  const [messageHeading, setMessageHeading] = useState('Zenher');
  const [messageBody, setMessageBody] = useState('Your new cycle will start soon');
  const setField = useUserDataStore((state) => state.setField);
  const [modalType, setModalType] = useState<'schedule' | 'message' | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { signup, loading, error } = useSignUp();
  const router = useRouter()

    const handleTurnOn = async () => {
    setField('reminder', {
      time: formattedTime,
      schedule,
      title: messageHeading,
      body: messageBody,
    });

    try {
      await signup();
    } catch (e) {
      console.log('Signup error:', e);
    }
  };

  const handleScheduleSelect = (val: string) => {
    setSchedule(val);
    setModalType(null);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) setTime(selectedDate);
  };

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-6">
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text className="text-white text-3xl font-bold text-center mt-10">
        Would you like to get{'\n'}a period reminder?
      </Text>
      <Text className="text-gray-400 text-base text-center mt-4">
        Use this reminder to feel prepared{'\n'}before your next period starts.
      </Text>

      {/* Main Box */}
      <View className="bg-gray-800 rounded-2xl mt-10 gap-y-1 p-5">
        {/* Schedule */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-4 mb-2">
          <View>
            <Text className="text-white font-medium">Schedule</Text>
            <Text className="text-gray-300 text-sm mt-1">{schedule}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalType('schedule')}>
            <Pencil size={18} color="#b7d4ff" />
          </TouchableOpacity>
        </View>

        {/* Time */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-4 mb-2">
          <View>
            <Text className="text-white font-medium">Time</Text>
            <Text className="text-gray-300 text-sm mt-1">{formattedTime}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Pencil size={18} color="#b7d4ff" />
          </TouchableOpacity>
        </View>

        {/* Message */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white font-medium">Message</Text>
            <Text className="text-gray-300 text-sm mt-1" numberOfLines={1}>
              {messageBody}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalType('message')}>
            <Pencil size={18} color="#b7d4ff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Preview */}
      <View className="bg-gray-800 mt-6 border-2 border-white/15 rounded-2xl px-4 py-4 flex-row space-x-2 items-center gap-4">
        <Ionicons name='water' color='#ff4444' size={24} />
        <View>
          <Text className="text-white font-bold">
            {messageHeading} <Text className="text-gray-400 font-normal">· Now</Text>
          </Text>
          <Text className="text-white mt-1">{messageBody}</Text>
        </View>
      </View>

      <View className="flex-1 mt-10 ">
        <TouchableOpacity
             disabled={loading}
             onPress={handleTurnOn}
        >
          <Text className="text-white font-semibold text-base text-center mb-8">Maybe later</Text>
        </TouchableOpacity>

        <TouchableOpacity
            disabled={loading}
            className="bg-white w-auto rounded-full py-3 mx-2"
            onPress={handleTurnOn}
        > 
          {loading ? (<ActivityIndicator size={24} color='black' />) : (
            <Text className="text-center text-black font-semibold text-lg">Yes, turn on</Text>
          )}
        </TouchableOpacity>
        {error && (
          <Text className="text-red-400 text-center mt-2">
              {error.replace(/^\[[^\]]*\]\s*/, '')}
          </Text>
        )}
      </View>

      {/* SCHEDULE MODAL */}
      <Modal visible={modalType === 'schedule'} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-gray-900 px-6 pt-6 pb-10 rounded-t-3xl max-h-[75%]">
            <Text className="text-white text-xl font-semibold mb-6 text-center">Choose Reminder Schedule</Text>

            <FlatList
              data={Array.from({ length: 10 }, (_, i) => `${i + 1} day${i === 0 ? '' : 's'} before`)}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleScheduleSelect(item)}
                  className="py-4 px-4 rounded-xl bg-white/5 mb-2"
                >
                  <Text className="text-white text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalType(null)}
              className="mt-6 bg-gray-700 py-3 rounded-full"
            >
              <Text className="text-white text-center font-medium text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MESSAGE MODAL */}
      <Modal visible={modalType === 'message'} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-gray-900 px-6 pt-6 pb-10 rounded-t-3xl">
            <Text className="text-white text-xl font-semibold mb-6 text-center">Customize Notification</Text>

            <TextInput
              value={messageHeading}
              onChangeText={setMessageHeading}
              placeholder="Enter heading (e.g., Zenher)"
              placeholderTextColor="#888"
              className="bg-white/5 text-white p-4 rounded-xl mb-4"
              maxLength={40}
            />

            <TextInput
              value={messageBody}
              onChangeText={setMessageBody}
              placeholder="Enter message (e.g., Your cycle starts soon)"
              placeholderTextColor="#888"
              className="bg-white/5 text-white p-4 rounded-xl"
              maxLength={100}
              multiline
            />

            <TouchableOpacity
              onPress={() => setModalType(null)}
              className="mt-6 bg-white py-3 rounded-full"
            >
              <Text className="text-black text-center font-semibold text-base">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalType(null)}
              className="mt-4"
            >
              <Text className="text-gray-400 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TIME PICKER */}
      {showTimePicker && (
        <DateTimePicker
          design='default'
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}