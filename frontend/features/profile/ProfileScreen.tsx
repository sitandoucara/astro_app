import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from 'features/auth/useAuth';
import type { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from 'shared/hooks';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

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
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">
          Your profile ({user?.username ?? 'User'})
        </Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation, user]);

  return (
    <View className="flex-1 items-center justify-center space-y-6 bg-[#F2EAE0]">
      <Text className="text-aref mb-5 text-[42px] font-bold text-[#7B635A]">Profile page</Text>

      <TouchableOpacity
        className="mt-2 w-64 items-center rounded-full bg-[#7B635A] py-3"
        onPress={handleLogout}>
        <Text className="font-bold text-white">Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
