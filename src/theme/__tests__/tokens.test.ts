import { darkColors, lightColors } from '@/theme/tokens';

test('dark mode defines every colour role light mode does', () => {
  expect(Object.keys(darkColors).sort()).toEqual(Object.keys(lightColors).sort());
});
