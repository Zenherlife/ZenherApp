import NotificationIcon from "@/assets/images/project/notificationIcon";
import { useUserDataStore } from "@/modules/auth/store/useUserDataStore";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("../assets/images/project/logo.png");

export default function LayoutHeader({ right }: { right?: React.ReactNode }) {
  const user = useUserDataStore((state) => state);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView
      edges={["top"]}
      className="left-0 right-0 z-10 bg-white dark:bg-gray-900 flex-row items-center justify-between px-6 shadow-md pt-2 pb-4"
      style={{ elevation: 2 }}
    >
      <View className="flex-row items-center">
        <Image source={logo} className="h-8 w-8" resizeMode="contain" />
        <Text className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight ml-2">
          Zenher
        </Text>
      </View>

      {right ? (
        right
      ) : (
        <View className="flex-row items-center">
          <Pressable className="rounded-full mr-4">
            <NotificationIcon width={24} height={24} color={isDark? "#b3b6bd" : "#64748b"} />
          </Pressable>

          <Pressable
            className="w-10 h-10 rounded-full bg-indigo-500 items-center justify-center shadow-lg overflow-hidden"
            onPress={() => router.push("/setting/connect")}
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-white text-2xl font-semibold">
                {(user?.displayName || " ")[0].toUpperCase()}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
