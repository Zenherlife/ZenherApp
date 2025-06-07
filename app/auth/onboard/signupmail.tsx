import { useOnboardingStore } from '@/modules/auth/store/onboardingStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAccountScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setField = useOnboardingStore((state) => state.setField);
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isFormValid = name.trim() && email.trim() && password.trim().length >= 10;

  const handleCreateAccount = () => {
    if (isFormValid) {
      setField('name', name);
      setField('email', email);
      setField('password', password);
      router.push('./last_period');
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Feather name="arrow-left" size={28} color="#22d3ee" />
        </TouchableOpacity>

        <View className="items-center mb-12">
          <View className="bg-[#ffe1ec] rounded-full p-4 mb-4">
            <Image source={require('../../../assets/images/project/logo.png')} className="h-12 w-12" resizeMode="contain" />
          </View>

          <Text className="text-white text-3xl font-bold mb-4">Create your account</Text>
          <Text className="text-gray-400 text-center text-base px-4">
            Enter your details and pick a password that's at least 10 characters.
          </Text>
        </View>

        <View className="flex-1 mb-8">
          {/* Name Input */}
          <View className="mb-8">
            <Text className="text-gray-400 text-base mb-2">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              className="text-white text-lg border-b border-gray-600 pb-2"
              style={{ fontSize: 18 }}
            />
          </View>

          {/* Email Input */}
          <View className="mb-8">
            <Text className="text-gray-400 text-base mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="text-white text-lg border-b border-gray-600 pb-2"
              style={{ fontSize: 18 }}
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-400 text-base mb-2">Password</Text>
            <View className="flex-row items-center border-b border-gray-600">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!isPasswordVisible}
                className="flex-1 text-white text-lg pb-2"
                style={{ fontSize: 18 }}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={22}
                  color="#9ca3af"
                  style={{ marginBottom: 6, marginRight: 6 }}
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
        <View className="pb-8">
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={handleCreateAccount}
            className={`py-4 rounded-full ${isFormValid ? 'bg-cyan-400' : 'bg-gray-700'}`}
          >
            <Text className={`text-center text-lg font-semibold ${isFormValid ? 'text-black' : 'text-gray-400'}`}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
