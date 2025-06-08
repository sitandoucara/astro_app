import { useLayoutEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
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

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const titleColor = isDarkMode ? '#7B635A' : '#D8C8B4';
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: textColor }}>
          Hi {user?.username ?? 'You'}!
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  const [activeTab, setActiveTab] = useState<string>('TODAY');

  const tabs: TimeTab[] = [
    { id: 'YESTERDAY', label: 'YESTERDAY', active: false },
    { id: 'TODAY', label: 'TODAY', active: true },
    { id: 'TOMORROW', label: 'TOMORROW', active: false },
    { id: 'WEEK', label: 'WEEK', active: false },
    { id: 'MONTH', label: 'MONTH', active: false },
    { id: '2025', label: '2025', active: false },
    { id: '2026', label: '2026', active: false },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <ScrollView className="flex-1 " style={{ backgroundColor }}>
      <ScrollView horizontal className="mt-8" showsHorizontalScrollIndicator={false}>
        {tabs.map((tab, index) => (
          <View key={tab.id} className="flex-row items-center ">
            <TouchableOpacity onPress={() => handleTabClick(tab.id)} className="relative  pb-1">
              <Text
                className="text-aref text-sm font-medium tracking-wide"
                style={{
                  color: activeTab === tab.id ? '#32221E' : '#7F726C',
                }}>
                {tab.label}
              </Text>
              {activeTab === tab.id && (
                <View
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: '#32221E' }}
                />
              )}
            </TouchableOpacity>
            {index < tabs.length - 1 && <Text className="mx-6 text-xs text-stone-400">•</Text>}
          </View>
        ))}
      </ScrollView>

      {/* ---- Content ---- change */}
      <View className="mt-8 flex-1 p-2 ">
        {/* Date and Moon Phase */}
        <View className="mb-8 flex-row items-start justify-between">
          <View>
            <Text className="text-aref text-xl font-light text-stone-600">19 May 2025</Text>
            <Text className="text-aref mt-1 text-sm text-stone-500">Horoscope Date</Text>
          </View>
          <View className="items-end">
            <Text className="text-aref text-xl font-light text-stone-600">Waning Gibbous</Text>
            <Text className="text-aref mt-1 text-sm text-stone-500">Moon Phase</Text>
          </View>
        </View>

        {/* Moon and Zodiac Signs */}
        <View className="mb-8">
          <View className="relative items-center">
            {/* Cancer sign - left side */}
            <View className="absolute left-0 z-10" style={{ top: '50%', marginTop: -16 }}>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-stone-700">
                <MaterialCommunityIcons name="zodiac-capricorn" size={20} color="#F2EAE0" />
              </View>
            </View>

            {/* Leo sign - right side */}
            <View className="absolute right-0 z-10" style={{ top: '50%', marginTop: -16 }}>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-stone-700">
                <MaterialCommunityIcons name="zodiac-cancer" size={20} color="#F2EAE0" />
              </View>
            </View>

            {/* Moon Image */}
            <View className="h-60 w-60">
              <Image
                source={require('../../assets/moon.png')}
                alt="Moon phase"
                className="h-60 w-60 object-cover"
              />
            </View>
          </View>

          {/* Zodiac Signs Labels */}
          <View className="mt-4 flex-row items-end justify-between">
            <View>
              <Text className="text-aref text-lg font-medium text-stone-700">Cancer</Text>
              <Text className="text-sm text-stone-500">Sun sign</Text>
            </View>
            <View className="items-end">
              <Text className="text-aref text-lg font-medium text-stone-700">Leo</Text>
              <Text className="text-aref text-sm text-stone-500">Moon sign</Text>
            </View>
          </View>
        </View>

        {/* Affirmation */}
        <View className="mb-8 rounded-xl border border-[#281109] bg-[#91837C]  p-6">
          <Text className="text-aref mb-3 text-lg font-medium text-[#281109]">Affirmation</Text>
          <Text className="text-aref text-[#E8E6E4]" style={{ lineHeight: 24 }}>
            I can be a masterpiece and a work in progress at the same time
          </Text>
        </View>

        {/* Horoscope */}
        <View className="mb-8">
          <Text className="text-aref mb-4 text-lg font-medium text-stone-700">
            Your today's horoscope
          </Text>
          <Text className="text-aref text-sm text-stone-600" style={{ lineHeight: 20 }}>
            Today, you can see how your daily routine has changed your life. Your physical and
            mental health is directly related to your personal transformation. Making sure that you
            are taken care of - body and mind - should be part of your schedule. That is just
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
