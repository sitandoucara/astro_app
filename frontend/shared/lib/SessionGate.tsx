import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthHomeScreen from 'features/auth/AuthHomeScreen';
import { setUser, clearUser } from 'features/auth/AuthSlice';
import SignInScreen from 'features/auth/SignInScreen';
import SignUpScreen from 'features/auth/SignUpScreen';
import BirthChartCompability from 'features/compatibility/components/BirthChartCompability';
import ZodiacSignsCompatibility from 'features/compatibility/components/ZodiacSignsCompatibility';
import AudioBookScreen from 'features/explore/components/AudioBookScreen';
import GuessWhoGame from 'features/explore/components/GuessWhoGame';
import LearnScreen from 'features/explore/components/LearnScreen';
import QuizzScreen from 'features/explore/components/QuizzScreen';
import TrueOrFalseGame from 'features/explore/components/TrueOrFalseGame';
import { RootStackParamList } from 'navigation/types';
import { useEffect, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import LoadingScreen from 'shared/components/LoadingScreen';
import MyTabs from 'shared/components/mytabs';
import { useAppSelector } from 'shared/hooks';

import { supabase } from './supabase';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StatusBarTheme() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  console.log('Dark mode ?', isDarkMode);
  return <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} translucent={false} />;
}

export default function SessionGate() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  // Récupérer les états de loading depuis Redux
  const authLoading = useAppSelector((state) => state.auth.isLoading);
  const isGeneratingChart = useAppSelector((state) => state.auth.isGeneratingChart);

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const metadata = user?.user_metadata ?? {};

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

      setIsAuthenticated(true);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        dispatch(clearUser());
        setIsAuthenticated(false);
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const metadata = user.user_metadata ?? {};

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

          setIsAuthenticated(true);
        }
        setLoading(false);
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  if (loading || authLoading || isGeneratingChart) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBarTheme />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="App" component={MyTabs} />
              <Stack.Screen name="ZodiacSignsCompatibility" component={ZodiacSignsCompatibility} />
              <Stack.Screen name="BirthChartCompability" component={BirthChartCompability} />
              <Stack.Screen name="LearnScreen" component={LearnScreen} />
              <Stack.Screen name="AudioBookScreen" component={AudioBookScreen} />
              <Stack.Screen name="GuessWhoGame" component={GuessWhoGame} />
              <Stack.Screen name="QuizzScreen" component={QuizzScreen} />
              <Stack.Screen name="TrueOrFalseGame" component={TrueOrFalseGame} />
            </>
          ) : (
            <>
              <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
