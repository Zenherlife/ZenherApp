import { useEmailSignIn } from '@/modules/auth/hooks/useEmailSignIn';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailLoginScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const { signIn, loading, error } = useEmailSignIn();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in both email and password.');
      return;
    }

    try {
      await signIn(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    } catch (e: any) {
      alert(e.message || 'Login failed');
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 px-6">
      {/* Back Button */}
      <TouchableOpacity className="mt-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
      </TouchableOpacity>

      {/* Logo */}
      <View className="items-center mt-10 mb-6 px-6">
        <Image
          source={require('@/assets/images/project/logo.png')}
          className="w-20 h-20"
          resizeMode="contain"
        />
      </View>

      {/* Headings */}
      <Text className="text-black dark:text-white text-2xl font-bold text-center mb-2">Sign in with email</Text>
      <Text className="text-gray-600 dark:text-gray-400 text-base text-center mb-12">
        Enter your details to continue. If you've forgotten, we'll help you out.
      </Text>

      {/* Error Message */}
      {error ? (
        <Text className="text-red-400 text-center mb-3 font-semibold">{error}</Text>
      ) : null}

      {/* Email Input */}
      <TextInput
      onChangeText={(value) => setEmail(value)}
        placeholder="Email"
        placeholderTextColor={isDark ? "#888" : "#555"}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete='email'
        className="bg-[#cdced2] dark:bg-[#080e20] text-black dark:text-white border border-gray-400 dark:border-white/10 rounded-xl px-4 py-4 mb-4 text-base"
      />

      {/* Password Input */}
      <View className="relative mb-2 justify-center">
        <TextInput
        onChangeText={(value) => setPassword(value)}
          placeholder="Password"
          placeholderTextColor={isDark ? "#888" : "#555"}
          secureTextEntry={secure}
          className="bg-[#cdced2] dark:bg-[#080e20] text-black dark:text-white border border-gray-400 dark:border-white/10 rounded-xl px-4 py-4 pr-12 text-base"
        />
        <TouchableOpacity
          className="absolute right-4 top-3.5"
          onPress={() => setSecure(!secure)}
        >
          <Ionicons
            name={secure ? 'eye-off' : 'eye'}
            size={20}
            color={isDark ? '#aaa' : '#888' }
          />
        </TouchableOpacity>
      </View>


      {/* Forgot Password Placeholder */}
      <TouchableOpacity className="mt-2 mb-12">
        <Text className="tex-black dark:text-white text-center font-semibold">I forgot my password</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        className={`bg-indigo-800 dark:bg-white py-3 mx-2 rounded-full ${loading ? 'opacity-60' : ''}`}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-center text-lg font-semibold text-white dark:text-black">Continue</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
