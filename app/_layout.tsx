import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

GoogleSignin.configure({
  webClientId: '646539268053-8fp7icsebfmut1k3elqt4ll38754oiko.apps.googleusercontent.com',
});

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            animation: 'simple_push',
            headerShown: false,
          }}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}