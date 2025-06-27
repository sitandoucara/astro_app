import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';
import { useThemeColors } from 'shared/hooks/useThemeColors';

interface CompatibilityResultsProps {
  userSign: string;
  partnerSign: string;
  username: string;
  compatibilityData: any;
  onTryAnother: () => void;
}

export default function CompatibilityResults({
  userSign,
  partnerSign,
  username,
  compatibilityData,
  onTryAnother,
}: CompatibilityResultsProps) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();

  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName.toLowerCase()}_${theme}.png`;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
      <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
        {/* Header with the two signs */}
        <Animated.View entering={FadeInDown.duration(500)} className="mb-4 mt-8 items-center">
          <View
            className={`items-center rounded-3xl p-8 ${colors.cardBg} border ${colors.borderColor} mb-2`}>
            <View className="mb-3 flex-row items-center justify-center">
              <View className="items-center">
                <Image
                  source={{ uri: getSignImageUrl(userSign) }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="contain"
                />
                <Text className={`text-aref mt-2 text-sm font-bold ${colors.textPrimary}`}>
                  You ({userSign})
                </Text>
              </View>

              <View className="mx-8">
                <MaterialCommunityIcons name="heart" size={32} color={colors.textColor} />
              </View>

              <View className="items-center">
                <Image
                  source={{ uri: getSignImageUrl(partnerSign) }}
                  style={{ width: 60, height: 60 }}
                  resizeMode="contain"
                />
                <Text className={`text-aref mt-2 text-sm font-bold ${colors.textPrimary}`}>
                  {username} ({partnerSign})
                </Text>
              </View>
            </View>

            <Text className={`text-aref text-lg font-semibold ${colors.textPrimary} text-center`}>
              Compatibility Analysis
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt} mt-1 text-center`}>
              {userSign} × {partnerSign}
            </Text>
          </View>
        </Animated.View>

        {/* Compatibility results */}
        <Animated.View entering={SlideInLeft.duration(600)}>
          <View>
            {Object.entries(compatibilityData).map(([key, info]: [string, any], index) => (
              <Animated.View
                key={key}
                entering={FadeInUp.delay(index * 150).duration(500)}
                className={`mt-2 rounded-3xl border ${colors.cardBg} ${colors.borderColor} p-6`}>
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name={info.icon as any}
                      size={24}
                      color={colors.textColor}
                    />
                    <Text className={`text-aref ml-3 text-lg font-bold ${colors.textPrimary}`}>
                      {info.title}
                    </Text>
                  </View>
                  <Text className={`text-aref text-xl font-bold ${colors.textPrimary}`}>
                    {info.compatibility}%
                  </Text>
                </View>

                {/* Progress bar */}
                <View
                  className={`mb-3 h-2 w-full rounded-full ${isDarkMode ? 'bg-[#D8D3D0]' : 'bg-[#544A46]'}`}>
                  <View
                    className={`h-full rounded-full ${isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]'}`}
                    style={{
                      width: `${info.compatibility}%`,
                    }}
                  />
                </View>

                <Text className={`text-aref text-sm ${colors.textSecondaryAlt}`}>
                  {info.description}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Button to start again */}
        <Animated.View entering={SlideInRight.duration(700)} className="mb-8 mt-8">
          <TouchableOpacity
            onPress={onTryAnother}
            className={`w-full items-center rounded-2xl p-4 ${colors.cardBg} border ${colors.borderColor}`}
            activeOpacity={0.8}>
            <View className="flex-row items-center">
              <MaterialIcons name="refresh" size={24} color={colors.textColor} />
              <Text className={`text-aref ml-3 text-lg font-semibold ${colors.textPrimary}`}>
                Try Another Person
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
