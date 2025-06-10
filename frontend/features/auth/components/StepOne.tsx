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
    <View className="flex-1 p-10">
      <View className="mt-20 flex-1 justify-between">
        <View className="mb-4 w-full items-center">
          <View className="mb-2 flex-row gap-2">
            <View className="h-1 w-32 rounded-full bg-[#281109]" />
            <View className="h-1 w-32 rounded-full bg-[#281109]/50" />
            <View className="h-1 w-32 rounded-full bg-[#281109]/50" />
          </View>
          <Text className="text-aref text-sm text-[#7B635A]">Let’s start your cosmic journey</Text>
        </View>

        <View className="mb-36 items-center">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#281109"
            value={formData.email}
            onChangeText={onEmailChange}
            onBlur={onEmailBlur}
            className="text-aref w-64 rounded-lg border border-[#5B453D] bg-[#91837C] px-5 py-3 text-left"
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
              className="text-aref w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
            />
            <TouchableOpacity
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onPress={() => setIsPasswordVisible((v) => !v)}>
              <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#281109" />
            </TouchableOpacity>
          </View>
          <View className="mt-4 rounded-full border-2  border-stone-600 p-2">
            <TouchableOpacity
              onPress={onNext}
              disabled={!isValid}
              activeOpacity={0.8}
              className={`shadow-opacity-30  elevation-1 w-64  rounded-full py-2  shadow-md shadow-light-text2  ${isValid ? 'bg-[#32221E]' : 'bg-[#32221E]/50'}`}>
              <Text className="text-aref text-center  text-base font-bold tracking-wide text-white">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          {emailError ? <Text className="text-sm text-red-600">{emailError}</Text> : null}
          {passwordError ? <Text className="text-sm text-red-600">{passwordError}</Text> : null}
        </View>
      </View>
    </View>
  );
}
