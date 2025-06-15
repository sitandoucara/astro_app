import { Ionicons } from '@expo/vector-icons';
import { useState, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAppSelector } from 'shared/hooks';

import StepOne from './components/StepOne';
import StepThree from './components/StepThree';
import StepTwo from './components/StepTwo';
import { signUp } from './useAuth';
import { LocationResult } from '../../shared/hooks/useLocationSearch';

export default function SignUpScreen({ navigation }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconColor = isDarkMode ? '#281109' : '#F2EAE0';

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
      alert('Please fill all fields');
      return;
    }
    try {
      const lat = selectedPlace.lat;
      const lon = selectedPlace.lon;
      const res = await fetch(`http://localhost:4000/api/timezone?lat=${lat}&lon=${lon}`);
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
        alert(error.message);
      } else {
        alert('Account created!');
        navigation.navigate('SignIn');
      }
    } catch (err) {
      console.error('Timezone error:', err);
      alert('Unable to fetch timezone');
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
            <Ionicons name="arrow-back" size={24} color={iconColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              {titles[step - 1] || ''}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, step, iconColor, textColor]);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
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
  );
}
