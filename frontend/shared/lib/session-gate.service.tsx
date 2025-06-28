import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthHomeScreen from 'features/auth/auth-home-screen';
import { setUser, clearUser } from 'features/auth/auth.slice';
import SignInScreen from 'features/auth/sign-in-screen';
import SignUpScreen from 'features/auth/signup/sign-up-screen';
import BirthChartCompability from 'features/compatibility/components/birth-chart-compatibility.component';
import ZodiacCompatibilityScreen from 'features/compatibility/zodiac-signs-compatibility/zodiac-compatibility.screen';
import AudioBookScreen from 'features/explore/learn/audio-book/audio-book.screen';
import LearnScreen from 'features/explore/learn/learn.screen';
import GuessWhoGame from 'features/explore/quizz/guess-who-game/guess-who-game.screen';
import QuizzScreen from 'features/explore/quizz/quizz.screen';
import TrueOrFalseGame from 'features/explore/quizz/true-or-false-game/true-or-false-game.screen';
import EditProfile from 'features/profile/components/edit-profile.component';
import { RootStackParamList } from 'shared/navigation/types';
import { useEffect, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import LoadingScreen from 'shared/components/loading-screen.component';
import MyTabs from 'shared/components/my-tabs.component';
import { useAppSelector } from 'shared/hooks';

import { supabase } from './supabase';
import Language from 'features/profile/components/language.component';

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

  if (loading) {
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
              <Stack.Screen name="EditProfile" component={EditProfile} />
              <Stack.Screen
                name="ZodiacCompatibilityScreen"
                component={ZodiacCompatibilityScreen}
              />
              <Stack.Screen name="BirthChartCompability" component={BirthChartCompability} />
              <Stack.Screen name="LearnScreen" component={LearnScreen} />
              <Stack.Screen name="AudioBookScreen" component={AudioBookScreen} />
              <Stack.Screen name="GuessWhoGame" component={GuessWhoGame} />
              <Stack.Screen name="QuizzScreen" component={QuizzScreen} />
              <Stack.Screen name="TrueOrFalseGame" component={TrueOrFalseGame} />
              <Stack.Screen name="Language" component={Language} />
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
