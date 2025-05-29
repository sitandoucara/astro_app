import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function AuthHomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0]">
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />

      <Text className="mt-6 text-xs font-bold italic text-[#32221E]">Welcome !</Text>

      <View className="mt-10 space-y-4">
        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full bg-white py-3"
          onPress={() => navigation.navigate('SignUp')}>
          <Text className="font-bold text-[#281109]">CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full border-2 border-white py-3"
          onPress={() => navigation.navigate('SignIn')}>
          <Text className="font-bold text-white">SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full border-2 border-[#281109] py-3"
          onPress={() => navigation.navigate('App')}>
          <Text className="font-bold text-[#281109]">OTHER PAGE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
