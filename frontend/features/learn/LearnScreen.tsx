import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LearnScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const titleColor = isDarkMode ? '#7B635A' : '#D8C8B4';
  const navigation = useNavigation();

  // Couleurs dynamiques
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-dark-cardback';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: textColor }}>
          You can learn
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  return (
    <View className="flex-1 items-center justify-center px-2" style={{ backgroundColor }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Alert.alert('Zodiac Sign Compatibility clicked!')}
        className={` w-full rounded-3xl p-6 ${cardBg} border ${borderColor} mb-4`}>
        <View className="  justify-center">
          {/* Header avec les 2 grandes icones */}
          <View className="h-16 w-16 items-center justify-center ">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#281109] ">
              <MaterialCommunityIcons name="paperclip" size={20} color="#F2EAE0" />
            </View>
          </View>

          {/* Texte centré */}
          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>Learn</Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              304 Reports delivered today
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
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#281109] ">
              <MaterialCommunityIcons name="book" size={20} color="#F2EAE0" />
            </View>
          </View>

          {/* Texte centré */}
          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Mini-books
            </Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              304 Reports delivered today
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
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#281109] ">
              <MaterialCommunityIcons name="gamepad-variant" size={20} color="#F2EAE0" />
            </View>
          </View>

          {/* Texte centré */}
          <View className="">
            <Text className={`text-aref text-xl font-semibold ${textPrimary} mb-2`}>
              Test & Quiz
            </Text>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              304 Reports delivered today
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
