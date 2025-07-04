import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useThemeColors } from 'shared/theme/theme-color.hook';

import { signUp } from '../auth.hook';
import StepOne from './components/step-one.component';
import StepThree from './components/step-three.component';
import StepTwo from './components/step-two.component';
import { LocationResult } from '../../../shared/location/location.hook';
import NoiseOverlay from 'shared/components/noise-overlay.component';

export default function SignUpScreen({ navigation }: any) {
  const colors = useThemeColors();

  const { alertConfig, hideAlert, showError, showAlert } = useCustomAlert();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    gender: null as string | null,
    birthplaceQuery: '',
    selectedPlace: null as LocationResult | null,
    dateOfBirth: null as Date | null,
    timeOfBirth: null as Date | null,
  });

  const updateForm = (data: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const goToNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const submitForm = async () => {
    const { email, password, username, dateOfBirth, timeOfBirth, selectedPlace, gender } = formData;
    if (!dateOfBirth || !timeOfBirth || !selectedPlace || !gender) {
      showError('Missing Information', 'Please fill all fields');
      return;
    }
    try {
      const lat = selectedPlace.lat;
      const lon = selectedPlace.lon;
      const res = await fetch(
        `https://astro-app-eight-chi.vercel.app/api/timezone?lat=${lat}&lon=${lon}`
      );

      const tzData = await res.json();
      if (!res.ok) throw new Error(tzData.error || 'Failed to get timezone');
      const { name: timezoneName, timezone: timezoneOffset } = tzData;
      const { error } = await signUp(
        email,
        password,
        username,
        dateOfBirth,
        timeOfBirth,
        selectedPlace.display_name,
        timezoneName,
        timezoneOffset,
        parseFloat(lat),
        parseFloat(lon),
        gender
      );
      if (error) {
        console.error('Signup error:', error);

        showError('Signup Error', error.message);
      } else {
        showAlert({
          title: 'Account Created!',
          message: 'Your account has been successfully created.',
          actions: [
            {
              text: 'Continue to Sign In',
              style: 'edit-style',
              onPress: () => navigation.navigate('SignIn'),
            },
          ],
          icon: null,
        });
      }
    } catch (err) {
      console.error('Timezone error:', err);

      showError('Timezone Error', 'Unable to fetch timezone information');
    }
  };

  useLayoutEffect(() => {
    const titles = ['Welcome to AstroMood', 'About you', 'Birth details'];

    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',

      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => {
            if (step > 1) {
              goBack();
            } else {
              navigation.goBack();
            }
          }}>
          <View className="flex-row gap-2">
            <Ionicons name="chevron-back" size={24} color={colors.iconColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              {titles[step - 1] || ''}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, step, colors]);

  return (
    <NoiseOverlay intensity={1}>
      <View className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
        {step === 1 && <StepOne formData={formData} updateForm={updateForm} onNext={goToNext} />}
        {step === 2 && (
          <StepTwo formData={formData} updateForm={updateForm} onNext={goToNext} onBack={goBack} />
        )}
        {step === 3 && (
          <StepThree
            formData={formData}
            updateForm={updateForm}
            onBack={goBack}
            onSubmit={submitForm}
          />
        )}
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={hideAlert}
        icon={
          alertConfig.title === 'Account Created!' ? (
            <MaterialIcons name="check-circle" size={42} color="#10B981" />
          ) : undefined
        }
      />
    </NoiseOverlay>
  );
}
