import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type KotMood = 'hello' | 'cheer' | 'encourage' | 'guide' | 'thinking';

const sources = {
  hello: require('@/assets/images/kot/hello.png'),
  cheer: require('@/assets/images/kot/cheer.png'),
  encourage: require('@/assets/images/kot/encourage.png'),
  guide: require('@/assets/images/kot/guide.png'),
  thinking: require('@/assets/images/kot/thinking.png'),
} as const;

const labels: Record<KotMood, string> = {
  hello: 'KOT waving hello',
  cheer: 'KOT cheering',
  encourage: 'KOT giving a thumbs up',
  guide: 'KOT pointing the way',
  thinking: 'KOT thinking',
};

export interface KotProps {
  mood: KotMood;
  size?: number;
  /** Decorative KOT next to text that already says the same thing. */
  decorative?: boolean;
  style?: StyleProp<ImageStyle>;
}

/** TaraCSE's mascot. Real art only; never redraw or recolour KOT. */
export function Kot({ mood, size = 160, decorative = false, style }: KotProps) {
  return (
    <Image
      source={sources[mood]}
      resizeMode="contain"
      accessible={!decorative}
      accessibilityLabel={decorative ? undefined : labels[mood]}
      accessibilityIgnoresInvertColors
      style={[{ width: size, height: size }, style]}
    />
  );
}
