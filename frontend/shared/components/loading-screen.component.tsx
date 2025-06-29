import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function LoadingScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();

  const logoSource = {
    uri: isDarkMode
      ? 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_light.png'
      : 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_dark.png',
  };

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.backgroundColor }}>
      <Animated.Image
        source={logoSource}
        style={[{ width: 130, height: 130, maxWidth: '80%' }, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
}
