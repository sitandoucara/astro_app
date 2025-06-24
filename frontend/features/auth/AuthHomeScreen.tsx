import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';

export default function AuthHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-[#F6D5C1]';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';
  const textButton1 = isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]';
  const textButton2 = isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]';
  const bgButton = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const bgButton2 = isDarkMode ? 'bg-[#281109]' : 'bg-[#F6D5C1]';
  const border = isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]';
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';

  const logoSource = isDarkMode
    ? require('../../assets/logo_light.png')
    : require('../../assets/logo_dark.png');

  return (
    <View className="flex-1 p-16" style={{ backgroundColor }}>
      <View className="mt-10 flex-1 justify-between">
        <Animated.View entering={FadeInUp.duration(1000)} className="mt-5 items-center">
          <Image source={logoSource} style={{ width: 280, height: 280 }} resizeMode="contain" />
        </Animated.View>

        <View className="mb-5 mt-10 ">
          <View className="mb-8">
            <Text className={`text-aref mb-4 text-center text-4xl font-medium ${textPrimary}`}>
              Welcome
            </Text>
            <Text
              className={`text-aref text-center text-sm text-[#7B635A] ${textSecondary}`}
              style={{ lineHeight: 20 }}>
              You are on the path to discovering yourself. LunaFlame will help you live in harmony
              with the Universe.
            </Text>
          </View>

          {/* registration */}
          <Animated.View entering={FadeInUp.delay(300).duration(1000)}>
            <View className="w-full flex-row items-center justify-center gap-2">
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <View className={`h-3 w-3 rounded-full ${bgButton}  `} />
                <View className={`h-4 w-4 rounded-full   ${bgButton}  `} />
              </View>
              <View className={`rounded-full border-2 ${border}  p-2 `}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUp')}
                  activeOpacity={0.8}
                  className={`shadow-opacity-30  elevation-1 rounded-full ${bgButton} px-16  py-3 shadow-md shadow-light-text2`}>
                  <Text
                    className={`text-aref text-center text-xl font-bold tracking-wide   ${textButton1}`}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <View className={`h-4 w-4 rounded-full  ${bgButton}  `} />
                <View className={`h-3 w-3 rounded-full   ${bgButton}  `} />
              </View>
            </View>

            {/*connection*/}
            <View className="mt-4 w-full flex-row items-center justify-center gap-2">
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <View className={`h-1 w-8 rounded-full  ${bgButton2}  `} />
                <View className={`h-4 w-4 rounded-full   ${bgButton2}  `} />
              </View>
              <View className={`rounded-full border-2 ${border}   p-2 `}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignIn')}
                  activeOpacity={0.8}
                  className={`shadow-opacity-30  elevation-1 rounded-full ${bgButton2} px-8  py-3 shadow-lg shadow-[#281109]`}>
                  <Text
                    className={`text-aref text-center text-base font-bold tracking-wide  ${textButton2} `}>
                    Already have an account
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <View className={`h-4 w-4 rounded-full  ${bgButton2}  `} />
                <View className={`h-1 w-8 rounded-full   ${bgButton2}  `} />
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
