import { Ionicons } from '@expo/vector-icons';
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
    const { error } = await signIn(email, password, dispatch);
    if (error) {
      alert(error.message);
    } else {
      navigation.replace('App');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0]">
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <Text className="mt-2 text-sm font-bold italic text-[#32221E]">Sign in</Text>

      <View className="mt-10 space-y-4">
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@gmail.com"
          placeholderTextColor="#281109"
          className="mt-2 w-64 rounded-full bg-white px-5 py-3 text-center"
        />
        <View className="relative mt-2 w-64">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#281109"
            secureTextEntry={!isPasswordVisible}
            className="w-64 rounded-full bg-white px-5 py-3 text-center"
          />
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#281109" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full bg-white py-3"
          onPress={handleLogin}>
          <Text className="font-bold text-[#281109]">Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text className="mt-4 text-center font-bold text-[#7B635A]">
            New here? <Text className="text-[#281109]">Create an Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
