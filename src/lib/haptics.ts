import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptics are a confirmation, never a requirement: every call is fire-and-forget and
// silently skipped on web, where the API does not exist.
const enabled = Platform.OS !== 'web';

export const haptics = {
  selection() {
    if (enabled) void Haptics.selectionAsync().catch(() => undefined);
  },
  light() {
    if (enabled) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
  },
  success() {
    if (enabled)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
  },
  error() {
    if (enabled)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  },
  warning() {
    if (enabled)
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => undefined,
      );
  },
};
