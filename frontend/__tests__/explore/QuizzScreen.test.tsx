import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import QuizzScreen from 'features/explore/tests-quizz/quizz.screen';
import React from 'react';
import { Alert, Text } from 'react-native';
import { Provider } from 'react-redux';

// Mock icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialCommunityIcons: (props: any) => <Text>icon</Text>,
    MaterialIcons: (props: any) => <Text>icon</Text>,
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return (props: any) => <Text>icon</Text>;
});

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      setOptions: jest.fn(),
    }),
  };
});

// Render with Redux and navigation
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );
};

describe('QuizzScreen Tests', () => {
  it('A - QuizzScreen renders correctly (snapshot)', () => {
    const { toJSON } = renderWithProviders(<QuizzScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('B - Clicking unlocked chapter 01 navigates to GuessWhoGame', () => {
    const { getByText } = renderWithProviders(<QuizzScreen />);
    fireEvent.press(getByText('Guess Who Signs ?'));
    expect(mockNavigate).toHaveBeenCalledWith('GuessWhoGame');
  });

  it('C - Clicking unlocked chapter 02 navigates to TrueOrFalseGame', () => {
    const { getByText } = renderWithProviders(<QuizzScreen />);
    fireEvent.press(getByText('True or False'));
    expect(mockNavigate).toHaveBeenCalledWith('TrueOrFalseGame');
  });

  it('D - Clicking locked chapter 03 shows alert', () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<QuizzScreen />);
    fireEvent.press(getByText('Astro Memory'));
    expect(alertMock).toHaveBeenCalledWith(
      'Coming Soon!',
      expect.stringContaining('Astro Memory'),
      expect.any(Array),
      { cancelable: true }
    );
    alertMock.mockRestore();
  });
});
