import { useState, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

export default function ZodiacSignsCompatibility({ onBack }: any) {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const [time, setTime] = useState(new Date());

  const navigation = useNavigation();
  const step = 1;

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
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
            <Ionicons name="arrow-back" size={24} color="#281109" />
            <Text className="text-aref m-l-2 text-left text-xl font-bold text-[#32221E]">
              Tell us about your beloved
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, step]);

  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0] p-10">
      {/* Header */}

      {/* Form */}
      <View className="mb-36 items-center justify-between">
        <TextInput
          placeholder="Username"
          placeholderTextColor="#281109"
          value={username}
          onChangeText={setUsername}
          className="text-aref w-64 rounded-lg border border-[#5B453D] bg-[#91837C] px-5 py-3 text-left"
        />

        {/* Genre */}
        <View className="mt-4 flex-row justify-center gap-4">
          {['Male', 'Female', 'Other'].map((option) => {
            const iconName =
              option === 'Female'
                ? 'female-sharp'
                : option === 'Other'
                  ? 'male-female-sharp'
                  : 'male';

            const isSelected = gender === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setGender(option)}
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

        <TouchableOpacity
          className=" w-64 rounded-lg  border border-[#5B453D] bg-[#91837C] px-5 py-3"
          onPress={() => setShowDateModal(true)}>
          <Text className="text-aref text-center font-bold text-[#281109]">
            {time.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showTimeModal} animationType="fade">
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-[#0F0A0A] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Choose Your Date of Birth</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text className="text-xl text-white">×</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={time}
              mode="date"
              display="spinner"
              textColor="#ffffff"
              //onChange={(_, selected) => selected && updateForm({ dateOfBirth: selected })}
              style={{ backgroundColor: '#0F0A0A' }}
            />
            <TouchableOpacity
              className="mt-4 items-center rounded-full bg-white py-3"
              onPress={() => Alert.alert('coming!')}>
              <Text className="font-bold text-[#281109]">Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
