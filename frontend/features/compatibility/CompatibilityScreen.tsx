import { useLayoutEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CompatibilityScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">Check your compatibility</Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0]">
      <Text className="text-aref mb-5 text-[42px] font-bold text-[#7B635A]">
        Compatibility page
      </Text>
    </View>
  );
}
