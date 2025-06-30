import { useDoctorDataStore } from '@/modules/consult/store/useDoctorDataStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View, useColorScheme } from 'react-native';

export default function ConsultScreen() {
  const doctors = useDoctorDataStore((state) => state.doctors);
  const listenToDoctors = useDoctorDataStore((state) => state.listenToDoctors);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  useEffect(() => {
    const unsubscribe = listenToDoctors();
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 pt-2 pb-4">
        <Text className="text-3xl font-bold text-black dark:text-white">Find a Doctor</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        className="px-4"
      >
        {doctors.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 dark:text-gray-500 text-base">
              No doctors found
            </Text>
          </View>
        )}

        {doctors.map((doctor) => (
          <View key={doctor.id} className="bg-gray-200 dark:bg-[#1c1c3a] rounded-xl p-4 mb-5">
            <View className="flex-row items-start">
              <Image
                source={
                  typeof doctor.avatar === "string"
                    ? { uri: doctor.avatar }
                    : require("../../assets/images/project/logo.png")
                }
                className="h-14 w-14 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-black dark:text-white font-semibold text-lg">
                  {doctor.name}
                </Text>
                <Text className="text-sm text-blue-600 dark:text-[#6c8bff] mt-1">
                  {doctor.specialty}
                </Text>

                <View className="flex-row items-center mt-2">
                  <Ionicons name="star" size={14} color={isDark ? "#facc15" : "#e1b712"} />
                  <Text className="text-sm text-black dark:text-white ml-1">
                    {doctor.rating}
                  </Text>
                  <Text className="text-sm text-gray-900 dark:text-gray-400 ml-1">
                    ({doctor.reviews})
                  </Text>
                </View>

                <View className="mt-2">
                  <Text className="text-sm text-gray-800 dark:text-gray-300">
                    Experience: {doctor.experience}
                  </Text>
                  <Text className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">
                    Education: {doctor.education}
                  </Text>
                  <Text className="text-sm text-gray-800 dark:text-gray-300 mt-0.5">
                    Languages: {doctor.languages.join(", ")}
                  </Text>
                </View>

                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={14} color={isDark ? "#6c8bff" : "#0237fa" } />
                  <Text className="text-sm text-gray-800 dark:text-gray-300 ml-1.5">
                    {doctor.availability}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row mt-5 space-x-3">
              <Pressable className="flex-1 rounded-xl bg-white  py-3 items-center justify-center mr-1">
                <Text className="text-black  font-medium">
                  Book Consultation
                </Text>
              </Pressable>
              <Pressable className="flex-1 rounded-xl bg-indigo-800 dark:bg-blue-500 py-3 items-center justify-center ml-1"
                onPress={() => router.push({pathname: '/consult/viewdoctorprofile' , params: {id: doctor.id}})}
              // onPress={() => router.push({ pathname: '/consult/viewdoctorprofile', params: {id: doctor.id}})}
              >
                <Text className="text-white font-medium">
                  View Profile
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}