import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import AuthHomeScreen from 'features/auth/AuthHomeScreen';
import React from 'react';
import { Provider } from 'react-redux';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Render helper with Redux and Navigation
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );
};

describe('AuthHomeScreen Tests', () => {
  it('A - AuthHomeScreen renders correctly (snapshot)', () => {
    const { toJSON } = renderWithProviders(<AuthHomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("B - 'Create Account' button navigates to SignUp", () => {
    const { getByText } = renderWithProviders(<AuthHomeScreen />);
    fireEvent.press(getByText('Create Account'));
    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });

  it("C - 'Already have an account' button navigates to SignIn", () => {
    const { getByText } = renderWithProviders(<AuthHomeScreen />);
    fireEvent.press(getByText('Already have an account'));
    expect(mockNavigate).toHaveBeenCalledWith('SignIn');
  });
});
