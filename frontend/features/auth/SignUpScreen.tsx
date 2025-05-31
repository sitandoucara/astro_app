import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, Modal } from 'react-native';

import { signUp } from './useAuth';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  const [timeOfBirth, setTimeOfBirth] = useState<Date | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString() : 'Choose Date of Birth';
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Choose Time of Birth';

  return (
    <View className="flex-1 items-center justify-center bg-[#F2EAE0] px-6">
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 200, height: 200 }}
        resizeMode="contain"
      />
      <Text className="mt-2 text-sm font-bold italic text-[#32221E]">Create an Account</Text>

      <View className="mt-10 w-full items-center space-y-4">
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#281109"
          className="w-64 rounded-full bg-white px-5 py-3 text-center"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#281109"
          className="mt-2 w-64 rounded-full bg-white px-5 py-3 text-center"
        />

        <View className="relative mt-2 w-64">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#281109"
            secureTextEntry={!isPasswordVisible}
            className="w-64 rounded-full bg-white px-5 py-3 text-center"
          />
          <TouchableOpacity
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#281109" />
          </TouchableOpacity>
        </View>

        {/* Date Picker Button */}
        <TouchableOpacity
          className="mt-2 w-64 rounded-full bg-white px-5 py-3"
          onPress={() => setShowDateModal(true)}>
          <Text className=" text-center font-bold text-[#281109]">{formatDate(dateOfBirth)}</Text>
        </TouchableOpacity>

        {/* Time Picker Button */}
        <TouchableOpacity
          className="mt-2 w-64 rounded-full bg-white px-5 py-3"
          onPress={() => setShowTimeModal(true)}>
          <Text className="text-center font-bold text-[#281109]">{formatTime(timeOfBirth)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-2 w-64 items-center rounded-full bg-white py-3"
          onPress={async () => {
            const { data, error } = await signUp(email, password, username);
            if (error) {
              alert(error.message);
            } else {
              alert('Account created!');
              navigation.navigate('SignIn');
            }
          }}>
          <Text className="font-bold text-[#281109]">Create</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text className="mt-4 text-center font-bold text-[#7B635A]">
            Already have an account? <Text className="text-[#281109]">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Modal */}
      <Modal transparent visible={showDateModal} animationType="fade">
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-[#0F0A0A] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Choose Your Date of Birth</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={dateOfBirth || new Date()}
              mode="date"
              display="spinner"
              textColor="#ffffff"
              onChange={(_, selectedDate) => {
                if (selectedDate) setDateOfBirth(selectedDate);
              }}
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

      {/* Time Modal */}
      <Modal transparent visible={showTimeModal} animationType="fade">
        <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-[#0F0A0A] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">Choose Your Time of Birth</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={timeOfBirth || new Date()}
              mode="time"
              textColor="#ffffff"
              is24Hour={false}
              display="spinner"
              onChange={(_, selectedTime) => {
                if (selectedTime) setTimeOfBirth(selectedTime);
              }}
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
