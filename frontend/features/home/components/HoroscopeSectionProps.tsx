import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { useZodiacCompatibility } from 'shared/hooks/useZodiacCompatibility';

import { useHoroscope } from '../hooks/useHoroscope';

interface HoroscopeSectionProps {
  activeTab: string;
  isPremiumTab: (tabId: string) => boolean;
}

export const HoroscopeSection: React.FC<HoroscopeSectionProps> = ({ activeTab, isPremiumTab }) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { userSign } = useZodiacCompatibility();
  const { horoscopeData, loading, error, fetchHoroscope, getHoroscopeTitle } = useHoroscope();

  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';
  const textthree = isDarkMode ? 'text-[#ffff]' : 'text-[#ffffff]';

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
          <ActivityIndicator size="large" color={textColor} />
          <Text className={`text-aref mt-2 text-sm ${textSecondary}`}>
            Loading your horoscope...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="mb-8">
          <View className={`rounded-xl border p-6 ${borderColor} ${cardBg}`}>
            <Text className={`text-aref mb-3 text-lg font-medium ${textPrimary}`}>
              {getHoroscopeTitle(activeTab)}
            </Text>
            <Text className={`text-aref ${textthree}`} style={{ lineHeight: 24 }}>
              Sorry, we couldn't load your horoscope right now. Please try again later.
            </Text>
            <Text className={`text-aref text-xs ${textthree} mt-2 opacity-70`}>Error: {error}</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="mb-8">
        <View className={`rounded-xl border p-6 ${borderColor} ${cardBg}`}>
          <Text className={`text-aref mb-3 text-lg font-medium ${textPrimary}`}>
            {getHoroscopeTitle(activeTab)}
          </Text>
          <Text className={`text-aref ${textthree}`} style={{ lineHeight: 24 }}>
            {horoscopeData?.horoscope_data || 'Your horoscope will appear here...'}
          </Text>
          {horoscopeData?.date && (
            <Text className={`text-aref text-xs ${textthree} mt-2 opacity-70`}>
              Date: {horoscopeData.date}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return <>{renderHoroscopeContent()}</>;
};
