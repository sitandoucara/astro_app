import { useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BirthChartForm from './BirthChartForm';

export default function ChartScreen() {
  const navigation = useNavigation();
  const [planets, setPlanets] = useState<any>(null);
  const [ascendant, setAscendant] = useState<any>(null);

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

      {/* Génération du thème (image + callback pour données texte) */}
      <BirthChartForm setPlanets={setPlanets} setAscendant={setAscendant} />

      {/* Affichage des positions planétaires principales */}
      {planets && ascendant && (
        <View className="mt-6 space-y-1">
          <Text className="text-[#32221E]">☀ Sun: {planets.Sun?.sign}</Text>
          <Text className="text-[#32221E]">🌙 Moon: {planets.Moon?.sign}</Text>
          <Text className="text-[#32221E]">⬆ Ascendant: {ascendant?.sign}</Text>
          <Text className="text-[#32221E]">♀ Venus: {planets.Venus?.sign}</Text>
          <Text className="text-[#32221E]">♂ Mars: {planets.Mars?.sign}</Text>
          {/* Ajoute plus si besoin */}
        </View>
      )}
    </ScrollView>
  );
}
