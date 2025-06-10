import { Text, TouchableOpacity, View, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function StepThree({ formData, updateForm, onBack, onSubmit }: any) {
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString() : 'Choose Date of Birth';
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Choose Time of Birth';

  return (
    <View className="flex-1 p-10">
      <View className="mt-20 flex-1 justify-between">
        <View className="mb-2 w-full items-center">
          <View className="mb-2 flex-row gap-2">
            <View className="h-1 w-32 rounded-full bg-[#281109]" />
            <View className="h-1 w-32 rounded-full bg-[#281109]" />
            <View className="h-1 w-32 rounded-full bg-[#281109]/50" />
          </View>

          <Text className="text-aref text-sm text-[#7B635A]">
            When were you born under the sky?
          </Text>
        </View>

        <View className="mb-36  items-center justify-between">
          <TouchableOpacity
            className=" w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
            onPress={() => setShowDateModal(true)}>
            <Text className="text-aref text-center font-bold text-[#281109]">
              {formatDate(formData.dateOfBirth)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className=" mt-2 w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
            onPress={() => setShowTimeModal(true)}>
            <Text className="text-aref text-center font-bold text-[#281109]">
              {formatTime(formData.timeOfBirth)}
            </Text>
          </TouchableOpacity>

          <View className="mt-4 rounded-full border-2  border-stone-600 p-2">
            <TouchableOpacity
              onPress={onSubmit}
              activeOpacity={0.8}
              className={`shadow-opacity-30  elevation-1 w-64  rounded-full bg-[#32221E]  py-2 shadow-md shadow-light-text2`}>
              <Text className="text-aref text-center  text-base font-bold tracking-wide text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal transparent visible={showDateModal} animationType="fade">
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-[#0F0A0A] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Choose Your Date of Birth</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text className="text-xl text-white">×</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.dateOfBirth || new Date()}
              mode="date"
              display="spinner"
              textColor="#ffffff"
              onChange={(_, selected) => selected && updateForm({ dateOfBirth: selected })}
              style={{ backgroundColor: '#0F0A0A' }}
            />
            <TouchableOpacity
              className="mt-4 items-center rounded-full bg-white py-3"
              onPress={() => setShowDateModal(false)}>
              <Text className="font-bold text-[#281109]">Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <Modal transparent visible={showTimeModal} animationType="fade">
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-[#0F0A0A] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Choose Your Time of Birth</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Text className="text-xl text-white">×</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={formData.timeOfBirth || new Date()}
              mode="time"
              display="spinner"
              is24Hour={false}
              textColor="#ffffff"
              onChange={(_, selected) => selected && updateForm({ timeOfBirth: selected })}
              style={{ backgroundColor: '#0F0A0A' }}
            />
            <TouchableOpacity
              className="mt-4 items-center rounded-full bg-white py-3"
              onPress={() => setShowTimeModal(false)}>
              <Text className="font-bold text-[#281109]">Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
