import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { useThemeColors } from 'shared/hooks/useThemeColors';

export default function ExploreScreen() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const colors = useThemeColors();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px]" style={{ color: colors.textColor }}>
          You can Explore
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode]);

  return (
    <View
      className="flex-1 items-center justify-center px-2"
      style={{ backgroundColor: colors.backgroundColor }}>
      {/* Learn */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('LearnScreen')}
        className={`w-full rounded-3xl p-6 ${colors.cardBg} border ${colors.borderColor} mb-4`}>
        <View className="justify-center">
          <View className="h-16 w-16 items-center justify-center">
            <View
              className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
              <FontAwesome name="book" size={20} style={{ color: colors.iconColorAlt }} />
            </View>
          </View>

          <View>
            <Text className={`text-aref text-xl font-semibold ${colors.textPrimary} mb-2`}>
              Learn
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt}`}>
              Discover Astrology
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Test & Quiz */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('QuizzScreen')}
        className={`w-full rounded-3xl p-6 ${colors.cardBg} border ${colors.borderColor} mb-4`}>
        <View className="justify-center">
          <View className="h-16 w-16 items-center justify-center">
            <View
              className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
              <MaterialCommunityIcons
                name="gamepad-variant"
                size={20}
                style={{ color: colors.iconColorAlt }}
              />
            </View>
          </View>
          <View>
            <Text className={`text-aref text-xl font-semibold ${colors.textPrimary} mb-2`}>
              Test & Quiz
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt}`}>
              Test Your Astrology Knowlege
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/*Mini books */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Alert.alert('Zodiac Sign Compatibility clicked!')}
        className={`w-full rounded-3xl p-6 ${colors.cardBg} border ${colors.borderColor} mb-4`}>
        <View className="justify-center">
          <View className="h-16 w-16 items-center justify-center">
            <View
              className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${colors.iconBg}`}>
              <MaterialCommunityIcons
                name="book"
                size={20}
                style={{ color: colors.iconColorAlt }}
              />
            </View>
          </View>

          <View>
            <Text className={`text-aref text-xl font-semibold ${colors.textPrimary} mb-2`}>
              Mini-books
            </Text>
            <Text className={`text-aref text-sm ${colors.textSecondaryAlt}`}>
              Know more about Astrology
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
