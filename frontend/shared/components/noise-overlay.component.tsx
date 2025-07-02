import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useAppSelector } from 'shared/hooks';

interface NoiseOverlayProps {
  children: React.ReactNode;
  intensity?: number;
  style?: any;
  className?: string;
}

export default function NoiseOverlay({
  children,
  intensity = 0.15,
  style,
  className = 'flex-1',
}: NoiseOverlayProps) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [imageLoaded, setImageLoaded] = useState(false);

  const noiseImageUri = isDarkMode
    ? 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/noise_texture_light.png'
    : 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/app/noise_texture_dark.png';

  const { width, height } = Dimensions.get('window');

  return (
    <View className={className} style={[{ position: 'relative' }, style]}>
      {/* Main content */}
      {children}

      {/* Wrapper View for pointerEvents */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            pointerEvents: 'none',
            zIndex: 1000,
          },
        ]}>
        {/* Image noise */}
        <Image
          source={{ uri: noiseImageUri }}
          style={{
            width: width,
            height: height,
            opacity: imageLoaded ? intensity : 0,
          }}
          resizeMode="cover"
          onLoad={() => {
            console.log('Noise texture loaded');
            setImageLoaded(true);
          }}
          onError={(error) => {
            console.log('Noise texture error:', error.nativeEvent.error);
          }}
        />
      </View>
    </View>
  );
}
