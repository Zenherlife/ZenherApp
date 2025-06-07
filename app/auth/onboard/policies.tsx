import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ConsentScreen() {
  const [checks, setChecks] = useState([false, false, false, false]);
  const router = useRouter();

  const toggleCheck = (index: number) => {
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
  };

  return (
    <View className="flex-1 bg-black px-6 pt-10">
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} className="absolute top-10 left-6 z-10">
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View className="items-center mt-16 mb-8">
            <Image
              source={require('../../../assets/images/project/logo.png')} 
              className="w-16 h-16"
              resizeMode="contain"
            />
        </View>

        {/* Title */}
        <Text className="text-white text-2xl font-bold text-center mb-3">You and Zenher</Text>

        {/* Description */}
        <Text className="text-gray-300 text-center mb-8">
          We promise to keep your data safe, secure and private. Please take a moment to get to know our policies.
        </Text>

        {/* Checkbox Items */}
        {[
          "I agree to Zenher's Terms of Service.",
          "I have read Zenher's Privacy Policy.",
          "I agree to Zenher processing the health data I choose to share with the app, so they can provide their service.",
          "I showed the above policies to my parent/guardian, and they agreed I could use Zenher and that Zenher could process my health data.",
        ].map((text, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleCheck(index)}
            className="flex-row items-start space-x-3 mb-6 gap-4"
          >
            <View
              className={`w-6 h-6 rounded-md border-2 ${
                checks[index] ? 'bg-cyan-400 border-cyan-400' : 'border-white/60'
              } items-center justify-center`}
            >
              {checks[index] && <MaterialCommunityIcons name="check" color="black" size={18} />}
            </View>
            <Text className="text-white flex-1">{text}</Text>
          </TouchableOpacity>
        ))}

        {/* Next Button */}
        <TouchableOpacity
         disabled={checks.some(item => item === false)}
          className="bg-cyan-400 rounded-full py-4 mt-6 mb-10"
          onPress={() => router.push('./signup')}
        >
          <Text className="text-center text-black font-semibold text-base">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
