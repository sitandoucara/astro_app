import { useFonts, ArefRuqaa_400Regular, ArefRuqaa_700Bold } from '@expo-google-fonts/aref-ruqaa';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './components/navigation/mytabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    ArefRuqaa_400Regular,
    ArefRuqaa_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MyTabs />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
