import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import authReducer from '../features/auth/AuthSlice';
import languageReducer from '../shared/language/languageSlice';
import themeReducer from '../shared/theme/themeSlice';

const themePersistConfig = {
  key: 'theme',
  storage: AsyncStorage,
};

const languagePersistConfig = {
  key: 'language',
  storage: AsyncStorage,
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);
const persistedLanguageReducer = persistReducer(languagePersistConfig, languageReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: persistedThemeReducer,
    language: persistedLanguageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
