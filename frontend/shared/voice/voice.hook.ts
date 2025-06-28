import { RootState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';

import { setVoice } from './voice.slice';

export const useVoice = () => {
  const dispatch = useDispatch();
  const currentVoice = useSelector((state: RootState) => state.voice.currentVoice);

  const changeVoice = (voice: 'female' | 'male') => {
    dispatch(setVoice(voice));
  };

  const getCurrentVoiceLabel = () => {
    return currentVoice === 'female' ? 'Female' : 'Male';
  };

  return {
    currentVoice,
    changeVoice,
    getCurrentVoiceLabel,
  };
};
