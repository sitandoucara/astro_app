import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthHomeScreen from 'features/auth/auth-home-screen';
import { setUser, clearUser } from 'features/auth/auth.slice';
import SignInScreen from 'features/auth/sign-in-screen';
import SignUpScreen from 'features/auth/signup/sign-up-screen';
import ZodiacCompatibilityScreen from 'features/compatibility/zodiac-signs-compatibility/zodiac-compatibility.screen';
import FilterScreen from 'features/explore/filter/filter-screen';
import AudioBookScreen from 'features/explore/learn/audio-book/audio-book.screen';
import LearnScreen from 'features/explore/learn/learn.screen';
import GuessWhoGame from 'features/explore/quizz/guess-who-game/guess-who-game.screen';
import QuizzScreen from 'features/explore/quizz/quizz.screen';
import TrueOrFalseGame from 'features/explore/quizz/true-or-false-game/true-or-false-game.screen';
import EditProfile from 'features/profile/components/edit-profile.component';
import Language from 'features/profile/components/language.component';
import Voice from 'features/profile/components/voice.component';
import { useEffect, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import LoadingScreen from 'shared/components/loading-screen.component';
import MyTabs from 'shared/components/my-tabs.component';
import { useAppSelector } from 'shared/hooks';
import { RootStackParamList } from 'shared/navigation/types';

import { supabase } from './supabase';
import { createUserFromSupabaseData } from './user-helpers';

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

    // OPTIMIZATION: Retrieve session AND user in parallel + pre-load data
    const checkSession = async () => {
      try {
        console.log('Checking session and preparing data...');

        // Use Promise.all to parallelize requests
        const [sessionResult, userResult] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        const session = sessionResult.data.session;
        const user = userResult.data.user;

        if (!session || !user) {
          console.log('No valid session found');
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        console.log('Valid session found, setting up user...');

        // Immediate treatment without waiting
        dispatch(setUser(createUserFromSupabaseData(user, session.access_token)));

        console.log('User authenticated and data ready');
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);

      if (event === 'SIGNED_OUT' || !session) {
        dispatch(clearUser());
        setIsAuthenticated(false);
        setLoading(false);
      } else if (event === 'SIGNED_IN' && session) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            dispatch(setUser(createUserFromSupabaseData(user, session.access_token)));

            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error handling auth change:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    // Check session on startup
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // Display loading while the app is loading
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

              <Stack.Screen name="LearnScreen" component={LearnScreen} />
              <Stack.Screen name="AudioBookScreen" component={AudioBookScreen} />
              <Stack.Screen name="GuessWhoGame" component={GuessWhoGame} />
              <Stack.Screen name="QuizzScreen" component={QuizzScreen} />
              <Stack.Screen name="TrueOrFalseGame" component={TrueOrFalseGame} />
              <Stack.Screen name="Language" component={Language} />
              <Stack.Screen name="FilterScreen" component={FilterScreen} />
              <Stack.Screen name="Voice" component={Voice} />
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
