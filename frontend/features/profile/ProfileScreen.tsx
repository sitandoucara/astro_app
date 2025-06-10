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
import { logout } from 'features/auth/useAuth';
import type { RootStackParamList } from 'navigation/types';
import { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
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
      borderReverse: isDarkMode ? ' border-[#281109] ' : 'border-[#F2EAE0]',
      textOnCard: isDarkMode ? 'text-[#281109]' : 'text-[#F2EAE0]',
    },
    raw: {
      icon: isDarkMode ? '#281109' : '#F2EAE0',
      thumb: isDarkMode ? '#F2EAE0' : '#32221E',
      trackOff: '#32221E',
      trackOn: '#F2EAE0',
    },
  };

  // Images zodiac selon thème
  const lightSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_light.png';
  const darkSignUrl =
    'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/cancer_dark.png';
  const signImage = isDarkMode ? darkSignUrl : lightSignUrl;

  type SettingItemProps = {
    icon: React.ReactNode;
    label: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
  };

  const SettingItem: React.FC<SettingItemProps> = ({ icon, label, rightComponent, onPress }) => (
    <TouchableOpacity
      className={`mb-3 flex-row items-center justify-between border-b-[0.2px] p-4 ${colors.tailwind.borderReverse}`}
      onPress={onPress}>
      <View className="flex-row items-center space-x-3">
        <View>{icon}</View>
        <Text className={`text-aref font-medium ${colors.tailwind.textOnCard}`}>{label}</Text>
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
                <Image source={{ uri: signImage }} className="h-12 w-12" />
              </View>
              <View>
                <Text className={`text-aref text-xl font-semibold ${colors.tailwind.textPrimary}`}>
                  {user.username}{' '}
                  {user.gender === 'Male' ? '♂' : user.gender === 'Female' ? '♀' : ''}
                </Text>
                <Text className={`text-aref text-sm ${colors.tailwind.textSecondary}`}>
                  {user.email}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={24} color={colors.raw.icon} />
          </View>
        </View>
      )}

      {/* Appearance & Language */}
      <View className={`mb-6 rounded-xl p-4 ${colors.tailwind.cardBg}`}>
        <SettingItem
          icon={
            isDarkMode ? (
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={20}
                color={colors.raw.icon}
              />
            ) : (
              <MaterialCommunityIcons
                name="moon-waning-crescent"
                size={20}
                color={colors.raw.icon}
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
          icon={<FontAwesome5 name="globe-americas" size={20} color={colors.raw.icon} />}
          label=" Change Language"
          rightComponent={
            <View className="flex-row items-center space-x-2">
              <Text
                className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.tailwind.iconBg} ${colors.tailwind.textReverse} p-4`}>
                English(US)
              </Text>
              <Feather name="chevron-right" size={20} color={colors.raw.icon} />
            </View>
          }
          onPress={undefined}
        />
        <SettingItem
          icon={<FontAwesome6 name="crown" size={20} color={colors.raw.icon} />}
          label=" Subscriptions"
          rightComponent={
            <View className="flex-row items-center space-x-2">
              <Text
                className={`text-aref rounded-full px-3 py-1 text-sm font-medium ${colors.tailwind.iconBg} ${colors.tailwind.textReverse} p-4`}>
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
          icon={<FontAwesome6 name="masks-theater" size={20} color={colors.raw.icon} />}
          label=" Rate us"
          onPress={undefined}
        />
        <SettingItem
          icon={<MaterialCommunityIcons name="message-badge" size={20} color={colors.raw.icon} />}
          label=" Contact us"
          onPress={undefined}
        />
        <SettingItem
          icon={<MaterialIcons name="verified" size={20} color={colors.raw.icon} />}
          label=" Follow us"
          onPress={undefined}
        />
      </View>

      {/* Account */}
      <View className={`rounded-xl p-4 ${colors.tailwind.cardBg}`}>
        <SettingItem
          icon={<Ionicons name="log-out" size={20} color={colors.raw.icon} />}
          label=" Log Out"
          rightComponent={undefined}
          onPress={handleLogout}
        />
        <SettingItem
          icon={<FontAwesome6 name="trash" size={20} color={colors.raw.icon} />}
          label=" Delete Account"
          rightComponent={undefined}
          onPress={undefined}
        />
      </View>
    </ScrollView>
  );
}
