import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomAlert } from 'shared/components/custom-alert.component';
import NoiseOverlay from 'shared/components/noise-overlay.component';
import { useAppSelector } from 'shared/hooks';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useLanguage } from 'shared/language/language.hook';
import { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function QuizzScreen({ onBack }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const colors = useThemeColors();
  const { t } = useLanguage();

  const { alertConfig, hideAlert, showAlert } = useCustomAlert();

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.backgroundColor,
      },
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row gap-2">
            <Ionicons name="chevron-back" size={24} style={{ color: colors.textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              {t('quiz.title')}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  const chapters = [
    {
      id: '01',
      sign: 'aries',
      icon: 'gamepad-variant',
    },
    {
      id: '02',
      sign: 'taurus',
      icon: 'help-circle',
    },
    {
      id: '03',
      sign: 'gemini',
      icon: 'cards',
    },
    {
      id: '04',
      sign: 'cancer',
      icon: 'puzzle',
    },
    {
      id: '05',
      sign: 'leo',
      icon: 'star-circle',
    },
    {
      id: '06',
      sign: 'virgo',
      icon: 'clock-time-three',
    },
    {
      id: '07',
      sign: 'libra',
      icon: 'scale-balance',
    },
    {
      id: '08',
      sign: 'scorpio',
      icon: 'eye',
    },
    {
      id: '09',
      sign: 'sagittarius',
      icon: 'bow-arrow',
    },
    {
      id: '10',
      sign: 'capricorn',
      icon: 'trophy',
    },
  ];

  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName}_${theme}.png`;
  };

  // Function to determine if a chapter is locked
  const isLocked = (chapter: (typeof chapters)[0]) => {
    const availableLessons = ['01', '02'];
    return !availableLessons.includes(chapter.id);
  };

  // Function to manage clicking on a chapter
  const handleChapterPress = (chapter: (typeof chapters)[0]) => {
    const testTitle = t(`quiz.tests.${chapter.id}.title`);

    if (isLocked(chapter)) {
      showAlert({
        title: t('common.comingSoon'),
        message: t('common.availableSoon', { title: testTitle }),
        actions: [{ text: t('common.ok'), style: 'edit-style' }],
        icon: (
          <MaterialIcons
            name="lock"
            size={48}
            color={colors.iconColorAlt2 || colors.colors.raw.icon}
          />
        ),
      });
    } else {
      if (chapter.id === '01') {
        navigation.navigate('GuessWhoGame');
      } else if (chapter.id === '02') {
        navigation.navigate('TrueOrFalseGame');
      }
    }
  };

  // Function to get the visual style of locked cards
  const getCardStyle = (chapter: (typeof chapters)[0]) => {
    if (isLocked(chapter)) {
      return {
        opacity: 0.6,
        className: `mt-4 w-full rounded-3xl p-4 ${colors.cardBg} border ${colors.borderColor}`,
      };
    }
    return {
      opacity: 1,
      className: `mt-4 w-full rounded-3xl p-4 ${colors.cardBg} border ${colors.borderColor}`,
    };
  };

  // Function to get the text style according to the lock state
  const getTextStyle = (chapter: (typeof chapters)[0], baseStyle: string) => {
    if (isLocked(chapter)) {
      return `${baseStyle} opacity-60`;
    }
    return baseStyle;
  };

  return (
    <NoiseOverlay intensity={1}>
      <View className="flex-1 p-2" style={{ backgroundColor: colors.backgroundColor }}>
        <ScrollView className="mt-20">
          <View>
            <View className="mt-8">
              {chapters.map((chapter, idx) => {
                const cardStyle = getCardStyle(chapter);
                const locked = isLocked(chapter);

                return (
                  <Animated.View key={chapter.id} entering={FadeInUp.delay(idx * 50).duration(400)}>
                    <TouchableOpacity
                      activeOpacity={locked ? 0.7 : 0.8}
                      onPress={() => handleChapterPress(chapter)}
                      className={cardStyle.className}
                      style={{ opacity: cardStyle.opacity }}>
                      <View className="flex-row items-center">
                        {/* Image of the astrological sign */}
                        <View className="mr-4 h-12 w-12 items-center justify-center">
                          <Image
                            source={{ uri: getSignImageUrl(chapter.sign) }}
                            style={{
                              width: 40,
                              height: 40,
                              opacity: locked ? 0.6 : 1,
                            }}
                            resizeMode="contain"
                          />
                        </View>

                        {/* Chapter Content */}
                        <View className="flex-1">
                          <Text
                            className={getTextStyle(
                              chapter,
                              `text-aref whitespace-nowrap text-base font-medium ${colors.textPrimary} mb-1`
                            )}>
                            {t(`quiz.tests.${chapter.id}.title`)}
                          </Text>
                          <Text
                            className={getTextStyle(
                              chapter,
                              `text-aref whitespace-nowrap text-sm ${colors.textSecondaryAlt}`
                            )}>
                            {t(`quiz.tests.${chapter.id}.subtitle`)}
                          </Text>
                        </View>
                        {/* Padlock or game icon */}
                        <View className="ml-3 flex-row items-center gap-3">
                          {locked ? (
                            <View className="h-10 w-10 items-center justify-center">
                              <MaterialIcons
                                name="lock"
                                size={24}
                                style={{ color: colors.iconColorAlt2, opacity: 0.7 }}
                              />
                            </View>
                          ) : (
                            <View className="h-10 w-10 items-center justify-center">
                              <MaterialCommunityIcons
                                name="gamepad-variant"
                                size={32}
                                style={{ color: colors.iconColorAlt2 }}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={hideAlert}
        icon={alertConfig.icon}
      />
    </NoiseOverlay>
  );
}
