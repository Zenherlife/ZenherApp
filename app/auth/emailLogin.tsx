import { useEmailSignIn } from '@/modules/auth/hooks/useEmailSignIn';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EmailLoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const { signIn, loading, error } = useEmailSignIn();

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
    <View className="flex-1 bg-black px-6 pt-20">
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-cyan-400 text-2xl">←</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View className="items-center mt-6 mb-4">
        <Image
          source={{
            uri: 'https://res.cloudinary.com/denlloigs/image/upload/v1742224838/zenher-logo_lgfkwg.png',
          }}
          className="w-20 h-20"
        />
      </View>

      {/* Headings */}
      <Text className="text-white text-xl font-bold text-center">Sign in with email</Text>
      <Text className="text-gray-400 text-center mt-1 mb-6">
        Enter your details to continue. If you've forgotten, we'll help you out.
      </Text>

      {/* Error Message */}
      {error ? (
        <Text className="text-red-400 text-center mb-3 font-semibold">{error}</Text>
      ) : null}

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-neutral-900 text-white rounded-md p-4 mb-4"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View className="relative">
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={secure}
          className="bg-neutral-900 text-white rounded-md p-4 pr-12"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          className="absolute right-4 top-4"
          onPress={() => setSecure(!secure)}
        >
          <Text className="text-white">{secure ? '👁️‍🗨️' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password Placeholder */}
      <TouchableOpacity className="mt-4 mb-8">
        <Text className="text-cyan-400 text-center font-semibold">I forgot my password</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        className={`bg-cyan-400 py-4 rounded-full ${loading ? 'opacity-60' : ''}`}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-center font-semibold text-black">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
