import Ionicons from '@expo/vector-icons/Ionicons';
import { Key, useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';

import useLocationSearch, { LocationResult } from '../../../shared/hooks/useLocationSearch';

export default function StepTwo({ formData, updateForm, onNext }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';
  const border = isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]';
  const bgInput = isDarkMode ? 'bg-[#91837C]' : 'bg-[#584540]';
  const bgButton = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const buttonTextColor = isDarkMode ? 'text-dark-text1' : 'text-light-text1';
  const progressColor = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const placeholderColor = isDarkMode ? '#281109' : '#ffffff';
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';

  const modalBg = isDarkMode ? '#F2EAE0' : '#281109';
  const modalText = isDarkMode ? '#32221E' : '#F2EAE0';

  const keyboardOffset = useSharedValue(0);

  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [query, setQuery] = useState(formData.birthplaceQuery);
  const { results, search } = useLocationSearch();

  useEffect(() => {
    if (query) search(query);
  }, [query]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      keyboardOffset.value = withSpring(-event.endCoordinates.height * 0.01, {
        damping: 20,
        stiffness: 200,
      });
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      keyboardOffset.value = withSpring(0, {
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

  const isValid =
    formData.username.trim().length > 0 &&
    formData.gender !== null &&
    formData.selectedPlace !== null;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1 p-10">
        <View className="mt-20 flex-1 justify-between">
          <View className="mb-2 w-full items-center">
            <View className="mb-2 flex-row gap-2">
              <View className={`h-1 w-32 rounded-full ${progressColor}`} />
              <View className={`h-1 w-32 rounded-full ${progressColor}`} />
              <View className={`h-1 w-32 rounded-full ${progressColor} opacity-50`} />
            </View>
            <Text className={`text-aref text-sm ${textSecondary}`}>
              Who are you among the stars?
            </Text>
          </View>

          <Animated.View style={inputContainerStyle} className="mb-36 items-center justify-between">
            <TextInput
              placeholder="Username"
              placeholderTextColor={placeholderColor}
              value={formData.username}
              onChangeText={(text) => updateForm({ username: text })}
              className={`text-aref w-64 rounded-lg border ${border} ${bgInput} px-5 py-3 text-left ${textPrimary}`}
            />

            <View className="mt-4 flex-row justify-center gap-4">
              {['Male', 'Female', 'Other'].map((option) => {
                const iconName =
                  option === 'Female'
                    ? 'female-sharp'
                    : option === 'Other'
                      ? 'male-female-sharp'
                      : 'male';

                const isSelected = formData.gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => updateForm({ gender: option })}
                    className={`rounded-md border px-4 py-2 ${
                      isSelected ? 'bg-[#281109]' : 'bg-[#91837C]'
                    } items-center`}>
                    <Ionicons name={iconName} size={40} color={isSelected ? '#BFB0A7' : 'white'} />
                    <Text
                      className={`text-aref mt-1 font-bold ${isSelected ? 'text-[#BFB0A7]' : 'text-white'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Select birthplace */}
            <TouchableOpacity
              onPress={() => setShowPlaceModal(true)}
              className={`mt-8 rounded-lg border ${border} ${bgInput} px-5 py-3`}>
              <Text className={`text-aref text-center ${textPrimary}`}>
                {formData.birthplaceQuery || 'Select Birthplace'}
              </Text>
            </TouchableOpacity>

            <View className="mt-4 rounded-full border-2 border-stone-600 p-2">
              <TouchableOpacity
                onPress={onNext}
                disabled={!isValid}
                activeOpacity={0.8}
                className={`shadow-opacity-30 elevation-1 w-64 rounded-full py-2 shadow-md shadow-light-text2 ${
                  isValid ? bgButton : `${bgButton} opacity-50`
                }`}>
                <Text
                  className={`text-aref text-center text-base font-bold tracking-wide ${buttonTextColor}`}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={showPlaceModal}
        animationType="slide"
        onRequestClose={() => setShowPlaceModal(false)}>
        <View className="flex-1 p-6" style={{ backgroundColor: modalBg }}>
          <View className="mb-4 mt-14 flex-row items-center justify-between">
            <Text className="text-aref text-xl font-bold" style={{ color: modalText }}>
              Choose Birthplace
            </Text>
            <TouchableOpacity onPress={() => setShowPlaceModal(false)}>
              <Ionicons name="close" size={32} color={modalText} />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Type a city..."
            placeholderTextColor={placeholderColor}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              updateForm({ birthplaceQuery: text, selectedPlace: null });
            }}
            className={`text-aref mb-4 w-full rounded-lg border ${border} ${bgInput} px-4 py-3 ${textPrimary}`}
          />

          <View className="flex-1">
            <FlatList
              data={results}
              keyExtractor={(_, idx: Key) => String(idx)}
              style={{ flex: 1 }}
              ItemSeparatorComponent={() => (
                <View className="border-b-[0.3px]" style={{ borderColor: placeholderColor }} />
              )}
              renderItem={({ item }: { item: LocationResult }) => (
                <TouchableOpacity
                  onPress={() => {
                    updateForm({
                      selectedPlace: item,
                      birthplaceQuery: item.display_name,
                    });
                    setShowPlaceModal(false);
                  }}
                  className="py-3">
                  <Text className="text-aref" style={{ color: placeholderColor }}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
