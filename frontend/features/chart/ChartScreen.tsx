import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

import { ScrollView, Text } from 'react-native';

import BirthChartForm from './BirthChartForm';

export default function ChartScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">Here is your chart</Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-[#F2EAE0] px-5 pt-10">
      <Text className="text-aref mb-6 text-center text-3xl font-bold text-[#7B635A]">
        Generate your Birth Chart
      </Text>
      <BirthChartForm />
    </ScrollView>
  );
}
