import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Alert, Image, Linking } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useLanguage } from 'shared/language/language.hook';
import { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function FilterScreen({ onBack }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const colors = useThemeColors();
  const { t } = useLanguage();

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
            <Ionicons name="arrow-back" size={24} style={{ color: colors.textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              {t('filters.title')}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  const filters = [
    {
      id: '01',
      icon: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/icon_filter1.png',
      snapchatUrl:
        'https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=493d062c4459475485981bab6ec98caa&metadata=01',
    },
    {
      id: '02',
      icon: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/icon_filter2.png',
      snapchatUrl:
        'https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=22b967bb25354848ac87bd8756468917&metadata=01',
    },
    {
      id: '03',
      icon: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/icon_filter3.png',
      snapchatUrl: null,
    },
  ];

  // Function to determine if a filter is locked (only filter 3 for now)
  const isLocked = (filter: (typeof filters)[0]) => {
    return filter.id === '03';
  };

  // Function to open Snapchat filter
  const openSnapchatFilter = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          t('common.error'),
          'Unable to open Snapchat. Please make sure Snapchat is installed on your device.',
          [{ text: t('common.ok'), style: 'default' }],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error('Error opening Snapchat filter:', error);
      Alert.alert(
        t('common.error'),
        'An error occurred while trying to open the filter.',
        [{ text: t('common.ok'), style: 'default' }],
        { cancelable: true }
      );
    }
  };

  // Function to manage clicking on a filter
  const handleFilterPress = (filter: (typeof filters)[0]) => {
    const filterTitle = t(`filters.list.${filter.id}.title`);

    if (isLocked(filter)) {
      Alert.alert(
        t('common.comingSoon'),
        t('common.availableSoon', { title: filterTitle }),
        [{ text: t('common.ok'), style: 'default' }],
        { cancelable: true }
      );
    } else if (filter.snapchatUrl) {
      openSnapchatFilter(filter.snapchatUrl);
    }
  };

  // Function to get the visual style of locked cards
  const getCardStyle = (filter: (typeof filters)[0]) => {
    if (isLocked(filter)) {
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
  const getTextStyle = (filter: (typeof filters)[0], baseStyle: string) => {
    if (isLocked(filter)) {
      return `${baseStyle} opacity-60`;
    }
    return baseStyle;
  };

  return (
    <View className="flex-1 p-2" style={{ backgroundColor: colors.backgroundColor }}>
      <ScrollView className="mt-20">
        <View>
          <View className="mt-8">
            {filters.map((filter, idx) => {
              const cardStyle = getCardStyle(filter);
              const locked = isLocked(filter);

              return (
                <Animated.View key={filter.id} entering={FadeInUp.delay(idx * 50).duration(400)}>
                  <TouchableOpacity
                    activeOpacity={locked ? 0.7 : 0.8}
                    onPress={() => handleFilterPress(filter)}
                    className={cardStyle.className}
                    style={{ opacity: cardStyle.opacity }}>
                    <View className="flex-row items-center">
                      {/* Filter icon */}
                      <View className="mr-4 h-12 w-12 items-center justify-center">
                        <Image
                          source={{ uri: filter.icon }}
                          style={{
                            width: 40,
                            height: 40,
                            opacity: locked ? 0.6 : 1,
                          }}
                          resizeMode="contain"
                        />
                      </View>

                      {/* Filter Content */}
                      <View className="flex-1">
                        <Text
                          className={getTextStyle(
                            filter,
                            `text-aref whitespace-nowrap text-base font-medium ${colors.textPrimary} mb-1`
                          )}>
                          {t(`filters.list.${filter.id}.title`)}
                        </Text>
                        <Text
                          className={getTextStyle(
                            filter,
                            `text-aref whitespace-nowrap text-sm ${colors.textSecondaryAlt}`
                          )}>
                          {t(`filters.list.${filter.id}.subtitle`)}
                        </Text>
                      </View>

                      {/* Snapchat icon or lock */}
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
                              name="snapchat"
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
  );
}
