import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';

import { useAppSelector } from '../../shared/hooks';

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.auth.user);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">
          Hi {user?.username ?? 'You'}!
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, user]);

  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0]">
      <Text
        style={{ fontFamily: 'ArefRuqaa_400Regular' }}
        className="mb-5 text-[42px] font-bold text-[#7B635A]">
        Home page
      </Text>
    </View>
  );
}
