import { useAppSelector } from 'shared/hooks';

interface NoiseEffectConfig {
  enabled: boolean;
  intensity: number;
  imageUri: string;
}

export const useNoiseEffect = (customIntensity?: number): NoiseEffectConfig => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const defaultIntensity = customIntensity ?? (isDarkMode ? 0.12 : 0.18);

  const noiseImageUri = isDarkMode
    ? 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/noise_texture_light.png'
    : 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/noise_texture_dark.png';

  return {
    enabled: true,
    intensity: defaultIntensity,
    imageUri: noiseImageUri,
  };
};
