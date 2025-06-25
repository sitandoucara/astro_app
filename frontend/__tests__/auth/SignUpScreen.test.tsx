import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import authReducer from 'features/auth/AuthSlice';
import SignUpScreen from 'features/auth/SignUpScreen';
import * as authAPI from 'features/auth/useAuth';
import { Provider } from 'react-redux';
import themeReducer from 'shared/theme/themeSlice';

// Mock fetch for timezone API
global.fetch = jest.fn();

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('shared/lib/supabase', () => ({
  supabase: {
    auth: {
      refreshSession: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

// Mock the location search hook
jest.mock('shared/hooks/useLocationSearch', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    results: [
      {
        display_name: 'Paris, France',
        lat: '48.8566',
        lon: '2.3522',
      },
      {
        display_name: 'London, UK',
        lat: '51.5074',
        lon: '-0.1278',
      },
    ],
    search: jest.fn(),
  })),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'MockDateTimePicker');

// Mock BlurView
jest.mock('expo-blur', () => ({
  BlurView: ({ children }: any) => children,
}));

type RootState = {
  auth: ReturnType<typeof authReducer>;
  theme: ReturnType<typeof themeReducer>;
};

const makeStore = (override?: Partial<RootState>) =>
  configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        isGeneratingChart: false,
      },
      theme: {
        isDarkMode: false,
      },
      ...override,
    } as RootState,
  });

const renderScreen = (store = makeStore()) => {
  const navigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  };
  const ui = render(
    <Provider store={store}>
      <SignUpScreen navigation={navigation as any} />
    </Provider>
  );
  return { ...ui, navigation, store };
};

