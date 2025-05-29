import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';

import { signIn } from './useAuth';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#281109"
          secureTextEntry={!isPasswordVisible}
          className="mt-2 w-64 rounded-full bg-white px-5 py-3 text-center"
        />

        <TouchableOpacity
          className="absolute right-10 top-[188px]"
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#B84A8E" />
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full bg-white py-3"
          onPress={async () => {
            const { error } = await signIn(email, password);
            if (error) {
              alert(error.message);
            } else {
              navigation.navigate('App');
            }
          }}>
          <Text className="font-bold text-[#281109]">Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text className="mt-4 text-center font-bold text-white">
            New here? <Text className="text-[#281109]">Create an Account</Text>{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
