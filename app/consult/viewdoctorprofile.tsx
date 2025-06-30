import { useDoctorDataStore } from '@/modules/consult/store/useDoctorDataStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme
} from 'react-native';

export default function ViewDoctorProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const doctors = useDoctorDataStore((state) => state.doctors);
  const listenToDoctors = useDoctorDataStore((state) => state.listenToDoctors);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const unsubscribe = listenToDoctors();

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1200); // Wait briefly for Firebase data to load

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const doctor = doctors.find((d) => String(d.id) === String(id));

  if (loading || doctors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#a993ff" />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-black dark:text-white text-base">Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-6 pt-8 pb-12">
      {/* Back Button */}
      <Pressable onPress={router.back} className="mb-4">
        <Ionicons name="arrow-back" size={24} color={isDark ? "white" : "black"} />
      </Pressable>

      {/* Avatar and Info */}
      <View className="items-center mb-5">
        <Image
          source={
            typeof doctor.avatar === 'string'
              ? { uri: doctor.avatar }
              : require('../../assets/images/project/logo.png')
          }
          className="h-28 w-28 rounded-full mb-4"
        />
        <Text className="text-black dark:text-white text-2xl font-semibold">{doctor.name}</Text>
        <Text className="text-blue-600 dark:text-[#6c8bff] text-sm mt-1">{doctor.specialty}</Text>

        {/* Rating */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="star" size={16} color={isDark ? "#facc15" : "#e1b712"} />
          <Text className="text-yellow-500 dark:text-yellow-400 text-base font-semibold ml-1">{doctor.rating}</Text>
          <Text className="text-gray-900 dark:text-gray-400 ml-2">{doctor.reviews} • Reviews</Text>
        </View>

        <Text className="text-center text-gray-700 dark:text-gray-300 mt-3 px-4">
          {doctor.tagline || 'Dedicated to providing high-quality care.'}
        </Text>
      </View>

      {/* Sections */}
      <View className="space-y-4">
        <Section title="About Me" text={doctor.about || 'No description available.'} />
        <Section title="Experience" text={doctor.experience || 'Not provided'} />
        <Section title="Education & Certifications" text={doctor.education || 'Not provided'} />
        <Section title="Languages" text={doctor.languages?.join(', ') || 'Not specified'} />
        <Section title="Availability" text={doctor.availability || 'Not listed'} />
      </View>
    </ScrollView>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View className="bg-gray-200 dark:bg-[#1c1c3a] border border-white/10 rounded-xl p-4 mb-2">
      <Text className="text-black dark:text-white font-semibold text-base mb-1">{title}</Text>
      <Text className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">{text}</Text>
    </View>
  );
}
