// components/StepOne.tsx
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function StepOne({ formData, updateForm, onNext }: any) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const onEmailChange = (text: string) => {
    updateForm({ email: text });
    if (emailError && validateEmail(text)) setEmailError('');
  };

  const onEmailBlur = () => {
    if (!validateEmail(formData.email)) setEmailError('Invalid email format');
    else setEmailError('');
  };

  const onPasswordChange = (text: string) => {
    updateForm({ password: text });
    if (passwordError && validatePassword(text)) setPasswordError('');
  };

  const onPasswordBlur = () => {
    if (!validatePassword(formData.password))
      setPasswordError('Password must be at least 6 characters');
    else setPasswordError('');
  };

  const isValid =
    formData.email.length > 0 &&
    formData.password.length > 0 &&
    validateEmail(formData.email) &&
    validatePassword(formData.password);

  return (
    <View className="flex-1 items-center justify-center space-y-6">
      <View className="mb-4 w-full items-center">
        <View className="mb-2 flex-row space-x-2">
          <View className="h-2 w-10 rounded-full bg-[#281109]" />
          <View className="h-2 w-10 rounded-full bg-[#281109]/50" />
          <View className="h-2 w-10 rounded-full bg-[#281109]/50" />
        </View>
        <Text className="text-xl font-bold text-[#32221E]">Welcome to AstroMood</Text>
        <Text className="text-sm text-[#7B635A]">Let’s start your cosmic journey</Text>
      </View>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#281109"
        value={formData.email}
        onChangeText={onEmailChange}
        onBlur={onEmailBlur}
        className="w-64 rounded-full bg-white px-5 py-3 text-center"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="relative mt-2 w-64">
        <TextInput
          placeholder="Password"
          placeholderTextColor="#281109"
          secureTextEntry={!isPasswordVisible}
          value={formData.password}
          onChangeText={onPasswordChange}
          onBlur={onPasswordBlur}
          className="w-64 rounded-full bg-white px-5 py-3 text-center"
        />
        <TouchableOpacity
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onPress={() => setIsPasswordVisible((v) => !v)}>
          <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#281109" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={!isValid}
        className={`mt-5 w-64 rounded-full py-3 ${isValid ? 'bg-[#32221E]' : 'bg-[#32221E]/50'}`}>
        <Text className="text-center font-bold text-white">Continue</Text>
      </TouchableOpacity>

      {emailError ? <Text className="text-sm text-red-600">{emailError}</Text> : null}
      {passwordError ? <Text className="text-sm text-red-600">{passwordError}</Text> : null}
    </View>
  );
}
