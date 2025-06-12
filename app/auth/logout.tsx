import { useUserDataStore } from '@/modules/auth/store/useUserDataStore';
import { Ionicons } from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const navigation = useNavigation();
  const user = useUserDataStore.getState().getUser();

  const signOut = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      const isGoogleSignedIn = userInfo != null;

      if (isGoogleSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      await auth().signOut();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'index' }],
        })
      );
    } catch (error) {
      console.error('SignOut error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 px-6">
      {/* Header */}
      <TouchableOpacity className="flex-row mt-4 gap-6" onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white text-xl font-semibold mb-8">Account</Text>
      </TouchableOpacity>

      {/* Name field */}
      <TouchableOpacity
        className="bg-gray-800 rounded-lg px-4 py-3 mb-4"
        activeOpacity={0.7}
        onPress={() => console.log('Go to edit name')}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 text-base">Name</Text>
          <Text className="text-gray-400 text-base">{user?.displayName || ''} {'>'}</Text>
        </View>
      </TouchableOpacity>

      {/* Email field */}
      <TouchableOpacity
        className="bg-gray-800 rounded-lg px-4 py-3 mb-6"
        activeOpacity={0.7}
        onPress={() => console.log('Go to edit email')}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 text-base">Email</Text>
          <Text className="text-gray-400 text-base">{user?.email || ''} {'>'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-full py-3"
        activeOpacity={0.85}
        onPress={signOut}
      >
        <Text className="text-center text-black font-semibold text-lg">Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
