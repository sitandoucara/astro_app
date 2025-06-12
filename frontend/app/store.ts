// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from '../features/auth/AuthSlice';
import themeReducer from '../shared/theme/themeSlice';

const themePersistConfig = {
  key: 'theme',
  storage: AsyncStorage,
};

const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: persistedThemeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
