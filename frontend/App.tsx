import { useFonts, ArefRuqaa_400Regular, ArefRuqaa_700Bold } from '@expo-google-fonts/aref-ruqaa';
import { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from 'shared/components/LoadingScreen';
import SessionGate from 'shared/lib/SessionGate';

import { store, persistor } from './app/store';
import './shared/i18n/i18n';

import './global.css';

//remove warning
LogBox.ignoreAllLogs();

export default function App() {
  const [fontsLoaded] = useFonts({
    ArefRuqaa_400Regular,
    ArefRuqaa_700Bold,
  });

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        setShowLoading(false);
      }, 1000);
    }
  }, [fontsLoaded]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {showLoading ? <LoadingScreen /> : <SessionGate />}
      </PersistGate>
    </Provider>
  );
}
