import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Gynecologist',
    experience: '15 years',
    rating: 4.8,
    reviews: 245,
    availability: 'Mon-Fri, 9AM-5PM',
    avatar: 'SJ',
    languages: ['English', 'Spanish'],
    education: 'MD, Harvard Medical School',
  },
  {
    id: 2,
    name: 'Dr. Priya Mehra',
    specialty: 'Nutritionist',
    experience: '10 years',
    rating: 4.9,
    reviews: 189,
    availability: 'Mon-Sat, 10AM-6PM',
    avatar: 'PM',
    languages: ['English', 'Hindi'],
    education: 'PhD, Stanford University',
  },
];

export default function ConsultScreen() {
  return (
    <View className="flex-1 mt-12 bg-white dark:bg-gray-900">
      <View className="px-6 pt-12 pb-4">
        <Text className="text-2xl font-semibold text-gray-900 dark:text-white">Find a Doctor</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse and book consultations with expert doctors</Text>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 32 }} 
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {doctors.map((doctor) => (
          <View 
            key={doctor.id} 
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mb-4"
          >
            <View className="flex-row items-start">
              {/* Avatar */}
              <View className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center mr-4">
                <Text className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{doctor.avatar}</Text>
              </View>
              
              {/* Info */}
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white text-lg">{doctor.name}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{doctor.specialty}</Text>
                
                <View className="flex-row items-center mt-2">
                  <Ionicons name="star" size={16} color="#6366f1" />
                  <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1">{doctor.rating}</Text>
                  <Text className="text-sm text-gray-400 dark:text-gray-500 ml-1">({doctor.reviews} reviews)</Text>
                </View>

                <View className="mt-2">
                  <Text className="text-sm text-gray-600 dark:text-gray-300">Experience: {doctor.experience}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">Education: {doctor.education}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">Languages: {doctor.languages.join(', ')}</Text>
                </View>

                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={16} color="#6366f1" />
                  <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1.5">{doctor.availability}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row mt-4 space-x-3">
              <Pressable 
                className="flex-1 rounded-lg bg-indigo-600 py-2.5 items-center justify-center"
                android_ripple={{ color: '#4f46e5' }}
              >
                <Text className="text-white font-medium">Book Consultation</Text>
              </Pressable>
              <Pressable 
                className="flex-1 rounded-lg bg-white dark:bg-gray-700 py-2.5 items-center justify-center border border-gray-200 dark:border-gray-600"
              >
                <Text className="text-gray-700 dark:text-gray-200 font-medium">View Profile</Text>
              </Pressable>
            </View>
          </View>
        ))}
        
        {doctors.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 dark:text-gray-500 text-base">No doctors found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 