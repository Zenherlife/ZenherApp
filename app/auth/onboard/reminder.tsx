import { useSignUp } from '@/modules/auth/hooks/useSignUp';
import { useOnboardingStore } from '@/modules/auth/store/onboardingStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Pencil } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PeriodReminderScreen() {
  const [schedule, setSchedule] = useState('1 day before');
  const [time, setTime] = useState(new Date());
  const [messageHeading, setMessageHeading] = useState('Zenher');
  const [messageBody, setMessageBody] = useState('Your new cycle will start soon');
  const setField = useOnboardingStore((state) => state.setField);
  const [modalType, setModalType] = useState<'schedule' | 'message' | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { signup, loading, error } = useSignUp();

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
    <View className="flex-1 bg-black px-6 pt-12">
      {/* Back */}
      <TouchableOpacity className="absolute top-10 left-6 z-10">
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      <Text className="text-white text-3xl font-bold text-center mt-10">
        Would you like to get{'\n'}a period reminder?
      </Text>
      <Text className="text-gray-400 text-center mt-4">
        Use this reminder to feel prepared{'\n'}before your next period starts.
      </Text>

      {/* Main Box */}
      <View className="bg-neutral-900 rounded-2xl mt-10 space-y-6 px-4 py-5">
        {/* Schedule */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-4 mb-2">
          <View>
            <Text className="text-white font-medium">Schedule</Text>
            <Text className="text-gray-300 text-sm mt-1">{schedule}</Text>
          </View>
          <TouchableOpacity onPress={() => setModalType('schedule')}>
            <Pencil size={18} color="#00BFFF" />
          </TouchableOpacity>
        </View>

        {/* Time */}
        <View className="flex-row justify-between items-center border-b border-white/10 pb-4 mb-2">
          <View>
            <Text className="text-white font-medium">Time</Text>
            <Text className="text-gray-300 text-sm mt-1">{formattedTime}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Pencil size={18} color="#00BFFF" />
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
            <Pencil size={18} color="#00BFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Preview */}
      <View className="bg-neutral-800 mt-6 rounded-2xl px-4 py-4 flex-row space-x-2 items-center gap-4">
        <Text className="text-red-500 text-xl">🩸</Text>
        <View>
          <Text className="text-white font-bold">
            {messageHeading} <Text className="text-gray-400 font-normal">· Now</Text>
          </Text>
          <Text className="text-white mt-1">{messageBody}</Text>
        </View>
      </View>

      {/* Footer Buttons */}
      <View className="mt-10 items-center">
        <TouchableOpacity
             disabled={loading}
             onPress={handleTurnOn}
        >
          <Text className="text-cyan-400 font-semibold text-sm mb-8">{loading ? 'Loading...' : 'Maybe later'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
            disabled={loading}
            className="bg-cyan-400 w-full rounded-full py-4"
            onPress={handleTurnOn}
        >
            <Text className="text-center text-black font-semibold text-base">
                {loading ? 'Loading...' : 'Yes, turn on'}
            </Text>
        </TouchableOpacity>
        {error && (
            <Text className="text-red-500 text-center mt-2">
                {error.replace(/^\[[^\]]*\]\s*/, '')}
            </Text>
        )}
      </View>

      {/* SCHEDULE MODAL */}
      <Modal visible={modalType === 'schedule'} transparent animationType="slide">
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-neutral-900 p-6 rounded-xl w-full">
            <Text className="text-white text-xl font-semibold mb-4">Reminder Schedule</Text>
            <FlatList
              data={Array.from({ length: 10 }, (_, i) => `${i + 1} day${i === 0 ? '' : 's'} before`)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleScheduleSelect(item)}
                  className="py-3 border-b border-white/10"
                >
                  <Text className="text-white">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalType(null)} className="mt-4">
              <Text className="text-cyan-400 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MESSAGE MODAL */}
      <Modal visible={modalType === 'message'} transparent animationType="slide">
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-neutral-900 p-6 rounded-xl w-full">
            <Text className="text-white text-xl font-semibold mb-4">Edit Notification</Text>

            <TextInput
              value={messageHeading}
              onChangeText={setMessageHeading}
              placeholder="Heading"
              placeholderTextColor="#aaa"
              className="bg-black text-white p-3 rounded mb-3 border border-white/10"
            />
            <TextInput
              value={messageBody}
              onChangeText={setMessageBody}
              placeholder="Message"
              placeholderTextColor="#aaa"
              className="bg-black text-white p-3 rounded border border-white/10"
            />

            <TouchableOpacity onPress={() => setModalType(null)} className="mt-4">
              <Text className="text-cyan-400 text-center">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TIME PICKER */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}
