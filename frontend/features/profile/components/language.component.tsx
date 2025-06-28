import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useLanguage } from 'shared/language/language.hook';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function Language({ onBack }: any) {
  const navigation = useNavigation();
  const colors = useThemeColors();
  const { t, currentLanguage, changeLanguage } = useLanguage();

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={colors.textColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              {t('language.title')}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.textColor, t]);

  return (
    <View className="flex-1  p-10" style={{ backgroundColor: colors.backgroundColor }}>
      <View className="mt-28 flex-1 gap-4">
        {/* English Button */}
        <Animated.View entering={SlideInLeft.duration(500)}>
          <View className={`rounded-full border-2 ${colors.border} p-2`}>
            <TouchableOpacity
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.8}
              className={`shadow-opacity-30 elevation-1 rounded-full px-16 py-3 shadow-md shadow-light-text2 ${
                currentLanguage === 'en'
                  ? `${colors.bgButton} opacity-100`
                  : `${colors.bgButton} opacity-60`
              }`}>
              <Text
                className={`text-aref text-center text-xl font-bold tracking-wide ${colors.textButton1}`}>
                {t('language.english')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* French Button */}
        <Animated.View entering={SlideInRight.duration(650)} className="mt-2">
          <View className={`rounded-full border-2 ${colors.border} p-2`}>
            <TouchableOpacity
              onPress={() => handleLanguageChange('fr')}
              activeOpacity={0.8}
              className={`shadow-opacity-30 elevation-1 rounded-full px-16 py-3 shadow-md shadow-light-text2 ${
                currentLanguage === 'fr'
                  ? `${colors.bgButton} opacity-100`
                  : `${colors.bgButton} opacity-60`
              }`}>
              <Text
                className={`text-aref text-center text-xl font-bold tracking-wide ${colors.textButton1}`}>
                {t('language.french')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
