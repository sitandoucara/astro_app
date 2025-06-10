import { format, addDays, subDays } from 'date-fns';
import { useLayoutEffect, useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from 'shared/hooks';

import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TimeTab {
  id: string;
  label: string;
  active: boolean;
}

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const titleColor = isDarkMode ? '#7B635A' : '#D8C8B4';

  const iconBg = isDarkMode ? 'bg-light-border' : 'bg-dark-border';
  const iconColor = isDarkMode ? '#F2EAE0' : '#32221E';

  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';

  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';

  // Images zodiac selon thème
  const lightSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_light.png';
  const darkSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_dark.png';
  const signImage = isDarkMode ? darkSignUrl : lightSignUrl;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row gap-2">
          <Image source={{ uri: signImage }} className="h-10 w-10" />

          <View>
            <Text className="text-aref text-[20px]" style={{ color: textColor }}>
              Hi {user?.username ?? 'You'}!
            </Text>
          </View>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  const [activeTab, setActiveTab] = useState<string>('TODAY');

  const isPremiumTab = (tabId: string) => {
    return ['MONTH', '2025', '2026'].includes(tabId);
  };

  const tabs: TimeTab[] = useMemo(
    () => [
      { id: 'YESTERDAY', label: 'YESTERDAY', active: false },
      { id: 'TODAY', label: 'TODAY', active: true },
      { id: 'TOMORROW', label: 'TOMORROW', active: false },
      { id: 'WEEK', label: 'WEEK', active: false },
      { id: 'MONTH', label: 'MONTH', active: false },
      { id: '2025', label: '2025', active: false },
      { id: '2026', label: '2026', active: false },
    ],
    []
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
        return `Year ${tabId}`;
      case 'WEEK':
        return 'This week';
      default:
        return format(today, 'dd MMMM yyyy');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor }}>
      <ScrollView horizontal className="mt-8" showsHorizontalScrollIndicator={false}>
        {tabs.map((tab, index) => (
          <View key={tab.id} className="flex-row items-center">
            <TouchableOpacity onPress={() => handleTabClick(tab.id)} className="relative pb-1">
              <Text
                className={`text-aref text-sm font-medium tracking-wide ${
                  activeTab === tab.id ? 'underline' : ''
                }`}
                style={{ color: activeTab === tab.id ? textColor : '#7F726C' }}>
                {tab.label}
              </Text>

              {activeTab === tab.id && (
                <View
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: textColor }}
                />
              )}
            </TouchableOpacity>
            {index < tabs.length - 1 && <Text className="mx-3 text-xs text-stone-400">•</Text>}
          </View>
        ))}
      </ScrollView>

      <View className="mt-8 flex-1 p-2">
        <View className="mb-8 flex-row items-start justify-between">
          <View>
            <Text className={`text-aref mt-1 text-xl font-light ${textSecondary} `}>
              {getFormattedDate(activeTab)}
            </Text>

            <Text className={`text-aref mt-1 text-sm ${textSecondary} `}>Horoscope Date</Text>
          </View>
          <View className="items-end">
            <Text className={`text-aref mt-1 text-xl font-light ${textSecondary} `}>
              {isPremiumTab(activeTab) ? 'Cancer' : 'Waning Gibbous'}
            </Text>
            <Text className={`text-aref mt-1 text-sm ${textSecondary} `}>
              {isPremiumTab(activeTab) ? 'Sun sign' : 'Moon Phase'}
            </Text>
          </View>
        </View>

        {isPremiumTab(activeTab) ? (
          <>
            <View className="mb-8">
              <View className="items-center">
                <View className="mt-5 p-2">
                  <Image source={require('../../assets/padlock.png')} alt="Locked" />
                </View>
              </View>
              <View className="mb-8">
                <Text
                  className={`text-aref font-medium" mb-4 text-center text-lg
                  ${textPrimary} `}>
                  Horoscope for {activeTab}
                </Text>
                <Text
                  className={`text-aref text-sm" text-center
                  ${textSecondary} `}>
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
          </>
        ) : (
          <>
            <View className="mb-8">
              <View className="relative items-center">
                <View className="absolute left-0 z-10" style={{ top: '50%', marginTop: -16 }}>
                  <View className={`h-8 w-8 items-center justify-center rounded-full ${iconBg} `}>
                    <MaterialCommunityIcons
                      name="zodiac-capricorn"
                      size={20}
                      style={{ color: iconColor }}
                    />
                  </View>
                </View>
                <View className="absolute right-0 z-10" style={{ top: '50%', marginTop: -16 }}>
                  <View className={`h-8 w-8 items-center justify-center rounded-full ${iconBg} `}>
                    <MaterialCommunityIcons
                      name="zodiac-cancer"
                      size={20}
                      style={{ color: iconColor }}
                    />
                  </View>
                </View>
                <View className="h-60 w-60">
                  <Image
                    source={require('../../assets/moon.png')}
                    alt="Moon phase"
                    className="h-60 w-60 object-cover"
                  />
                </View>
              </View>
              <View className="mt-4 flex-row items-end justify-between">
                <View>
                  <Text className={`text-aref font-medium" text-lg ${textPrimary} `}>Cancer</Text>
                  <Text className={`text-sm  ${textSecondary}`}>Sun sign</Text>
                </View>
                <View className="items-end">
                  <Text className={`text-aref font-medium" text-lg ${textPrimary} `}>Leo</Text>

                  <Text className={`text-aref text-sm  ${textSecondary} `}>Moon sign</Text>
                </View>
              </View>
            </View>

            <View className={`mb-8 rounded-xl border p-6 ${borderColor} ${cardBg}`}>
              <Text className={`text-aref mb-3 text-lg font-medium ${textPrimary}`}>
                Affirmation
              </Text>
              <Text className={`text-aref ${textSecondary}`} style={{ lineHeight: 24 }}>
                I can be a masterpiece and a work in progress at the same time
              </Text>
            </View>

            <View className="mb-8">
              <Text className={`text-aref mb-4 text-lg font-medium ${textPrimary}`}>
                Your today's horoscope
              </Text>
              <Text className={`text-aref text-sm ${textSecondary}`} style={{ lineHeight: 20 }}>
                Today, you can see how your daily routine has changed your life. Your physical and
                mental health is directly related to your personal transformation. Making sure that
                you are taken care of - body and mind - should be part of your schedule. That is
                just
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
