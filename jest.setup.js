// Worklets, Reanimated and Gesture Handler run without native modules under Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
// Reanimated 4.7's native initializer registers a CSS event handler that its JS
// fallback throws on; under Jest there is nothing to initialize.
jest.mock('react-native-reanimated/src/initializers', () => ({
  initializeReanimatedModule: () => undefined,
}));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
require('react-native-gesture-handler/jestSetup');
