import { Tabs } from 'expo-router/js-tabs';
import { ChartNoAxesColumn, CircleUserRound, House, NotebookPen, Timer } from 'lucide-react-native';

import { FloatingTabBar, type TabMeta } from '@/navigation/FloatingTabBar';
import { useTheme } from '@/theme/useTheme';

const TABS: Record<string, TabMeta> = {
  home: { label: 'Home', icon: House },
  practice: { label: 'Practice', icon: NotebookPen },
  mock: { label: 'Mock', icon: Timer },
  progress: { label: 'Progress', icon: ChartNoAxesColumn },
  profile: { label: 'Profile', icon: CircleUserRound },
};

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} tabs={TABS} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.background } }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
      <Tabs.Screen name="mock" options={{ title: 'Mock' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
