import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';

GoogleSignin.configure({
  webClientId: '646539268053-8fp7icsebfmut1k3elqt4ll38754oiko.apps.googleusercontent.com',
});

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: 'simple_push',
        headerShown: false,
      }}
    />
  );
}