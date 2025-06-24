import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import SignInScreen from 'features/auth/SignInScreen';
import authReducer from 'features/auth/AuthSlice';
import themeReducer from '../../shared/theme/themeSlice';

import * as authAPI from 'features/auth/useAuth';
import * as chartAPI from 'features/chart/services/GenerateChart';
import { supabase } from 'shared/lib/supabase';

/* ────────────── global mocks ────────────── */
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return { Ionicons: () => <></> };
});
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

/* ────────────── RootState helper ─────────── */
type RootState = {
  auth: ReturnType<typeof authReducer>;
  theme: ReturnType<typeof themeReducer>;
};

const makeStore = (override?: Partial<RootState>) =>
  configureStore({
    reducer: { auth: authReducer, theme: themeReducer },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        isGeneratingChart: false,
      },
      theme: { isDarkMode: false },
      ...override,
    } as RootState,
  });

const renderScreen = (store = makeStore()) => {
  const navigation = { navigate: jest.fn() };
  const ui = render(
    <Provider store={store}>
      <SignInScreen navigation={navigation as any} />
    </Provider>
  );
  return { ...ui, navigation, store };
};

/* ────────────── tests ────────────── */
describe('SignInScreen', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders email & password inputs and Continue button', () => {
    const { getByPlaceholderText, getByText } = renderScreen();
    expect(getByPlaceholderText('email@gmail.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
  });

  it('navigates to SignUp when link pressed', () => {
    const { getByText, navigation } = renderScreen();
    fireEvent.press(getByText(/Create an Account/i));
    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('handles successful login flow', async () => {
    const fakeUser: any = {
      id: 'uid_123',
      user_metadata: {
        dateOfBirth: '2000-01-01',
        timeOfBirth: '12:00',
        latitude: 0,
        longitude: 0,
        timezoneOffset: 0,
        birthChartUrl: null,
      },
    };

    jest
      .spyOn(authAPI, 'signIn')
      .mockResolvedValueOnce({ data: { user: fakeUser }, error: null } as any);
    jest.spyOn(chartAPI, 'generateChart').mockResolvedValueOnce(undefined);
    jest.spyOn(supabase.auth, 'refreshSession').mockResolvedValueOnce(undefined as any);
    jest.spyOn(supabase.auth, 'getSession').mockResolvedValueOnce(undefined as any);

    const { getByPlaceholderText, getByText } = renderScreen();

    fireEvent.changeText(getByPlaceholderText('email@gmail.com'), 'demo@mail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'secret');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(authAPI.signIn).toHaveBeenCalled();
      expect(chartAPI.generateChart).toHaveBeenCalled();
      expect(supabase.auth.refreshSession).toHaveBeenCalled();
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  it('shows alert on login failure', async () => {
    jest
      .spyOn(authAPI, 'signIn')
      .mockResolvedValueOnce({ data: null, error: { message: 'Invalid credentials' } } as any);
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = renderScreen();

    fireEvent.changeText(getByPlaceholderText('email@gmail.com'), 'fail@mail.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrong');
    fireEvent.press(getByText('Continue'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
