import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceState {
  currentVoice: 'female' | 'male';
}

const initialState: VoiceState = {
  currentVoice: 'female',
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setVoice: (state, action: PayloadAction<'female' | 'male'>) => {
      state.currentVoice = action.payload;
    },
  },
});

export const { setVoice } = voiceSlice.actions;
export default voiceSlice.reducer;
