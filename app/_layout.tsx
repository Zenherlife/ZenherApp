import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: 'ios_from_right',
        headerShown: false,
      }}
    />
  );
}