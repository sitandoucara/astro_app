import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import NoiseOverlay from 'shared/components/noise-overlay.component';
import { useAppSelector } from 'shared/hooks';
import { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function AuthHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const colors = useThemeColors();

  const logoSource = {
    uri: isDarkMode
      ? 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_light.png'
      : 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_dark.png',
  };

  // Classes responsives
  const containerMarginBottom = isTablet ? 'mb-9' : 'mb-5';
  const containerMarginTop = isTablet ? 'mt-14' : 'mt-5';

  return (
    <NoiseOverlay intensity={1}>
      <View className="flex-1 p-16" style={{ backgroundColor: colors.backgroundColor }}>
        <View className={`flex-1 justify-between `}>
          <Animated.View
            entering={FadeInUp.duration(1000)}
            className={`${containerMarginTop} items-center`}>
            <Image source={logoSource} style={{ width: 280, height: 280 }} resizeMode="contain" />
          </Animated.View>

          <View className={`mt-10  ${containerMarginBottom}`}>
            <View className="mb-8">
              <Text
                className={`text-aref mb-4 text-center text-4xl font-medium ${colors.textPrimaryAlt}`}>
                Welcome
              </Text>
              <Text
                className={`text-aref text-center text-sm ${colors.textSecondary}`}
                style={{ lineHeight: 20 }}>
                You are on the path to discovering yourself. LunaFlame will help you live in harmony
                with the Universe.
              </Text>
            </View>

            {/* registration */}
            <Animated.View entering={FadeInUp.delay(300).duration(1000)}>
              <View className="w-full flex-row items-center justify-center gap-2">
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className={`h-3 w-3 rounded-full ${colors.bgButton}`} />
                  <View className={`h-4 w-4 rounded-full ${colors.bgButton}`} />
                </View>
                <View className={`rounded-full border-2 ${colors.border} p-2`}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    activeOpacity={0.8}
                    className={`shadow-opacity-30 elevation-1 rounded-full ${colors.bgButton} px-16 py-3 shadow-md shadow-light-text2`}>
                    <Text
                      className={`text-aref text-center text-xl font-bold tracking-wide ${colors.textButton1}`}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className={`h-4 w-4 rounded-full ${colors.bgButton}`} />
                  <View className={`h-3 w-3 rounded-full ${colors.bgButton}`} />
                </View>
              </View>

              {/*connection*/}
              <View className="mt-4 w-full flex-row items-center justify-center gap-2">
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className={`h-1 w-8 rounded-full ${colors.bgButton2}`} />
                  <View className={`h-4 w-4 rounded-full ${colors.bgButton2}`} />
                </View>
                <View className={`rounded-full border-2 ${colors.border} p-2`}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    activeOpacity={0.8}
                    className={`shadow-opacity-30 elevation-1 rounded-full ${colors.bgButton2} px-8 py-3 shadow-lg shadow-[#281109]`}>
                    <Text
                      className={`text-aref text-center text-base font-bold tracking-wide ${colors.textButton2}`}>
                      Already have an account
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center" style={{ gap: 8 }}>
                  <View className={`h-4 w-4 rounded-full ${colors.bgButton2}`} />
                  <View className={`h-1 w-8 rounded-full ${colors.bgButton2}`} />
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </NoiseOverlay>
  );
}
