import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'app/store';
import CompatibilityScreen from 'features/compatibility/compatibility.screen';
import { Provider } from 'react-redux';

describe('CompatibilityScreen', () => {
  it('renders both cards correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CompatibilityScreen />
        </NavigationContainer>
      </Provider>
    );

    // Check titles
    expect(getByText('Zodiac Sign Compatibility')).toBeTruthy();
    expect(getByText('Birth Charts Compatibility')).toBeTruthy();
  });

  it('navigates to ZodiacSignsCompatibility on press', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CompatibilityScreen />
        </NavigationContainer>
      </Provider>
    );

    const firstCard = getByText('Zodiac Sign Compatibility');
    fireEvent.press(firstCard);
  });

  it('navigates to BirthChartCompability on press', () => {
    const { getByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <CompatibilityScreen />
        </NavigationContainer>
      </Provider>
    );

    const secondCard = getByText('Birth Charts Compatibility');
    fireEvent.press(secondCard);
  });
});
