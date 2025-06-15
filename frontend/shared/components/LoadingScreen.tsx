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

export default function LoadingScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';

  const logoSource = isDarkMode
    ? require('../../assets/logo_light.png')
    : require('../../assets/logo_dark.png');

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
    <View className="flex-1 items-center justify-center" style={{ backgroundColor }}>
      <Animated.Image
        source={logoSource}
        style={[{ width: 130, height: 130, maxWidth: '80%' }, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
}
