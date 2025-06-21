import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanetData, AscendantData } from 'types/astrology';

export interface User {
  id: string;
  email: string;
  username?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  birthplace?: string;
  timezoneName?: string;
  timezoneOffset?: number;
  latitude?: number;
  longitude?: number;
  gender?: string;
  birthChartUrl?: string;
  planets?: Record<string, PlanetData>;
  ascendant?: AscendantData;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isGeneratingChart: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isGeneratingChart: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGeneratingChart: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingChart = action.payload;
    },
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.isGeneratingChart = false;
    },
    updateUserMetadata: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isGeneratingChart = false;
    },
  },
});

export const { setUser, updateUserMetadata, clearUser, setLoading, setGeneratingChart } =
  authSlice.actions;

export default authSlice.reducer;
