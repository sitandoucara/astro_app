import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import LearnScreen from 'features/explore/components/LearnScreen';
import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

// MOCK ICONS
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: (props: any) => <></>,
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  return (props: any) => <></>;
});

// MOCK NAVIGATION
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
  };
});

// RENDER FUNCTION WITH STORE + NAVIGATION
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );
};

describe('LearnScreen Tests', () => {
  it('A - Learn screen renders correctly (snapshot)', () => {
    const { toJSON } = renderWithProviders(<LearnScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('B - Unlocked lessons trigger navigation', () => {
    const { getByText } = renderWithProviders(<LearnScreen />);
    fireEvent.press(getByText('Level 1: The Zodiac Signs'));
    expect(mockNavigate).toHaveBeenCalledWith(
      'AudioBookScreen',
      expect.objectContaining({
        title: expect.stringContaining('Zodiac Signs'),
        jsonUrl: expect.stringContaining('lesson_02.json'),
      })
    );
  });

  it('C - Locked lessons trigger an alert', () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<LearnScreen />);
    fireEvent.press(getByText('Level 2: The Ascendant '));
    expect(alertMock).toHaveBeenCalledWith(
      'Coming Soon!',
      expect.stringContaining('Level 2: The Ascendant'),
      expect.any(Array),
      { cancelable: true }
    );
    alertMock.mockRestore();
  });
});
