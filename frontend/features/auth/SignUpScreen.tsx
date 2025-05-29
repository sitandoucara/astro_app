import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native';

import { signUp } from './useAuth';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
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
      <Text className="mt-2 text-sm font-bold italic text-[#32221E]">Create an Account</Text>

      <View className="mt-10 space-y-4">
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#281109"
          className="mt-2 w-64 rounded-full bg-white px-5 py-3 text-center"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
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
          className="absolute right-10 top-[240px]"
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#281109" />
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full bg-white py-3"
          onPress={async () => {
            const { data, error } = await signUp(email, password, username);
            if (error) {
              alert(error.message);
            } else {
              alert('Account created!');
              navigation.navigate('SignIn');
            }
          }}>
          <Text className="font-bold text-[#281109]">Create</Text>{' '}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text className="mt-4 text-center font-bold text-white">
            Already have an account? <Text className="text-[#281109]">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
