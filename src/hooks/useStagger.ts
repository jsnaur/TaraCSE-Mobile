import { FadeInDown, useReducedMotion } from 'react-native-reanimated';

/**
 * Entering animation for the nth block of a screen: each rises in a beat after the one
 * above it. Returns undefined under reduce motion so blocks simply appear.
 */
export function useStagger(baseDelay = 0, step = 60) {
  const reduceMotion = useReducedMotion();
  return (i: number) =>
    reduceMotion
      ? undefined
      : FadeInDown.delay(baseDelay + step * i)
          .springify()
          .damping(20)
          .stiffness(180);
}
