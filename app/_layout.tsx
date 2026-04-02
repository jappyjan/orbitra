import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    SplashScreen.hideAsync();

    const onUnlockScreen = segments[0] === 'unlock';

    if (status !== 'unlocked' && !onUnlockScreen) {
      router.replace('/unlock');
    } else if (status === 'unlocked' && onUnlockScreen) {
      router.replace('/');
    }
  }, [status, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="unlock" options={{ headerShown: false }} />
        <Stack.Screen
          name="person/[id]"
          options={{ presentation: 'modal', title: 'Person' }}
        />
        <Stack.Screen
          name="person/add"
          options={{ presentation: 'modal', title: 'Add Person' }}
        />
        <Stack.Screen
          name="person/edit/[id]"
          options={{ presentation: 'modal', title: 'Edit Person' }}
        />
        <Stack.Screen
          name="circle/[id]"
          options={{ title: 'Circle' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
