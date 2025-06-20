import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';

export default function CompatibilityScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconBg = isDarkMode ? 'bg-light-border' : 'bg-dark-border';
  const iconColor = isDarkMode ? '#F2EAE0' : '#32221E';

  //const navigation = useNavigation();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Images zodiac selon thème
  const lightSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_light.png';
  const darkSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_dark.png';
  const signImage = isDarkMode ? darkSignUrl : lightSignUrl;

  // Couleurs dynamiques
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';

  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: textColor }}>
          Your compability
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  return (
    <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor }}>
      {/* Zodiac Sign Compatibility */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ZodiacSignsCompatibility')}
        className={` w-full rounded-3xl p-8 ${cardBg} border ${borderColor} mb-4`}>
        <View className=" items-center justify-center">
          {/* Header avec les 2 grandes icones */}
          <View className="mb-6 flex-row items-center justify-center">
            <View className="h-16 w-16 items-center justify-center ">
              <Image source={{ uri: signImage }} className="h-20 w-20" />
            </View>
            <Feather
              name="plus"
              size={28}
              color={isDarkMode ? '#281109' : '#F2EAE0'}
              className="mx-8"
            />
            <View className="h-16 w-16 items-center justify-center ">
              <Image source={{ uri: signImage }} className="h-20 w-20" />
            </View>
          </View>

          {/* Texte centré */}
          <View className="items-center">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Zodiac Sign Compatibility
            </Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              Know your Zodiac sign compability
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Birth Charts Compatibility (Locked) */}
      <TouchableOpacity
        //activeOpacity={0.8}
        onPress={() => navigation.navigate('BirthChartCompability')}
        className={`relative  w-full rounded-3xl px-6 py-8 ${cardBg} border ${borderColor}`}>
        {/* Lock Icon en position absolue */}
        <View
          className={`absolute right-4 top-2 h-6 w-6 items-center justify-center  rounded-full ${iconBg}`}>
          <Feather name="lock" size={16} style={{ color: iconColor }} />
        </View>

        <View className=" items-center justify-center">
          {/* Header avec les groupes de 4 icones dans des cercles */}
          <View className=" mt-6 flex-row items-center justify-center">
            {/* Groupe de gauche - 2x2 dans des cercles */}
            <View className="mr-6">
              <View className="mb-3 flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-sagittarius"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
                <View className={` h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-libra"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
              </View>
              <View className="flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-aquarius"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
                <View className={` h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-capricorn"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
              </View>
            </View>

            {/* Plus au centre */}
            <Feather name="plus" size={28} color={isDarkMode ? '#281109' : '#F2EAE0'} />

            {/* Groupe de droite - 2x2 dans des cercles */}
            <View className="ml-6">
              <View className="mb-3 flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-sagittarius"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
                <View className={` h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-libra"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
              </View>
              <View className="flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-aquarius"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
                <View className={` h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-capricorn"
                    size={20}
                    style={{ color: iconColor }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Texte centré */}
          <View className="mt-2 items-center">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Birth Charts Compatibility
            </Text>
            <Text className={`text-aref text-sm ${textSecondary} text-center`}>
              Let's see what planets in your charts say{'\n'}about your love match
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
