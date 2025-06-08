import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from 'features/auth/useAuth';
import type { RootStackParamList } from 'navigation/types';
import { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAppSelector, useAppDispatch } from 'shared/hooks';

import { toggleDarkMode } from 'shared/theme/themeSlice';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = {
    tailwind: {
      background: isDarkMode ? 'bg-[#F2EAE0]' : 'bg-[#281109]',
      cardBg: isDarkMode ? 'bg-[#8B7E78]' : 'bg-[#402B25]',
      itemBg: isDarkMode ? 'bg-[#F5F0ED]' : 'bg-[#5D4B46]',
      iconBg: isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]',
      textPrimary: isDarkMode ? 'text-[#281109]' : 'text-[#F2EAE0]',
      textSecondary: isDarkMode ? 'text-[#A8958C]' : 'text-[#D8C8B4]',
      textReverse: isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]',
      textOnCard: 'text-[#281109]',
    },
    raw: {
      icon: isDarkMode ? '#281109' : '#F2EAE0',
      thumb: isDarkMode ? '#F2EAE0' : '#32221E',
      trackOff: '#32221E',
      trackOn: '#F2EAE0',
    },
  };

  type SettingItemProps = {
    icon: React.ReactNode;
    label: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
  };

  const SettingItem: React.FC<SettingItemProps> = ({ icon, label, rightComponent, onPress }) => (
    <TouchableOpacity
      className={`mb-3 flex-row items-center justify-between rounded-lg p-4 ${colors.tailwind.itemBg}`}
      onPress={onPress}>
      <View className="flex-row items-center space-x-3">
        <View>{icon}</View>
        <Text className={`font-medium ${colors.tailwind.textOnCard}`}>{label}</Text>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    await logout(dispatch);
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthHome' }],
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="p-2">
          <Text
            className="text-aref ml-5 text-[18px] font-medium"
            style={{ color: colors.raw.icon }}>
            Your profile ({user?.username ?? 'User'})
          </Text>
          <Text className="text-aref ml-5 mt-1 text-[14px]" style={{ color: colors.raw.icon }}>
            {user?.dateOfBirth ? `${user.dateOfBirth.slice(0, 10)}` : ''}
            {user?.timeOfBirth ? ` • ${user.timeOfBirth.slice(11, 16)}` : ''}
          </Text>
        </View>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, user, isDarkMode]);

  return (
    <ScrollView className={`flex-1 ${colors.tailwind.background} p-4`}>
      {/*<View className="flex-1 items-center justify-center space-y-6 bg-[#F2EAE0]">*/}
      {user && (
        <View>
          <View className="mb-8 flex-row items-center justify-between pt-4">
            <View className="flex-row items-center gap-2">
              <View className={`rounded-full p-2 ${colors.tailwind.cardBg}`}>
                <Feather name="user" size={24} color={colors.raw.icon} />
              </View>
              <View>
                <Text className={`text-xl font-semibold ${colors.tailwind.textPrimary}`}>
                  {user.username}{' '}
                  {user.gender === 'Male' ? '♂' : user.gender === 'Female' ? '♀' : ''}
                </Text>
                <Text className={`text-sm ${colors.tailwind.textSecondary}`}>{user.email}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.raw.icon} />
          </View>
        </View>
      )}

      {/* Appearance & Language */}
      <View className={`mb-6 rounded-xl p-4 ${colors.tailwind.cardBg}`}>
        <SettingItem
          icon={<Feather name="sun" size={20} color={colors.raw.icon} />}
          label=" Light Appearance"
          rightComponent={
            <Switch
              value={!isDarkMode}
              onValueChange={() => {
                dispatch(toggleDarkMode());
              }}
              thumbColor={isDarkMode ? '#F2EAE0' : '#32221E'}
              trackColor={{ false: '#32221E', true: '#F2EAE0' }}
            />
          }
          onPress={undefined}
        />
        <SettingItem
          icon={<Feather name="globe" size={20} color={colors.raw.icon} />}
          label=" Change Language"
          rightComponent={
            <View className="flex-row items-center space-x-2">
              <Text
                className={`rounded-full px-3 py-1 text-sm font-medium ${colors.tailwind.iconBg} ${colors.tailwind.textReverse} p-4`}>
                English(US)
              </Text>
              <Feather name="chevron-right" size={20} color={colors.raw.icon} />
            </View>
          }
          onPress={undefined}
        />
        <SettingItem
          icon={<FontAwesome5 name="crown" size={20} color={colors.raw.icon} />}
          label=" Subscriptions"
          rightComponent={
            <View className="flex-row items-center space-x-2">
              <Text
                className={`rounded-full px-3 py-1 text-sm font-medium ${colors.tailwind.iconBg} ${colors.tailwind.textReverse} p-4`}>
                Free Plan
              </Text>
              <Feather name="chevron-right" size={20} color={colors.raw.icon} />
            </View>
          }
          onPress={undefined}
        />
      </View>

      {/* Feedback */}
      <View className={`mb-6 rounded-xl p-4 ${colors.tailwind.cardBg}`}>
        <SettingItem
          icon={<Feather name="star" size={20} color={colors.raw.icon} />}
          label=" Rate us"
          rightComponent={<Feather name="chevron-right" size={20} color={colors.raw.icon} />}
          onPress={undefined}
        />
        <SettingItem
          icon={<Feather name="message-circle" size={20} color={colors.raw.icon} />}
          label=" Contact us"
          rightComponent={<Feather name="chevron-right" size={20} color={colors.raw.icon} />}
          onPress={undefined}
        />
        <SettingItem
          icon={<Feather name="users" size={20} color={colors.raw.icon} />}
          label=" Follow us"
          rightComponent={<Feather name="chevron-right" size={20} color={colors.raw.icon} />}
          onPress={undefined}
        />
      </View>

      {/* Account */}
      <View className={`rounded-xl p-4 ${colors.tailwind.cardBg}`}>
        <SettingItem
          icon={<Feather name="log-out" size={20} color={colors.raw.icon} />}
          label=" Log Out"
          rightComponent={undefined}
          onPress={handleLogout}
        />
        <SettingItem
          icon={<Feather name="trash-2" size={20} color={colors.raw.icon} />}
          label=" Delete Account"
          rightComponent={undefined}
          onPress={undefined}
        />
      </View>
    </ScrollView>
  );
}
