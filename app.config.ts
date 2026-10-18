import type { ExpoConfig } from 'expo/config';

// Everything in this config (including `extra`) ships inside the app bundle.
// Only read EXPO_PUBLIC_* variables here, and only for public values.
const config: ExpoConfig = {
  name: 'TaraCSE',
  slug: 'taracse-mobile',
  scheme: 'taracse',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
  },
  android: {
    package: 'com.taracse.app',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    // No permissions are requested in this phase. Blocking these keeps the
    // Play Data safety form minimal even if a dependency declares them.
    permissions: [],
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.SYSTEM_ALERT_WINDOW',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? '',
  },
};

export default config;
