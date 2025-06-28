import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { setUser } from 'features/auth/auth.slice';
import { useState, useLayoutEffect, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import Animated, { FadeInUp, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useAppSelector, useAppDispatch } from 'shared/hooks';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { supabase } from 'shared/lib/supabase';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export default function EditProfile({ onBack }: any) {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const colors = useThemeColors();

  const { alertConfig, hideAlert, showError, showSuccess } = useCustomAlert();

  const [username, setUsername] = useState(user?.username || '');
  const [birthplace, setBirthplace] = useState(user?.birthplace || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [date, setDate] = useState(user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date());
  const [timeOfBirth, setTimeOfBirth] = useState(
    user?.timeOfBirth ? new Date(user.timeOfBirth) : new Date()
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [originalData, setOriginalData] = useState({
    username: user?.username || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
    timeOfBirth: user?.timeOfBirth ? new Date(user.timeOfBirth) : new Date(),
  });

  useEffect(() => {
    if (user) {
      const original = {
        username: user.username || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
        timeOfBirth: user.timeOfBirth ? new Date(user.timeOfBirth) : new Date(),
      };
      setOriginalData(original);
    }
  }, [user]);

  const formatDate = (d: Date) => d.toLocaleDateString();
  const formatTime = (t: Date) => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUsername(originalData.username);
    setDate(originalData.dateOfBirth);
    setTimeOfBirth(originalData.timeOfBirth);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!username.trim()) {
      showError('Error', 'Username is required');
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showError('Error', 'Session expired, please log in again');
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {
          username: username.trim(),
          dateOfBirth: date.toISOString(),
          timeOfBirth: timeOfBirth.toISOString(),
        },
      });

      if (error) {
        console.error('Error while updating:', error);
        showError('Error', 'Unable to update profile');
        return;
      }
      if (!data.user) {
        showError('Error', 'User data not retrieved');
        return;
      }

      const updatedMetadata = data.user.user_metadata || {};

      dispatch(
        setUser({
          user: {
            id: data.user.id,
            email: data.user.email ?? '',
            username: updatedMetadata.username ?? username.trim(),
            birthplace: updatedMetadata.birthplace ?? birthplace.trim(),
            dateOfBirth: updatedMetadata.dateOfBirth ?? date.toISOString(),
            timeOfBirth: updatedMetadata.timeOfBirth ?? timeOfBirth.toISOString(),
            // Keep other existing properties
            timezoneName: updatedMetadata.timezoneName ?? user?.timezoneName ?? '',
            timezoneOffset: updatedMetadata.timezoneOffset ?? user?.timezoneOffset ?? 0,
            latitude: updatedMetadata.latitude ?? user?.latitude ?? null,
            longitude: updatedMetadata.longitude ?? user?.longitude ?? null,
            gender: updatedMetadata.gender ?? user?.gender ?? '',
            birthChartUrl: updatedMetadata.birthChartUrl ?? user?.birthChartUrl ?? '',
            planets: updatedMetadata.planets ?? user?.planets ?? null,
            ascendant: updatedMetadata.ascendant ?? user?.ascendant ?? null,
          },
          token: session.access_token,
        })
      );

      const newOriginalData = {
        username: username.trim(),
        dateOfBirth: date,
        timeOfBirth: timeOfBirth,
      };
      setOriginalData(newOriginalData);

      setIsEditing(false);

      showSuccess('Success', 'Profile successfully updated', [{ text: 'OK', style: 'edit-style' }]);

      console.log('Updated profile in Redux:', {
        username: username.trim(),
        birthplace: birthplace.trim(),
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      showError('Error', 'An unexpected error has occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={colors.textColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              Edit Profile
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.textColor]);

  return (
    <>
      <View
        className="flex-1 items-center justify-center p-10"
        style={{ backgroundColor: colors.backgroundColor }}>
        <View className="flex-1 items-center justify-center gap-4">
          {/* Input Username */}
          <Animated.View entering={SlideInLeft.duration(500)}>
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.placeholderColor}
              value={username}
              onChangeText={setUsername}
              editable={isEditing}
              className={`text-aref w-64 rounded-lg border ${colors.inputBg} ${colors.textPrimary} ${colors.borderColor} px-5 py-3 ${!isEditing ? 'opacity-60' : ''}`}
            />
          </Animated.View>

          {/* Gender (not editable) */}
          <Animated.View entering={SlideInRight.duration(650)} className="mt-2">
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
                    <View
                      className={`rounded-md border px-4 py-2 ${isSelected ? colors.buttonBg : colors.inputBg} items-center opacity-60`}>
                      <Ionicons
                        name={iconName}
                        size={40}
                        color={isSelected ? '#BFB0A7' : 'white'}
                      />
                      <Text
                        className={`text-aref mt-1 font-bold ${isSelected ? 'text-[#BFB0A7]' : 'text-white'}`}>
                        {option}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>

          {/* Date of birth */}
          <Animated.View entering={SlideInLeft.duration(700)} className="mt-4">
            <TouchableOpacity
              className={`w-64 rounded-lg border ${colors.cardBg} ${colors.borderColor} px-5 py-3 ${!isEditing ? 'opacity-60' : ''}`}
              onPress={() => isEditing && setShowDateModal(true)}
              disabled={!isEditing}>
              <Text className={`text-aref text-center font-bold ${colors.textPrimary}`}>
                Date of birth: {formatDate(date)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Time of birth */}
          <Animated.View entering={SlideInRight.duration(750)} className="mt-2">
            <TouchableOpacity
              className={`w-64 rounded-lg border ${colors.cardBg} ${colors.borderColor} px-5 py-3 ${!isEditing ? 'opacity-60' : ''}`}
              onPress={() => isEditing && setShowTimeModal(true)}
              disabled={!isEditing}>
              <Text className={`text-aref text-center font-bold ${colors.textPrimary}`}>
                Time of birth: {formatTime(timeOfBirth)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Buttons */}
          <Animated.View entering={FadeInUp.duration(800)} className="mt-6">
            {!isEditing ? (
              // Edit button
              <View className="rounded-full border-2 border-stone-600 p-2">
                <TouchableOpacity
                  onPress={handleEdit}
                  activeOpacity={0.8}
                  className={`shadow-opacity-30 elevation-1 w-64 rounded-full ${colors.buttonBg} py-2 shadow-md shadow-light-text2`}>
                  <Text
                    className={`text-aref text-center text-base font-bold tracking-wide ${colors.buttonText}`}>
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Save and Cancel buttons
              <View className="flex-row gap-4">
                <View className="rounded-full border-2 border-stone-600 p-1">
                  <TouchableOpacity
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={isLoading}
                    className={`shadow-opacity-30 elevation-1 w-28 rounded-full bg-green-600 py-2 shadow-md shadow-light-text2 ${isLoading ? 'opacity-50' : ''}`}>
                    <Text className="text-aref text-center text-base font-bold tracking-wide text-white">
                      {isLoading ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="rounded-full border-2 border-stone-600 p-1">
                  <TouchableOpacity
                    onPress={handleCancel}
                    activeOpacity={0.8}
                    disabled={isLoading}
                    className={`shadow-opacity-30 elevation-1 w-28 rounded-full bg-red-600 py-2 shadow-md shadow-light-text2 ${isLoading ? 'opacity-50' : ''}`}>
                    <Text className="text-aref text-center text-base font-bold tracking-wide text-white">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
                <Text className={`font-bold ${colors.textSecondary}`}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* Modal Time Picker */}
        <Modal transparent visible={showTimeModal} animationType="fade">
          <BlurView intensity={40} tint={colors.modalTint} className="flex-1 justify-end">
            <View className="rounded-t-2xl p-4" style={{ backgroundColor: colors.modalBg }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold" style={{ color: colors.modalText }}>
                  Choose Time of Birth
                </Text>
                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                  <Text className="text-xl" style={{ color: colors.modalText }}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={timeOfBirth}
                mode="time"
                display="spinner"
                textColor={colors.modalText}
                onChange={(_, selected) => {
                  if (selected) setTimeOfBirth(selected);
                }}
                style={{ backgroundColor: colors.modalBg }}
              />
              <TouchableOpacity
                className={`my-2 items-center rounded-full py-3 ${colors.bgButton}`}
                onPress={() => setShowTimeModal(false)}>
                <Text className={`font-bold ${colors.textSecondary}`}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={hideAlert}
        icon={
          alertConfig.title === 'Success' ? (
            <MaterialIcons name="check-circle" size={48} color="#10B981" />
          ) : undefined
        }
      />
    </>
  );
}
