import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen() {
  const navigation = useNavigation();
  const {user, logout} = useAuthStore(state => state)
const signOut = async () => {
  try {
    logout();

    const userInfo = await GoogleSignin.getCurrentUser();
  const isGoogleSignedIn = userInfo != null;

    if (isGoogleSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }

    // Always sign out from Firebase auth (handles email/pass or Google)
    await auth().signOut();

    // Reset navigation stack to 'index' screen
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
    <View className="flex-1 bg-black px-4 pt-10">
      {/* Header */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-6 w-8 h-8 justify-center items-center"
        android_ripple={{ color: '#444' }}
      >
        <Text className="text-white text-2xl">{'←'}</Text>
      </Pressable>

      <Text className="text-white text-xl font-semibold mb-8">Account</Text>

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
        className="bg-gray-800 rounded-lg px-4 py-3 mb-2"
        activeOpacity={0.7}
        onPress={() => console.log('Go to edit email')}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 text-base">Email</Text>
          <Text className="text-gray-400 text-base">{user?.email || ''} {'>'}</Text>
        </View>
      </TouchableOpacity>


      {/* Sign out button */}
      <TouchableOpacity
        className="bg-blue-700 rounded-full py-3"
        activeOpacity={0.8}
        onPress={signOut}
      >
        <Text className="text-center text-blue-300 font-semibold text-lg">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
