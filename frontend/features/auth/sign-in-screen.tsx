import { Ionicons } from '@expo/vector-icons';
import { setLoading } from 'features/auth/auth.slice';
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
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useAppDispatch, useAppSelector } from 'shared/hooks';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useThemeColors } from 'shared/theme/theme-color.hook';

import { signIn } from './auth.hook';

export default function SignInScreen({ navigation }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();

  const { alertConfig, hideAlert, showError } = useCustomAlert();

  const logoSource = {
    uri: isDarkMode
      ? 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_light.png'
      : 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/logo_dark.png',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    dispatch(setLoading(true));

    const { data, error } = await signIn(email, password, dispatch);

    if (error) {
      console.log('Connection error:', error.message);
      dispatch(setLoading(false));
      showError('Connection Error', error.message);
      return;
    }

    console.log('Connection successful:', data?.user);

    await new Promise((resolve) => setTimeout(resolve, 500));

    dispatch(setLoading(false));
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
    <>
      <KeyboardAvoidingView
        className="flex-1"
        style={{ backgroundColor: colors.backgroundColor }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 p-16">
          <View className="mt-10 flex-1 justify-between">
            <Animated.View style={logoStyle} className="mt-5 items-center">
              <Animated.View entering={FadeInUp.duration(1000)} className="mt-5 items-center">
                <Image
                  source={logoSource}
                  style={{ width: 280, height: 280 }}
                  resizeMode="contain"
                />
              </Animated.View>
            </Animated.View>

            <Animated.View style={inputContainerStyle} className="mb-5 mt-10 items-center">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="email@gmail.com"
                placeholderTextColor={colors.placeholderColor}
                className={`text-aref mt-2 w-64 rounded-lg border ${colors.border} ${colors.bgInput} px-5 py-3 ${colors.textPrimary}`}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View className="relative mt-2 w-64">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.placeholderColor}
                  secureTextEntry={!isPasswordVisible}
                  className={`text-aref w-64 rounded-lg border ${colors.border} ${colors.bgInput} px-5 py-3 ${colors.textPrimary}`}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={22}
                    style={{ color: colors.iconColorAlt2 }}
                  />
                </TouchableOpacity>
              </View>

              <View className="mt-4 rounded-full border-2 border-stone-600 p-2">
                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  className={`shadow-opacity-30 elevation-1 w-64 rounded-full ${colors.bgButton} py-2 shadow-md shadow-light-text2`}>
                  <Text
                    className={`text-aref text-center text-base font-bold tracking-wide ${colors.buttonTextColor}`}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} className="mt-4">
                <Text className={`text-aref mt-4 text-center font-bold ${colors.textSecondary}`}>
                  New here? <Text className={colors.textPrimary}>Create an Account</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={hideAlert}
      />
    </>
  );
}
