import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function StepThree({ formData, updateForm, onBack, onSubmit }: any) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';
  const textThird = isDarkMode ? 'text-[#ffffff]' : 'text-[#281109]';
  const border = isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]';
  const bgInput = isDarkMode ? 'bg-[#91837C]' : 'bg-[#584540]';
  const bgButton = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const buttonTextColor = isDarkMode ? 'text-dark-text1' : 'text-light-text1';
  const progressColor = isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]';
  const modalBg = isDarkMode ? '#0F0A0A' : '#ffffff';
  const modalText = isDarkMode ? '#ffffff' : '#281109';
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';

  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString() : 'Choose Date of Birth';
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Choose Time of Birth';

  return (
    <View className="flex-1 p-10" style={{ backgroundColor }}>
      <View className="mt-20 flex-1 justify-between">
        <View className="mb-2 w-full items-center">
          <View className="mb-2 flex-row gap-2">
            <View className={`h-1 w-32 rounded-full ${progressColor}`} />
            <View className={`h-1 w-32 rounded-full ${progressColor}`} />
            <View className={`h-1 w-32 rounded-full ${progressColor}`} />
          </View>

          <Text className={`text-aref text-sm ${textSecondary}`}>
            When were you born under the sky?
          </Text>
        </View>

        <View className="mb-36 items-center justify-between">
          <TouchableOpacity
            className={`w-64 rounded-lg border ${border} ${bgInput} px-5 py-3`}
            onPress={() => setShowDateModal(true)}>
            <Text className={`text-aref text-center font-bold ${textPrimary}`}>
              {formatDate(formData.dateOfBirth)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mt-2 w-64 rounded-lg border ${border} ${bgInput} px-5 py-3`}
            onPress={() => setShowTimeModal(true)}>
            <Text className={`text-aref text-center font-bold ${textPrimary}`}>
              {formatTime(formData.timeOfBirth)}
            </Text>
          </TouchableOpacity>

          <View className="mt-4 rounded-full border-2 border-stone-600 p-2">
            <TouchableOpacity
              onPress={onSubmit}
              activeOpacity={0.8}
              className={`shadow-opacity-30 elevation-1 w-64 rounded-full py-2 shadow-md shadow-light-text2 ${bgButton}`}>
              <Text
                className={`text-aref text-center text-base font-bold tracking-wide ${buttonTextColor}`}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal transparent visible={showDateModal} animationType="fade">
        <BlurView
          intensity={40}
          tint={isDarkMode ? 'dark' : 'light'}
          className="flex-1 justify-end">
          <View className="rounded-t-2xl p-4" style={{ backgroundColor: modalBg }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold" style={{ color: modalText }}>
                Choose Your Date of Birth
              </Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text className="text-xl" style={{ color: modalText }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.dateOfBirth || new Date()}
              mode="date"
              display="spinner"
              textColor={modalText}
              onChange={(_, selected) => selected && updateForm({ dateOfBirth: selected })}
              style={{ backgroundColor: modalBg }}
            />
            <TouchableOpacity
              className={`my-2 items-center rounded-full  py-3 ${bgButton} ${buttonTextColor}`}
              onPress={() => setShowDateModal(false)}>
              <Text className={`font-bold ${textThird}`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <Modal transparent visible={showTimeModal} animationType="fade">
        <BlurView
          intensity={40}
          tint={isDarkMode ? 'dark' : 'light'}
          className="flex-1 justify-end">
          <View className="rounded-t-2xl p-4" style={{ backgroundColor: modalBg }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold" style={{ color: modalText }}>
                Choose Your Time of Birth
              </Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Text className="text-xl" style={{ color: modalText }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.timeOfBirth || new Date()}
              mode="time"
              display="spinner"
              is24Hour={false}
              textColor={modalText}
              onChange={(_, selected) => selected && updateForm({ timeOfBirth: selected })}
              style={{ backgroundColor: modalBg }}
            />
            <TouchableOpacity
              className={`my-2 items-center rounded-full  py-3 ${bgButton} `}
              onPress={() => setShowTimeModal(false)}>
              <Text className={`font-bold ${textThird}`}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
