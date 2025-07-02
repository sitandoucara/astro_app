import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format, addDays, subDays } from 'date-fns';
import { useZodiacCompatibility } from 'features/compatibility/zodiac-signs-compatibility/zodiac-compatibility.hook';
import { useLayoutEffect, useState, useMemo } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { useLanguage } from 'shared/language/language.hook';
import { useThemeColors } from 'shared/theme/theme-color.hook';

import { HoroscopeSection } from './components/horoscope-section.component';
import { useAffirmations } from './hooks/affirmations.hook';

interface TimeTab {
  id: string;
  label: string;
  active: boolean;
}

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const { userSign } = useZodiacCompatibility();
  const colors = useThemeColors();
  const { t } = useLanguage();

  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName.toLowerCase()}_${theme}.png`;
  };

  const currentUserSign = userSign || 'Cancer';
  const signImage = getSignImageUrl(currentUserSign);
  const { getCurrentAffirmation, loading: affirmationsLoading } = useAffirmations();

  useLayoutEffect(() => {
    console.log('HomeScreen - User data updated:', user?.username);
    navigation.setOptions({
      headerTitle: () => (
        <View className="mb-1 flex-row gap-2">
          <Image source={{ uri: signImage }} className="h-10 w-10" />
          <View>
            <Text className="text-aref text-[20px]" style={{ color: colors.textColor }}>
              {t('home.hi', { username: user?.username ?? 'You' })}
            </Text>
          </View>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode, signImage, user?.username, t]);

  const [activeTab, setActiveTab] = useState<string>('TODAY');

  const isPremiumTab = (tabId: string) => {
    return ['MONTH', '2025', '2026'].includes(tabId);
  };

  const tabs: TimeTab[] = useMemo(
    () => [
      { id: 'YESTERDAY', label: t('home.tabs.yesterday'), active: false },
      { id: 'TODAY', label: t('home.tabs.today'), active: true },
      { id: 'TOMORROW', label: t('home.tabs.tomorrow'), active: false },
      { id: 'WEEK', label: t('home.tabs.week'), active: false },
      { id: 'MONTH', label: t('home.tabs.month'), active: false },
      { id: '2025', label: '2025', active: false },
      { id: '2026', label: '2026', active: false },
    ],
    [t]
  );

  const getFormattedDate = (tabId: string) => {
    const today = new Date();

    switch (tabId) {
      case 'YESTERDAY':
        return format(subDays(today, 1), 'dd MMMM yyyy');
      case 'TODAY':
        return format(today, 'dd MMMM yyyy');
      case 'TOMORROW':
        return format(addDays(today, 1), 'dd MMMM yyyy');
      case 'MONTH':
        return format(today, 'MMMM yyyy');
      case '2025':
      case '2026':
        return t('home.periods.year', { year: tabId });
      case 'WEEK':
        return t('home.periods.thisWeek');
      default:
        return format(today, 'dd MMMM yyyy');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const tabSpacing = isTablet ? 'mx-12' : 'mx-3';

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
      <ScrollView horizontal className="mt-8" showsHorizontalScrollIndicator={false}>
        {tabs.map((tab, index) => (
          <View key={tab.id} className="flex-row items-center">
            <TouchableOpacity onPress={() => handleTabClick(tab.id)} className="relative pb-1">
              <Text
                className={`text-aref text-sm font-medium tracking-wide ${
                  activeTab === tab.id ? 'underline' : ''
                }`}
                style={{ color: activeTab === tab.id ? colors.textColor : '#7F726C' }}>
                {tab.label}
              </Text>

              {activeTab === tab.id && (
                <View
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: colors.textColor }}
                />
              )}
            </TouchableOpacity>
            {index < tabs.length - 1 && (
              <Text className={`text-xs text-stone-400 ${tabSpacing}`}>•</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View className="mt-8 flex-1 p-2">
        <View className="mb-8 flex-row items-start justify-between">
          <View>
            <Text className={`text-aref mt-1 text-xl font-light ${colors.textSecondary}`}>
              {getFormattedDate(activeTab)}
            </Text>

            <Text className={`text-aref mt-1 text-sm ${colors.textSecondary}`}>
              {t('home.horoscopeDate')}
            </Text>
          </View>
          <View className="items-end">
            <Text className={`text-aref mt-1 text-xl font-light ${colors.textSecondary}`}>
              {isPremiumTab(activeTab) ? capitalizeFirst(currentUserSign) : 'Waning Gibbous'}
            </Text>
            <Text className={`text-aref mt-1 text-sm ${colors.textSecondary}`}>
              {isPremiumTab(activeTab) ? t('home.sunSign') : t('home.moonPhase')}
            </Text>
          </View>
        </View>

        {isPremiumTab(activeTab) ? (
          <>
            <View className="mb-8">
              <View className="items-center">
                <View className="mt-5 p-2">
                  <Image
                    source={{
                      uri: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/padlock.png',
                    }}
                    alt="Locked"
                    className="objectif-fit h-64 w-60"
                  />
                </View>
              </View>
              <View className="mb-8">
                <Text
                  className={`text-aref mb-4 text-center text-lg font-medium ${colors.textPrimary}`}>
                  {t('home.horoscopeFor', { period: activeTab })}
                </Text>
                <Text className={`text-aref text-center text-sm ${colors.textSecondary}`}>
                  {t('home.unlockSubscribe')}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="mb-8">
              <View className="relative items-center">
                <View className="absolute left-0 z-10" style={{ top: '50%', marginTop: -16 }}>
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full ${colors.iconBg}`}>
                    <MaterialCommunityIcons
                      name="zodiac-capricorn"
                      size={20}
                      style={{ color: colors.iconColorAlt }}
                    />
                  </View>
                </View>
                <View className="absolute right-0 z-10" style={{ top: '50%', marginTop: -16 }}>
                  <View
                    className={`h-8 w-8 items-center justify-center rounded-full ${colors.iconBg}`}>
                    <MaterialCommunityIcons
                      name="zodiac-cancer"
                      size={20}
                      style={{ color: colors.iconColorAlt }}
                    />
                  </View>
                </View>
                <View className="h-60 w-60">
                  <Image
                    source={{
                      uri: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/moon.png',
                    }}
                    alt="Moon phase"
                    className="h-60 w-60 object-cover"
                  />
                </View>
              </View>
              <View className="mt-4 flex-row items-end justify-between">
                <View>
                  <Text className={`text-aref text-lg font-medium ${colors.textPrimary}`}>
                    {capitalizeFirst(currentUserSign)}
                  </Text>
                  <Text className={`text-aref text-sm ${colors.textSecondary}`}>
                    {t('home.sunSign')}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`text-aref text-lg font-medium ${colors.textPrimary}`}>Leo</Text>
                  <Text className={`text-aref text-sm ${colors.textSecondary}`}>
                    {t('home.moonSign')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Horoscope Component */}
            <HoroscopeSection activeTab={activeTab} isPremiumTab={isPremiumTab} />

            <View className="mb-8">
              <Text className={`text-aref mb-4 text-lg font-medium ${colors.textPrimary}`}>
                {t('home.affirmation')}
              </Text>
              {affirmationsLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator
                    size="small"
                    color={colors.textColor}
                    style={{ marginRight: 8 }}
                  />
                  <Text className={`text-aref text-sm ${colors.textSecondary}`}>
                    Loading affirmation...
                  </Text>
                </View>
              ) : (
                <Text
                  className={`text-aref text-sm ${colors.textSecondary}`}
                  style={{ lineHeight: 20 }}>
                  {getCurrentAffirmation(activeTab)}
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
