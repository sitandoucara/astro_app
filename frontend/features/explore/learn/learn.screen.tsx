import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useLanguage } from 'shared/language/language.hook';
import { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function LearnScreen({ onBack }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
              {t('learn.title')}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  const chapters = [
    { id: '01' },
    { id: '02' },
    { id: '03' },
    { id: '04' },
    { id: '05' },
    { id: '06' },
    { id: '07' },
    { id: '08' },
    { id: '09' },
    { id: '10' },
  ];

  // Function to determine if a chapter is locked
  const isLocked = (chapter: (typeof chapters)[0]) => {
    const availableLessons = ['01', '02', '03'];
    return !availableLessons.includes(chapter.id);
  };

  // Function to manage clicking on a chapter
  const handleChapterPress = (chapter: (typeof chapters)[0]) => {
    const lessonTitle = t(`learn.lessons.${chapter.id}.title`);

    if (isLocked(chapter)) {
      showAlert({
        title: t('common.comingSoon'),
        message: t('common.availableSoon', { title: lessonTitle }),
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
      navigation.navigate('AudioBookScreen', {
        title: lessonTitle,
        jsonUrl: `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/learn/lesson_${chapter.id}.json`,
      });
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
    <>
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
                        <View className="mr-4 w-10 items-center justify-center">
                          {/* Chapter number */}
                          <Text
                            className={getTextStyle(
                              chapter,
                              `text-aref text-lg font-bold ${colors.textPrimary}`
                            )}>
                            {chapter.id}
                          </Text>
                        </View>

                        <View className="flex-1">
                          <Text
                            className={getTextStyle(
                              chapter,
                              `text-aref whitespace-nowrap text-base font-medium ${colors.textPrimary} mb-1`
                            )}>
                            {t(`learn.lessons.${chapter.id}.title`)}
                          </Text>
                          <Text
                            className={getTextStyle(
                              chapter,
                              `text-aref whitespace-nowrap text-sm ${colors.textSecondaryAlt}`
                            )}>
                            {t(`learn.lessons.${chapter.id}.duration`)}
                          </Text>
                        </View>

                        {/* Padlock or play icon */}
                        <View className="ml-3 flex-row items-center">
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
                              <Ionicons
                                name="play-circle"
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
    </>
  );
}
