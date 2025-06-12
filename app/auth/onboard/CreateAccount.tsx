import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setField = useUserDataStore((state) => state.setField);
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isFormValid = name.trim() && email.trim() && password.trim().length >= 10;

  const handleCreateAccount = () => {
    if (isFormValid) {
      setField('displayName', name);
      setField('email', email);
      setField('password', password);
      router.push('./PeriodDate');
    }
  };

  return (
  <SafeAreaView className="flex-1 bg-gray-900 px-6">
  <TouchableOpacity className="mt-4 mb-12" onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="white" />
  </TouchableOpacity>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View className="items-center mb-12">
            <Image
              source={require('../../../assets/images/project/logo.png')} 
              className="w-16 h-16 mb-4"
              resizeMode="contain"
            />

          <Text className="text-white text-3xl font-bold mb-4">Create your account</Text>
          <Text className="text-gray-400 text-center text-base px-4">
            Enter your details and pick a password that's at least 10 characters.
          </Text>
        </View>

        <View className="flex-1 gap-y-7 mb-10">

          {/* Name Input */}
          <View>
            <Text className="text-gray-300 text-base mb-2">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Emily Taylor"
              placeholderTextColor="#6b7280"
              className="text-white text-base bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
            />
          </View>

          {/* Email Input */}
          <View>
            <Text className="text-gray-300 text-base mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-white text-base bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-300 text-base mb-2">Password</Text>
            <View className="flex-row items-center bg-gray-800 rounded-xl px-4 border border-gray-700">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 10 characters"
                placeholderTextColor="#6b7280"
                secureTextEntry={!isPasswordVisible}
                className="flex-1 text-white text-base py-3"
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={22}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {password.length > 0 && password.length < 10 && (
              <Text className="text-red-400 mt-2 text-sm">
                Password must be at least 10 characters
              </Text>
            )}
          </View>

        </View>
        {/* Create Account Button */}
        <View className="pb-10">
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={handleCreateAccount}
            className={`py-3 rounded-full ${isFormValid ? 'bg-white' : 'bg-gray-700'}`}
          >
            <Text className={`text-center text-lg font-semibold ${isFormValid ? 'text-black' : 'text-gray-400'}`}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</SafeAreaView>
  );
}
