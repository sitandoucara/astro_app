import { Ionicons } from '@expo/vector-icons';
import { setLoading, setGeneratingChart } from 'features/auth/AuthSlice';
import { generateChart } from 'features/chart/services/GenerateChart';
import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from 'shared/hooks';
import { supabase } from 'shared/lib/supabase';

import { signIn } from './useAuth';

export default function SignInScreen({ navigation }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';
  const border = isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]';
  const bgInput = isDarkMode ? 'bg-[#91837C]' : 'bg-[#584540]';
  const bgButton = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const buttonTextColor = isDarkMode ? 'text-dark-text1' : 'text-light-text1';
  const iconColor = isDarkMode ? '#281109' : '#F2EAE0';

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';

  const logoSource = isDarkMode
    ? require('../../assets/logo_light.png')
    : require('../../assets/logo_dark.png');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    console.log('Connexion en cours...');
    dispatch(setLoading(true));

    const { data, error } = await signIn(email, password, dispatch);

    if (error) {
      console.log('Connection error:', error.message);

      dispatch(setLoading(false));
      alert(error.message);
      return;
    }

    const user = data?.user;
    console.log('Connexion réussie:', user);

    if (user && !user.user_metadata?.birthChartUrl) {
      console.log('BirthChart manquant, génération...');
      dispatch(setGeneratingChart(true));

      const metadata = user.user_metadata;
      const chartPayload = {
        id: user.id,
        dateOfBirth: metadata.dateOfBirth,
        timeOfBirth: metadata.timeOfBirth,
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        timezoneOffset: metadata.timezoneOffset,
      };

      try {
        await generateChart(chartPayload);
        console.log('Chart généré avec succès');

        await supabase.auth.refreshSession();
      } catch (chartError: any) {
        console.error('Erreur génération chart:', chartError.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    dispatch(setLoading(false));
    dispatch(setGeneratingChart(false));

    await supabase.auth.getSession();
  };

  const keyboardOffset = useSharedValue(0);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      keyboardOffset.value = withSpring(-event.endCoordinates.height * 0.3, {
        damping: 20,
        stiffness: 200,
      });
      logoScale.value = withSpring(0.7, {
        damping: 20,
        stiffness: 200,
      });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      keyboardOffset.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
      logoScale.value = withSpring(1, {
        damping: 20,
        stiffness: 200,
      });
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: keyboardOffset.value,
        },
      ],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: logoScale.value,
        },
      ],
      opacity: interpolate(logoScale.value, [0.7, 1], [0.8, 1]),
    };
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1 p-16">
        <View className="mt-10 flex-1 justify-between">
          <Animated.View style={logoStyle} className="mt-5 items-center">
            <Animated.View entering={FadeInUp.duration(1000)} className="mt-5 items-center">
              <Image source={logoSource} style={{ width: 280, height: 280 }} resizeMode="contain" />
            </Animated.View>
          </Animated.View>

          <Animated.View style={inputContainerStyle} className="mb-5 mt-10 items-center">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@gmail.com"
              placeholderTextColor={isDarkMode ? '#281109' : '#ffffff'}
              className={`text-aref mt-2 w-64 rounded-lg border ${border} ${bgInput} px-5 py-3 ${textPrimary}`}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View className="relative mt-2 w-64">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? '#281109' : '#ffffff'}
                secureTextEntry={!isPasswordVisible}
                className={`text-aref w-64 rounded-lg border ${border} ${bgInput} px-5 py-3 ${textPrimary}`}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={22}
                  style={{ color: iconColor }}
                />
              </TouchableOpacity>
            </View>

            <View className="mt-4 rounded-full border-2 border-stone-600 p-2">
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.8}
                className={`shadow-opacity-30 elevation-1 w-64 rounded-full ${bgButton} py-2 shadow-md shadow-light-text2`}>
                <Text
                  className={`text-aref text-center text-base font-bold tracking-wide ${buttonTextColor}`}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="mt-4">
              <Text className={`text-aref mt-4 text-center font-bold ${textSecondary}`}>
                New here? <Text className={textPrimary}>Create an Account</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
