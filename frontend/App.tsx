import { useFonts, ArefRuqaa_400Regular, ArefRuqaa_700Bold } from '@expo-google-fonts/aref-ruqaa';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthHomeScreen from 'features/auth/AuthHomeScreen';
import SignInScreen from 'features/auth/SignInScreen';
import SignUpScreen from 'features/auth/SignUpScreen';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import MyTabs from 'shared/components/mytabs';
import SessionGate from 'shared/lib/SessionGate';

import { store } from './app/store';
import type { RootStackParamList } from './navigation/types';

import './global.css';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    ArefRuqaa_400Regular,
    ArefRuqaa_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SessionGate />
        <Stack.Navigator initialRouteName="AuthHome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="App" component={MyTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
