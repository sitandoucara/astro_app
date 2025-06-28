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
import { logout, deleteAccount } from 'features/auth/auth.hook';
import { useZodiacCompatibility } from 'features/compatibility/zodiac-signs-compatibility/zodiac-compatibility.hook';
import { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { CustomAlert } from 'shared/components/custom-alert.component';
import { useAppSelector, useAppDispatch } from 'shared/hooks';
import { useCustomAlert } from 'shared/hooks/custom-alert.hook';
import { useLanguage } from 'shared/language/language.hook';
import type { RootStackParamList } from 'shared/navigation/types';
import { useThemeColors } from 'shared/theme/theme-color.hook';
import { toggleDarkMode } from 'shared/theme/theme.slice';
import { useVoice } from 'shared/voice/voice.hook';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { getCurrentVoiceLabel } = useVoice();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const colors = useThemeColors();
  const { t, getCurrentLanguageLabel } = useLanguage();

  const { userSign } = useZodiacCompatibility();

  const [isDeleting, setIsDeleting] = useState(false);

  const { alertConfig, hideAlert, showConfirm, showSuccess, showError } = useCustomAlert();

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
          className={`text-aref ml-1 font-medium ${
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
    showConfirm(
      t('profile.deleteModal.title'),
      t('profile.deleteModal.message'),
      handleDeleteAccount,
      undefined,
      t('profile.deleteModal.delete'),
      t('profile.deleteModal.cancel')
    );
  };
  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAccount(dispatch);

      if (result.error) {
        showError(t('common.error'), t('profile.alerts.deleteError'));
      } else {
        showSuccess(t('common.success'), t('profile.alerts.deleteSuccess'));
      }
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
      showError(t('common.error'), t('profile.alerts.unexpectedError'));
    } finally {
      setIsDeleting(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="p-2">
          <Text
            className="text-aref ml-5 text-[18px] font-medium"
            style={{ color: colors.colors.raw.icon }}>
            {t('profile.title')}
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, isDarkMode, t]);

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
            label={isDarkMode ? t('profile.lightAppearance') : t('profile.darkAppearance')}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={() => {
                  dispatch(toggleDarkMode());
                }}
                thumbColor={colors.colors.raw.thumb}
                trackColor={{
                  true: colors.colors.raw.trackOn,
                  false: colors.colors.raw.trackOff,
                }}
              />
            }
            onPress={undefined}
          />
          <SettingItem
            icon={<FontAwesome5 name="globe-americas" size={20} color={colors.colors.raw.icon} />}
            label={t('profile.changeLanguage')}
            rightComponent={
              <View className="flex-row items-center space-x-2">
                <Text
                  className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.colors.tailwind.iconBg} ${colors.colors.tailwind.textReverse} p-4`}>
                  {getCurrentLanguageLabel()}
                </Text>
                <Feather name="chevron-right" size={20} color={colors.colors.raw.icon} />
              </View>
            }
            onPress={() => navigation.navigate('Language')}
          />
          <SettingItem
            icon={<MaterialIcons name="settings-voice" size={20} color={colors.colors.raw.icon} />}
            label={t('profile.changeVoice')}
            rightComponent={
              <View className="flex-row items-center space-x-2">
                <Text
                  className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.colors.tailwind.iconBg} ${colors.colors.tailwind.textReverse} p-4`}>
                  {getCurrentVoiceLabel()}
                </Text>
                <Feather name="chevron-right" size={20} color={colors.colors.raw.icon} />
              </View>
            }
            onPress={() => navigation.navigate('Voice')}
          />
          <SettingItem
            icon={<FontAwesome6 name="crown" size={20} color={colors.colors.raw.icon} />}
            label={t('profile.subscriptions')}
            rightComponent={
              <View className="flex-row items-center space-x-2">
                <Text
                  className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.colors.tailwind.iconBg} ${colors.colors.tailwind.textReverse} p-4`}>
                  {t('profile.freePlan')}
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
            label={t('profile.rateUs')}
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
            label={t('profile.contactUs')}
            onPress={undefined}
          />
          <SettingItem
            icon={<MaterialIcons name="verified" size={20} color={colors.colors.raw.icon} />}
            label={t('profile.followUs')}
            onPress={undefined}
          />
        </View>

        {/* Account */}
        <View className={`rounded-xl p-4 ${colors.colors.tailwind.cardBg}`}>
          <SettingItem
            icon={<Ionicons name="log-out" size={20} color={colors.colors.raw.icon} />}
            label={t('profile.logOut')}
            rightComponent={undefined}
            onPress={handleLogout}
          />
          <SettingItem
            icon={<FontAwesome6 name="trash" size={20} color={colors.colors.raw.danger} />}
            label={t('profile.deleteAccount')}
            rightComponent={undefined}
            onPress={showDeleteConfirmation}
            isDanger
          />
          <Text
            className={`text-aref text-center font-medium ${colors.colors.tailwind.textPrimary} p-2`}>
            V1.1.5
          </Text>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions?.map((action) => ({
          ...action,
          loading: action.text === t('profile.deleteModal.delete') ? isDeleting : action.loading,
        }))}
        onClose={hideAlert}
      />
    </>
  );
}
