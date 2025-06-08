import { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from 'shared/hooks';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const titleColor = isDarkMode ? '#7B635A' : '#D8C8B4';
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: textColor }}>
          Hi {user?.username ?? 'You'}!
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor }}>
      <Text
        style={{ fontFamily: 'ArefRuqaa_400Regular', color: titleColor }}
        className="mb-5 text-[42px] font-bold">
        Home page
      </Text>
    </View>
  );
}
