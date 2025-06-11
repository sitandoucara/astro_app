import { useState, useLayoutEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useAppSelector } from 'shared/hooks';

export default function ZodiacSignsCompatibility({ onBack }: any) {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  const [date, setDate] = useState(new Date());

  const formatDate = (d: Date) => d.toLocaleDateString();

  const navigation = useNavigation();
  const step = 1;

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const titleColor = isDarkMode ? '#7B635A' : '#D8C8B4';

  const iconBg = isDarkMode ? 'bg-light-border' : 'bg-dark-border';
  const iconColor = isDarkMode ? '#F2EAE0' : '#32221E';

  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';

  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]';

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
            <Ionicons name="arrow-back" size={24} style={{ color: textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              Tell us about your beloved
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, step]);

  return (
    <View
      className="flex-1 items-center justify-center bg-[#F2EAE0] p-10"
      style={{ backgroundColor }}>
      {/* Header */}

      {/* Form */}

      <View className=" flex-1 items-center justify-center gap-2">
        <TextInput
          placeholder="Username"
          placeholderTextColor="#281109"
          value={username}
          onChangeText={setUsername}
          className={`text-aref w-64 rounded-lg border text-left ${textColor}  ${cardBg}  ${textColor}  ${borderColor} px-5 py-3`}
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

        <View className="mt-6">
          <TouchableOpacity
            className={`w-64  rounded-lg border   ${cardBg}   ${borderColor} px-5 py-3`}
            onPress={() => setShowDateModal(true)}>
            <Text className={`text-aref text-center font-bold ${textPrimary}`}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-4 rounded-full border-2  border-stone-600 p-2">
          <TouchableOpacity
            onPress={() => Alert.alert('coming soon!')}
            activeOpacity={0.8}
            className={`shadow-opacity-30  elevation-1 w-64  rounded-full bg-[#32221E]  py-2 shadow-md shadow-light-text2`}>
            <Text className="text-aref text-center  text-base font-bold tracking-wide text-white">
              Confirm
            </Text>
          </TouchableOpacity>
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
              value={date}
              mode="date"
              display="spinner"
              textColor="#ffffff"
              onChange={(_, selected) => {
                if (selected) setDate(selected);
              }}
              style={{ backgroundColor: '#0F0A0A' }}
            />
            <TouchableOpacity
              className="mt-4 items-center rounded-full bg-white py-3"
              onPress={() => {
                setShowDateModal(false);
              }}>
              <Text className="font-bold text-[#281109]">Confirm</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
