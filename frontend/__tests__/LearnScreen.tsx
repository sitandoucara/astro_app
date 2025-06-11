import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import LearnScreen from 'features/learn/LearnScreen';
import React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <NavigationContainer>{component}</NavigationContainer>
    </Provider>
  );
};

describe('LearnScreen Tests', () => {
  it("A - L'écran Learn s'affiche sans crash", () => {
    const { toJSON } = renderWithProviders(<LearnScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("B - Le bouton 'Learn' est présent", () => {
    const { getByText } = renderWithProviders(<LearnScreen />);
    expect(getByText('Learn')).toBeTruthy();
  });

  it("C - Le bouton 'Mini-books' est présent", () => {
    const { getByText } = renderWithProviders(<LearnScreen />);
    expect(getByText('Mini-books')).toBeTruthy();
  });

  it("D - Le bouton 'Test & Quiz' est présent", () => {
    const { getByText } = renderWithProviders(<LearnScreen />);
    expect(getByText('Test & Quiz')).toBeTruthy();
  });

  it('E - Le bouton déclenche bien une alerte', () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<LearnScreen />);
    fireEvent.press(getByText('Learn'));
    expect(alertMock).toHaveBeenCalled();
    alertMock.mockRestore();
  });
});
