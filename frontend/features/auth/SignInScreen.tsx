import { Ionicons } from '@expo/vector-icons';
import { generateChart } from 'features/chart/GenerateChart';
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { useAppDispatch } from 'shared/hooks';

import { signIn } from './useAuth';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    console.log('Connexion en cours...');
    const { data, error } = await signIn(email, password, dispatch);

    if (error) {
      console.log('Erreur de connexion:', error.message);
      alert(error.message);
    } else {
      const user = data?.user;
      console.log('Connexion réussie:', user);

      if (user && !user.user_metadata?.birthChartUrl) {
        console.log('BirthChart manquant, génération...');

        const metadata = user.user_metadata;

        const chartPayload = {
          id: user.id,
          dateOfBirth: metadata.dateOfBirth,
          timeOfBirth: metadata.timeOfBirth,
          latitude: metadata.latitude,
          longitude: metadata.longitude,
          timezoneOffset: metadata.timezoneOffset,
        };

        console.log('Données envoyées pour le chart :', chartPayload);

        await generateChart(chartPayload);
      } else {
        console.log('BirthChart déjà existant');
      }

      navigation.replace('App');
    }
  };

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

        <View className="mb-5 mt-10 items-center">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@gmail.com"
            placeholderTextColor="#281109"
            className="text-aref mt-2 w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
          />
          <View className="relative mt-2 w-64">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#281109"
              secureTextEntry={!isPasswordVisible}
              className="text-aref w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
            />
            <TouchableOpacity
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#281109" />
            </TouchableOpacity>
          </View>

          <View className="mt-4 rounded-full border-2  border-stone-600 p-2">
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              className="shadow-opacity-30  elevation-1 w-64  rounded-full bg-[#32221E]  py-2 shadow-md shadow-light-text2">
              <Text className="text-aref text-center  text-base font-bold tracking-wide text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="mt-4">
            <Text className="text-aref mt-4  text-center font-bold text-[#7B635A]">
              New here? <Text className="text-[#281109]">Create an Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
