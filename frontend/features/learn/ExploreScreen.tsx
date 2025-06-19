import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function ExploreScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconBg = isDarkMode ? 'bg-light-border' : 'bg-dark-border';
  const iconColor = isDarkMode ? '#F2EAE0' : '#32221E';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: textColor }}>
          You can Explore
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  return (
    <View className="flex-1 items-center justify-center px-2" style={{ backgroundColor }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('LearnScreen')}
        className={` w-full rounded-3xl p-6 ${cardBg} border ${borderColor} mb-4`}>
        <View className="  justify-center">
          <View className="h-16 w-16 items-center justify-center ">
            <View className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
              <FontAwesome name="book" size={20} style={{ color: iconColor }} />
            </View>
          </View>

          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>Learn</Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>Discover Astrology</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('QuizzScreen')}
        className={` w-full rounded-3xl p-6 ${cardBg} border ${borderColor} mb-4`}>
        <View className="  justify-center">
          {/* Header avec les 2 grandes icones */}
          <View className="h-16 w-16 items-center justify-center ">
            <View className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
              <MaterialCommunityIcons
                name="gamepad-variant"
                size={20}
                style={{ color: iconColor }}
              />
            </View>
          </View>

          {/* Texte centré */}
          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Test & Quiz
            </Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              Test Your Astrology Knowlege
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Alert.alert('Zodiac Sign Compatibility clicked!')}
        className={` w-full rounded-3xl p-6 ${cardBg} border ${borderColor} mb-4`}>
        <View className="  justify-center">
          {/* Header avec les 2 grandes icones */}
          <View className="h-16 w-16 items-center justify-center ">
            <View className={`mr-3 h-10 w-10 items-center justify-center rounded-full  ${iconBg}`}>
              <MaterialCommunityIcons name="book" size={20} style={{ color: iconColor }} />
            </View>
          </View>

          {/* Texte centré */}
          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Mini-books
            </Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>Know more about Astrology</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
