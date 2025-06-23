import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Alert, Text, Image, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function BirthChartCompability({ onBack }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconColor = isDarkMode ? '#F2EAE0' : '#32221E';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';

  const navigation = useNavigation();

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => {
            goBack();
          }}>
          <View className="flex-row gap-2">
            <Ionicons name="arrow-back" size={24} style={{ color: textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              Tell us about your beloved
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center p-10" style={{ backgroundColor }}>
      <View className="mb-8">
        <View className="items-center">
          <View className="mt-5 p-2">
            <Image source={require('../../../assets/lock_birthchart.png')} alt="Locked" />
          </View>
        </View>
        <View className="mb-8">
          <Text className={`text-aref text-sm" text-center ${textSecondary} `}>
            To unlock the horoscope, subscribe
          </Text>
        </View>

        <View className="w-full flex-row items-center justify-center gap-2">
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View className={`h-3 w-3 rounded-full  ${cardBg} `} />
            <View className={`h-4 w-4 rounded-full  ${cardBg} `} />
          </View>

          <View className={`rounded-full border-2 p-2  ${borderColor} `}>
            <TouchableOpacity
              onPress={() => Alert.alert('subscribe!')}
              activeOpacity={0.8}
              className="shadow-opacity-30  elevation-1 rounded-full bg-[#BFB0A7] px-12  py-3 shadow-md shadow-light-text2">
              <Text
                className={`text-aref text-center text-base font-bold tracking-wide  ${iconColor} `}>
                Subscribe to unlock
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View className={`h-4 w-4 rounded-full  ${cardBg} `} />
            <View className={`h-3 w-3 rounded-full  ${cardBg} `} />
          </View>
        </View>
      </View>
    </View>
  );
}
