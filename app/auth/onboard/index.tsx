import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Link2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Top header with back arrow */}
      <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-4 z-10">
        <ArrowLeft color="skyblue" size={26} />
      </TouchableOpacity>

      {/* Top graphics */}
      <View className="bg-green-800 pt-20 pb-10 items-center rounded-b-3xl">
        <View className="h-40">
         
        </View>
      </View>

      {/* Welcome Text */}
      <View className="px-6 pt-8">
        <Text className="text-white text-2xl font-bold text-center mb-2">Nice to meet you</Text>
        <Text className="text-gray-300 text-center mb-6">Choose your journey to get started</Text>

        {/* Options */}
        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl p-5 mb-4 flex-row justify-between items-center"
          onPress={() => router.push('./onboard/track')}
        >
          <View className="flex-row items-start gap-3">
            <Calendar color="skyblue" />
            <View>
              <Text className="text-sky-400 font-semibold text-base">Track my cycle</Text>
              <Text className="text-gray-400 text-sm">
                Track period, conception, pregnancy, or perimenopause experiences.
              </Text>
            </View>
          </View>
          <Text className="text-sky-400 text-xl">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl p-5 flex-row justify-between items-center"
          onPress={() => router.push('./onboard/connect')}
        >
          <View className="flex-row items-start gap-3">
            <Link2 color="skyblue" />
            <View>
              <Text className="text-sky-400 font-semibold text-base">Zenher Connect</Text>
              <Text className="text-gray-400 text-sm">
                See a partner or companion’s important cycle dates.
              </Text>
            </View>
          </View>
          <Text className="text-sky-400 text-xl">›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}