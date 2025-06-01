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
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
