import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import ExploreScreen from 'features/explore/ExploreScreen';
import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

// MOCK ICONS TO AVOID `displayName` / NATIVE ERRORS
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    FontAwesome: (props: any) => <></>,
    MaterialCommunityIcons: (props: any) => <></>,
  };
});

// MOCK NAVIGATION
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
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

describe('ExploreScreen Tests', () => {
  it('A - Explore screen renders correctly (snapshot)', () => {
    const { toJSON } = renderWithProviders(<ExploreScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("B - 'Learn' button navigates to LearnScreen", () => {
    const { getByText } = renderWithProviders(<ExploreScreen />);
    fireEvent.press(getByText('Learn'));
    expect(mockNavigate).toHaveBeenCalledWith('LearnScreen');
  });

  it("C - 'Test & Quiz' button navigates to QuizzScreen", () => {
    const { getByText } = renderWithProviders(<ExploreScreen />);
    fireEvent.press(getByText('Test & Quiz'));
    expect(mockNavigate).toHaveBeenCalledWith('QuizzScreen');
  });

  it("D - 'Mini-books' button triggers an alert", () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<ExploreScreen />);
    fireEvent.press(getByText('Mini-books'));
    expect(alertMock).toHaveBeenCalledWith('Zodiac Sign Compatibility clicked!');
    alertMock.mockRestore();
  });
});
