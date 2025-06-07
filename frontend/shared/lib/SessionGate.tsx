import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setUser } from 'features/auth/AuthSlice';
import { RootStackParamList } from 'navigation/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { supabase } from 'shared/lib/supabase';

export default function SessionGate() {
  const [loading, setLoading] = useState(true);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      console.log('🔵 session:', session);
      console.log('🔴 session error:', sessionError);

      if (!session) {
        console.log('🚫 No session found, stay on AuthHome');
        nav.reset({ index: 0, routes: [{ name: 'AuthHome' }] });
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log('🟢 user:', user);
      console.log('🟠 user error:', userError);

      const metadata = user?.user_metadata ?? {};
      console.log('🧠 metadata:', metadata);

      if (user) {
        dispatch(
          setUser({
            user: {
              id: user.id,
              email: user.email ?? '',
              username: metadata.username ?? '',
              dateOfBirth: metadata.dateOfBirth ?? '',
              timeOfBirth: metadata.timeOfBirth ?? '',
              birthplace: metadata.birthplace ?? '',
              timezoneName: metadata.timezoneName ?? '',
              timezoneOffset: metadata.timezoneOffset ?? 0,
              latitude: metadata.latitude ?? null,
              longitude: metadata.longitude ?? null,
              gender: metadata.gender ?? '',
              birthChartUrl: metadata.birthChartUrl ?? '',
              planets: metadata.planets ?? null,
              ascendant: metadata.ascendant ?? null,
            },
            token: session.access_token,
          })
        );

        console.log('User logged in, navigating to App');
        nav.reset({ index: 0, routes: [{ name: 'App' }] });
      } else {
        console.log('No user returned from getUser');
        nav.reset({ index: 0, routes: [{ name: 'AuthHome' }] });
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2EAE0]">
        <ActivityIndicator size="large" color="#281109" />
      </View>
    );
  }

  return null;
}
