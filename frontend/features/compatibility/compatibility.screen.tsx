import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useAppSelector } from 'shared/hooks';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useLanguage } from 'shared/language/language.hook';
import { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function CompatibilityScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();
  const { t } = useLanguage();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { alertConfig, hideAlert, showAlert } = useCustomAlert();

  const handleBirthChartCompatibility = () => {
    showAlert({
      title: 'Subscribe',
      message: 'This feature requires a subscription to unlock advanced compatibility analysis.',
      actions: [{ text: 'OK', style: 'edit-style' }],
      icon: (
        <MaterialIcons
          name="lock"
          size={48}
          color={colors.colors?.raw?.icon || colors.iconColorAlt2}
        />
      ),
    });
  };

  const lightSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_light.png';
  const darkSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_dark.png';
  const signImage = isDarkMode ? darkSignUrl : lightSignUrl;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: colors.textColor }}>
          {t('compatibility.title')}
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode, t]);

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: colors.backgroundColor }}>
      {/* Zodiac Sign Compatibility */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ZodiacCompatibilityScreen')}
        className={`w-full rounded-3xl p-8 ${colors.cardBg} border ${colors.borderColor} mb-4`}>
        <View className="items-center justify-center">
          <View className="mb-6 flex-row items-center justify-center">
            <View className="h-16 w-16 items-center justify-center">
              <Image source={{ uri: signImage }} className="h-20 w-20" />
            </View>
            <Feather name="plus" size={28} color={colors.iconColor} className="mx-8" />
            <View className="h-16 w-16 items-center justify-center">
              <Image source={{ uri: signImage }} className="h-20 w-20" />
            </View>
          </View>

          <View className="items-center">
            <Text className={`text-aref text-xl font-semibold ${colors.textPrimary} mb-2`}>
              {t('compatibility.zodiacCompatibility')}
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt}`}>
              {t('compatibility.knowCompatibility')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Birth Charts Compatibility (Locked)*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleBirthChartCompatibility}
        className={`relative w-full rounded-3xl px-6 py-8 ${colors.cardBg} border ${colors.borderColor}`}>
        <View
          className={`absolute right-4 top-2 h-6 w-6 items-center justify-center rounded-full ${colors.iconBg}`}>
          <Feather name="lock" size={16} style={{ color: colors.iconColorAlt }} />
        </View>

        <View className="items-center justify-center">
          <View className="mt-6 flex-row items-center justify-center">
            <View className="mr-6">
              <View className="mb-3 flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-sagittarius"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-libra"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
              </View>
              <View className="flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-aquarius"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-capricorn"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
              </View>
            </View>

            <Feather name="plus" size={28} color={colors.iconColor} />

            <View className="ml-6">
              <View className="mb-3 flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-sagittarius"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-libra"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
              </View>
              <View className="flex-row">
                <View
                  className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-aquarius"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
                  <MaterialCommunityIcons
                    name="zodiac-capricorn"
                    size={20}
                    style={{ color: colors.iconColorAlt }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View className="mt-2 items-center">
            <Text className={`text-aref text-xl font-semibold ${colors.textPrimary} mb-2`}>
              {t('compatibility.birthChartCompatibility')}
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt} text-center`}>
              {t('compatibility.planetsLoveMatch')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={hideAlert}
        icon={alertConfig.icon}
      />
    </View>
  );
}
