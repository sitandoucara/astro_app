import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useState, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import Animated, { FadeInUp, SlideInLeft, SlideInRight } from 'react-native-reanimated';
//import { useAppSelector } from 'shared/hooks';
import { useThemeColors } from 'shared/hooks/useThemeColors';
import { useZodiacCompatibility } from 'shared/hooks/useZodiacCompatibility';

import CompatibilityResults from './CompatibilityResults';

export default function ZodiacSignsCompatibility({ onBack }: any) {
  const [showDateModal, setShowDateModal] = useState(false);

  const {
    username,
    setUsername,
    gender,
    setGender,
    date,
    setDate,
    showCompatibility,
    partnerSign,
    userSign,
    compatibilityData,
    handleCheckCompatibility,
    resetCompatibility,
  } = useZodiacCompatibility();

  const navigation = useNavigation();
  //const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();

  const formatDate = (d: Date) => d.toLocaleDateString();

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: colors.backgroundColor,
      },
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={colors.textColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              {showCompatibility ? 'Compatibility Results' : 'Tell us about your beloved'}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.textColor, showCompatibility]);

  // Display results
  if (showCompatibility && userSign && partnerSign) {
    return (
      <CompatibilityResults
        userSign={userSign}
        partnerSign={partnerSign}
        username={username}
        compatibilityData={compatibilityData}
        onTryAnother={resetCompatibility}
      />
    );
  }

  return (
    <View
      className="flex-1 items-center justify-center p-10"
      style={{ backgroundColor: colors.backgroundColor }}>
      <View className="flex-1 items-center justify-center gap-2">
        {/* Input Username */}
        <Animated.View entering={SlideInLeft.duration(500)}>
          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.placeholderColor}
            value={username}
            onChangeText={setUsername}
            className={`text-aref w-64 rounded-lg border ${colors.inputBg} ${colors.textPrimary} ${colors.borderColor} px-5 py-3`}
          />
        </Animated.View>

        {/* Gender */}
        <Animated.View entering={SlideInRight.duration(600)} className="mt-4">
          <View className="flex-row justify-center gap-4">
            {['Male', 'Female', 'Other'].map((option, index) => {
              const iconName =
                option === 'Female'
                  ? 'female-sharp'
                  : option === 'Other'
                    ? 'male-female-sharp'
                    : 'male';
              const isSelected = gender === option;
              return (
                <Animated.View key={option} entering={FadeInUp.delay(index * 100).duration(400)}>
                  <TouchableOpacity
                    onPress={() => setGender(option)}
                    className={`rounded-md border px-4 py-2 ${isSelected ? colors.buttonBg : colors.inputBg} items-center`}>
                    <Ionicons name={iconName} size={40} color={isSelected ? '#BFB0A7' : 'white'} />
                    <Text
                      className={`text-aref mt-1 font-bold ${isSelected ? 'text-[#BFB0A7]' : 'text-white'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Date of birth */}
        <Animated.View entering={SlideInLeft.duration(700)} className="mt-6">
          <TouchableOpacity
            className={`w-64 rounded-lg border ${colors.cardBg} ${colors.borderColor} px-5 py-3`}
            onPress={() => setShowDateModal(true)}>
            <Text className={`text-aref text-center font-bold ${colors.textPrimary}`}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Confirm Button */}
        <Animated.View entering={FadeInUp.duration(800)} className="mt-4">
          <View className="rounded-full border-2 border-stone-600 p-2">
            <TouchableOpacity
              onPress={handleCheckCompatibility}
              activeOpacity={0.8}
              className={`shadow-opacity-30 elevation-1 w-64 rounded-full ${colors.buttonBg} py-2 shadow-md shadow-light-text2`}>
              <Text
                className={`text-aref text-center text-base font-bold tracking-wide ${colors.buttonText}`}>
                Check Compatibility
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Modal Date Picker */}
      <Modal transparent visible={showDateModal} animationType="fade">
        <BlurView intensity={40} tint={colors.modalTint} className="flex-1 justify-end">
          <View className="rounded-t-2xl p-4" style={{ backgroundColor: colors.modalBg }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold" style={{ color: colors.modalText }}>
                Choose Date of Birth
              </Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text className="text-xl" style={{ color: colors.modalText }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              textColor={colors.modalText}
              onChange={(_, selected) => {
                if (selected) setDate(selected);
              }}
              style={{ backgroundColor: colors.modalBg }}
            />
            <TouchableOpacity
              className={`my-2 items-center rounded-full py-3 ${colors.bgButton}`}
              onPress={() => setShowDateModal(false)}>
              <Text className={`font-bold ${colors.textThird}`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
