import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout, deleteAccount } from 'features/auth/useAuth';
import type { RootStackParamList } from 'navigation/types';
import { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector, useAppDispatch } from 'shared/hooks';
import { useThemeColors } from 'shared/hooks/useThemeColors';
import { useZodiacCompatibility } from 'shared/hooks/useZodiacCompatibility';
import { toggleDarkMode } from 'shared/theme/themeSlice';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const colors = useThemeColors();

  const { userSign } = useZodiacCompatibility();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName.toLowerCase()}_${theme}.png`;
  };

  const currentUserSign = userSign || 'Virgo';
  const signImage = getSignImageUrl(currentUserSign);

  type SettingItemProps = {
    icon: React.ReactNode;
    label: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
    isDanger?: boolean;
  };

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    label,
    rightComponent,
    onPress,
    isDanger = false,
  }) => (
    <TouchableOpacity
      className={`mb-3 flex-row items-center justify-between border-b-[0.2px] p-4 ${colors.colors.tailwind.borderReverse}`}
      onPress={onPress}>
      <View className="flex-row items-center space-x-3">
        <View>{icon}</View>
        <Text
          className={`text-aref font-medium ${
            isDanger
              ? isDarkMode
                ? 'text-[#871515]'
                : 'text-[#EF4444]'
              : colors.colors.tailwind.textOnCard
          }`}>
          {label}
        </Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    await logout(dispatch);
  };

  const showDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAccount(dispatch);

      if (result.error) {
        Alert.alert('Error', 'An error occurred while deleting your account. Please try again.', [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert('Account Deleted', 'Your account has been successfully deleted.', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="p-2">
          <Text
            className="text-aref ml-5 text-[18px] font-medium"
            style={{ color: colors.colors.raw.icon }}>
            Your profile ({user?.username ?? 'User'})
          </Text>
          <Text
            className="text-aref ml-5 mt-1 text-[14px]"
            style={{ color: colors.colors.raw.icon }}>
            {user?.dateOfBirth ? `${user.dateOfBirth.slice(0, 10)}` : ''}
            {user?.timeOfBirth ? ` • ${user.timeOfBirth.slice(11, 16)}` : ''}
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, user, isDarkMode]);

  return (
    <>
      <ScrollView className={`flex-1 ${colors.colors.tailwind.background} p-4`}>
        {user && (
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditProfile')}>
              <View className="mb-8 flex-row items-center justify-between pt-4">
                <View className="flex-row items-center gap-2">
                  <View>
                    <Image source={{ uri: signImage }} className="h-14 w-14" />
                  </View>
                  <View>
                    <Text
                      className={`text-aref text-xl font-semibold ${colors.colors.tailwind.textPrimary}`}>
                      {user.username}{' '}
                      {user.gender === 'Male' ? '♂' : user.gender === 'Female' ? '♀' : ''}
                    </Text>
                    <Text className={`text-aref text-sm ${colors.colors.tailwind.textSecondary}`}>
                      {user.email}
                    </Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={24} color={colors.colors.raw.icon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* Appearance & Language */}
        <View className={`mb-6 rounded-xl p-4 ${colors.colors.tailwind.cardBg}`}>
          <SettingItem
            icon={
              isDarkMode ? (
                <MaterialCommunityIcons
                  name="white-balance-sunny"
                  size={20}
                  color={colors.colors.raw.icon}
                />
              ) : (
                <MaterialCommunityIcons
                  name="moon-waning-crescent"
                  size={20}
                  color={colors.colors.raw.icon}
                />
              )
            }
            label={isDarkMode ? ' Light Appearance' : ' Dark Appearance'}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={() => {
                  dispatch(toggleDarkMode());
                }}
                thumbColor={isDarkMode ? '#32221E' : '#F2EAE0'}
                trackColor={{
                  true: '#F2EAE0',
                  false: '#32221E',
                }}
              />
            }
            onPress={undefined}
          />
          <SettingItem
            icon={<FontAwesome5 name="globe-americas" size={20} color={colors.colors.raw.icon} />}
            label=" Change Language"
            rightComponent={
              <View className="flex-row items-center space-x-2">
                <Text
                  className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.colors.tailwind.iconBg} ${colors.colors.tailwind.textReverse} p-4`}>
                  English(US)
                </Text>
                <Feather name="chevron-right" size={20} color={colors.colors.raw.icon} />
              </View>
            }
            onPress={undefined}
          />
          <SettingItem
            icon={<FontAwesome6 name="crown" size={20} color={colors.colors.raw.icon} />}
            label=" Subscriptions"
            rightComponent={
              <View className="flex-row items-center space-x-2">
                <Text
                  className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.colors.tailwind.iconBg} ${colors.colors.tailwind.textReverse} p-4`}>
                  Free Plan
                </Text>
                <Feather name="chevron-right" size={20} color={colors.colors.raw.icon} />
              </View>
            }
            onPress={undefined}
          />
        </View>
        {/* Feedback */}
        <View className={`mb-6 rounded-xl p-4 ${colors.colors.tailwind.cardBg}`}>
          <SettingItem
            icon={<FontAwesome6 name="masks-theater" size={20} color={colors.colors.raw.icon} />}
            label=" Rate us"
            onPress={undefined}
          />
          <SettingItem
            icon={
              <MaterialCommunityIcons
                name="message-badge"
                size={20}
                color={colors.colors.raw.icon}
              />
            }
            label=" Contact us"
            onPress={undefined}
          />
          <SettingItem
            icon={<MaterialIcons name="verified" size={20} color={colors.colors.raw.icon} />}
            label=" Follow us"
            onPress={undefined}
          />
        </View>
        {/* Account */}
        <View className={`rounded-xl p-4 ${colors.colors.tailwind.cardBg}`}>
          <SettingItem
            icon={<Ionicons name="log-out" size={20} color={colors.colors.raw.icon} />}
            label=" Log Out"
            rightComponent={undefined}
            onPress={handleLogout}
          />
          <SettingItem
            icon={<FontAwesome6 name="trash" size={20} color={colors.colors.raw.danger} />}
            label=" Delete Account"
            rightComponent={undefined}
            onPress={showDeleteConfirmation}
            isDanger
          />
          <Text
            className={`text-aref text-center font-medium ${colors.colors.tailwind.textPrimary} p-2`}>
            V1.1.0
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View
            className={`w-full max-w-sm rounded-xl p-6 ${colors.colors.tailwind.modalBg}`}
            style={{ backgroundColor: colors.colors.raw.modalBg }}>
            <View className="mb-4 items-center">
              <FontAwesome6
                name="triangle-exclamation"
                size={48}
                color={colors.colors.raw.danger}
              />
            </View>

            <Text
              className={`text-aref mb-2 text-center text-lg font-bold ${colors.colors.tailwind.textOnCard}`}>
              Delete Your Account
            </Text>

            <Text className={`text-aref mb-6 text-center ${colors.colors.tailwind.textOnCard}`}>
              This action is irreversible. All your data will be permanently deleted.
              {'\n\n'}
              Are you sure you want to delete your account?
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className={`flex-1 rounded-lg border p-3 ${colors.colors.tailwind.borderReverse}`}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}>
                <Text
                  className={`text-aref text-center font-medium ${colors.colors.tailwind.textOnCard}`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-lg bg-red-600 p-3"
                onPress={handleDeleteAccount}
                disabled={isDeleting}>
                {isDeleting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-aref text-center font-medium text-white">Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
