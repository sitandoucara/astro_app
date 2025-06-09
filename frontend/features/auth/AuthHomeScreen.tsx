import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function AuthHomeScreen({ navigation }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';

  return (
    <View className="flex-1  bg-[#F2EAE0] p-16">
      <View className="mt-10 flex-1 justify-between">
        <View className="mt-5 items-center">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 280, height: 280 }}
            resizeMode="contain"
          />
        </View>
        <View className="mb-5 mt-10 ">
          <View className="mb-8">
            <Text className={`text-aref mb-4 text-center text-4xl font-medium text-light-text1`}>
              Welcome
            </Text>
            <Text
              className={`text-aref text-center text-sm text-[#7B635A]`}
              style={{ lineHeight: 20 }}>
              You are on the path to discovering yourself. LunaFlame will help you live in harmony
              with the Universe.
            </Text>
          </View>

          {/*inscription*/}
          <View className="w-full flex-row items-center justify-center gap-2">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className={`h-3 w-3 rounded-full  bg-light-cardback `} />
              <View className={`h-4 w-4 rounded-full   bg-light-cardback `} />
            </View>

            <View className={`rounded-full border-2 border-light-border  p-2 `}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                activeOpacity={0.8}
                className="shadow-opacity-30  elevation-1 rounded-full bg-[#BFB0A7] px-16  py-3 shadow-md shadow-light-text2">
                <Text
                  className={`text-aref text-center text-xl font-bold tracking-wide  text-[#281109] `}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className={`h-4 w-4 rounded-full  bg-light-cardback `} />
              <View className={`h-3 w-3 rounded-full   bg-light-cardback `} />
            </View>
          </View>

          {/*connexion*/}
          <View className="mt-4 w-full flex-row items-center justify-center gap-2">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className={`h-1 w-8 rounded-full  bg-[#281109] `} />
              <View className={`h-4 w-4 rounded-full   bg-[#281109] `} />
            </View>

            <View className={`rounded-full border-2 border-light-border  p-2 `}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.8}
                className="shadow-opacity-30  elevation-1 rounded-full bg-[#281109] px-8  py-3 shadow-lg shadow-[#281109]">
                <Text
                  className={`text-aref text-center text-base font-bold tracking-wide  text-[#BFB0A7] `}>
                  Already have an account
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className={`h-4 w-4 rounded-full  bg-[#281109] `} />
              <View className={`h-1 w-8 rounded-full   bg-[#281109] `} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
