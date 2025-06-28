import { useZodiacCompatibility } from 'features/compatibility/zodiac-signs-compatibility/zodiac-compatibility.hook';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemeColors } from 'shared/theme/theme-color.hook';

import { useHoroscope } from '../hooks/horoscope.hook';

interface HoroscopeSectionProps {
  activeTab: string;
  isPremiumTab: (tabId: string) => boolean;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({ activeTab, isPremiumTab }) => {
  const { userSign } = useZodiacCompatibility();
  const { horoscopeData, loading, error, fetchHoroscope, getHoroscopeTitle } = useHoroscope();

  const colors = useThemeColors();

  const currentUserSign = userSign || 'Cancer';

  // Load the horoscope when the active tab or sign changes
  useEffect(() => {
    if (currentUserSign && !isPremiumTab(activeTab)) {
      fetchHoroscope(currentUserSign, activeTab);
    }
  }, [activeTab, currentUserSign]);

  const renderHoroscopeContent = () => {
    if (loading) {
      return (
        <View className="mb-8 items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.textColor} />
          <Text className={`text-aref mt-2 text-sm ${colors.textSecondary}`}>
            Loading your horoscope...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="mb-8">
          <View className={`rounded-xl border p-6 ${colors.borderColor} ${colors.cardBg}`}>
            <Text className={`text-aref mb-3 text-lg font-medium ${colors.textPrimary}`}>
              {getHoroscopeTitle(activeTab)}
            </Text>
            <Text className={`text-aref ${colors.textthree}`} style={{ lineHeight: 24 }}>
              Sorry, we couldn't load your horoscope right now. Please try again later.
            </Text>
            <Text className={`text-aref text-xs ${colors.textthree} mt-2 opacity-70`}>
              Error: {error}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View className="mb-8">
        <View className={`rounded-xl border p-6 ${colors.borderColor} ${colors.cardBg}`}>
          <Text className={`text-aref mb-3 text-lg font-medium ${colors.textPrimary}`}>
            {getHoroscopeTitle(activeTab)}
          </Text>
          <Text className={`text-aref ${colors.textthree}`} style={{ lineHeight: 24 }}>
            {horoscopeData?.horoscope_data || 'Your horoscope will appear here...'}
          </Text>
          {horoscopeData?.date && (
            <Text className={`text-aref text-xs ${colors.textthree} mt-2 opacity-70`}>
              Date: {horoscopeData.date}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return <>{renderHoroscopeContent()}</>;
};