describe('SignUpScreen', () => {
  let supabase: any;

  beforeAll(() => {
    supabase = require('shared/lib/supabase').supabase;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'Europe/Paris',
          timezone: 3600,
        }),
    });
  });

  describe('Step 1 - Email and Password', () => {
    it('renders step 1 with email and password inputs', () => {
      const { getByPlaceholderText, getByText } = renderScreen();

      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(getByText('Continue')).toBeTruthy();
      expect(getByText("Let's start your cosmic journey")).toBeTruthy();
    });

    it('validates email format', async () => {
      const { getByPlaceholderText, getByText } = renderScreen();

      const emailInput = getByPlaceholderText('Email');

      // Test invalid email
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(getByText('Invalid email format')).toBeTruthy();
      });

      // Test valid email
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent(emailInput, 'blur');

      await waitFor(() => {
        expect(() => getByText('Invalid email format')).toThrow();
      });
    });

    it('validates password length', async () => {
      const { getByPlaceholderText, getByText } = renderScreen();

      const passwordInput = getByPlaceholderText('Password');

      // Test short password
      fireEvent.changeText(passwordInput, '123');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(getByText('Password must be at least 6 characters')).toBeTruthy();
      });

      // Test valid password
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent(passwordInput, 'blur');

      await waitFor(() => {
        expect(() => getByText('Password must be at least 6 characters')).toThrow();
      });
    });

    it('proceeds to step 2 when continue is pressed with valid data', async () => {
      const { getByPlaceholderText, getByText } = renderScreen();

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const continueButton = getByText('Continue');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(continueButton);

      await waitFor(() => {
        expect(getByText('Who are you among the stars?')).toBeTruthy();
      });
    });
  });

  describe('Step 2 - User Info and Location', () => {
    const goToStep2 = async (component: any) => {
      const { getByPlaceholderText, getByText } = component;

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        expect(getByText('Who are you among the stars?')).toBeTruthy();
      });
    };

    it('renders step 2 with username input and gender selection', async () => {
      const component = renderScreen();
      await goToStep2(component);

      const { getByPlaceholderText, getByText } = component;

      expect(getByPlaceholderText('Username')).toBeTruthy();
      expect(getByText('Male')).toBeTruthy();
      expect(getByText('Female')).toBeTruthy();
      expect(getByText('Other')).toBeTruthy();
      expect(getByText('Select Birthplace')).toBeTruthy();
    });

    it('allows gender selection', async () => {
      const component = renderScreen();
      await goToStep2(component);

      const { getByText } = component;

      fireEvent.press(getByText('Female'));

      expect(getByText('Female')).toBeTruthy();
    });

    it('opens location modal when birthplace is pressed', async () => {
      const component = renderScreen();
      await goToStep2(component);

      const { getByText } = component;

      fireEvent.press(getByText('Select Birthplace'));

      await waitFor(() => {
        expect(getByText('Choose Birthplace')).toBeTruthy();
        expect(getByText('Type a city...')).toBeTruthy();
      });
    });

    it('allows location selection from search results', async () => {
      const component = renderScreen();
      await goToStep2(component);

      const { getByText } = component;

      // Open modal
      fireEvent.press(getByText('Select Birthplace'));

      await waitFor(() => {
        expect(getByText('Paris, France')).toBeTruthy();
      });

      // Select location
      fireEvent.press(getByText('Paris, France'));

      await waitFor(() => {
        expect(getByText('Paris, France')).toBeTruthy();
      });
    });

    it('proceeds to step 3 when all fields are filled', async () => {
      const component = renderScreen();
      await goToStep2(component);

      const { getByText, getByPlaceholderText } = component;

      // Fill username
      fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');

      // Select gender
      fireEvent.press(getByText('Male'));

      // Select location
      fireEvent.press(getByText('Select Birthplace'));
      await waitFor(() => {
        fireEvent.press(getByText('Paris, France'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('Continue'));
      });

      await waitFor(() => {
        expect(getByText('When were you born under the sky?')).toBeTruthy();
      });
    });
  });

  describe('Step 3 - Birth Date and Time', () => {
    const goToStep3 = async (component: any) => {
      const { getByPlaceholderText, getByText } = component;

      // Step 1
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // Step 2
        fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
        fireEvent.press(getByText('Male'));
        fireEvent.press(getByText('Select Birthplace'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('Paris, France'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('Continue'));
      });

      await waitFor(() => {
        expect(getByText('When were you born under the sky?')).toBeTruthy();
      });
    };

    it('renders step 3 with date and time selection', async () => {
      const component = renderScreen();
      await goToStep3(component);

      const { getByText } = component;

      expect(getByText('Choose Date of Birth')).toBeTruthy();
      expect(getByText('Choose Time of Birth')).toBeTruthy();
      expect(getByText('Confirm')).toBeTruthy();
    });

    it('opens date picker modal', async () => {
      const component = renderScreen();
      await goToStep3(component);

      const { getByText } = component;

      fireEvent.press(getByText('Choose Date of Birth'));

      await waitFor(() => {
        expect(getByText('Choose Your Date of Birth')).toBeTruthy();
      });
    });

    it('opens time picker modal', async () => {
      const component = renderScreen();
      await goToStep3(component);

      const { getByText } = component;

      fireEvent.press(getByText('Choose Time of Birth'));

      await waitFor(() => {
        expect(getByText('Choose Your Time of Birth')).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    const completeForm = async (component: any) => {
      const { getByPlaceholderText, getByText } = component;

      // Step 1
      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.press(getByText('Continue'));

      await waitFor(() => {
        // Step 2
        fireEvent.changeText(getByPlaceholderText('Username'), 'testuser');
        fireEvent.press(getByText('Male'));
        fireEvent.press(getByText('Select Birthplace'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('Paris, France'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('Continue'));
      });

      await waitFor(() => {
        // Step 3 - Submit
        fireEvent.press(getByText('Confirm'));
      });
    };

    it('calls signUp API with correct data when form is submitted', async () => {
      const signUpSpy = jest.spyOn(authAPI, 'signUp').mockResolvedValue({ error: null } as any);

      const component = renderScreen();
      const { navigation } = component;

      await completeForm(component);

      await waitFor(() => {
        expect(signUpSpy).toHaveBeenCalledWith(
          'test@example.com',
          'password123',
          'testuser',
          expect.any(Date),
          expect.any(Date),
          'Paris, France',
          'Europe/Paris',
          3600,
          48.8566,
          2.3522,
          'Male'
        );
        expect(global.alert).toHaveBeenCalledWith('Account created!');
        expect(navigation.navigate).toHaveBeenCalledWith('SignIn');
      });
    });

    it('shows error when timezone fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const component = renderScreen();

      await completeForm(component);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Unable to fetch timezone');
      });
    });
  });

  describe('Navigation', () => {
    it('sets up header with navigation', () => {
      const { navigation } = renderScreen();

      expect(navigation.setOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
        })
      );
    });
  });
});
