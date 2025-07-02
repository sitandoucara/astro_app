import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeColors } from 'shared/theme/theme-color.hook';

import NoiseOverlay from './noise-overlay.component';

interface ScreenWrapperProps {
  children: React.ReactNode;
  noiseIntensity?: number;
  style?: ViewStyle;
  className?: string;
  noNoise?: boolean;
}

export default function ScreenWrapper({
  children,
  noiseIntensity,
  style,
  className,
  noNoise = false,
}: ScreenWrapperProps) {
  const colors = useThemeColors();

  const containerStyle = [
    {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    style,
  ];

  if (noNoise) {
    return (
      <View style={containerStyle} className={className}>
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle} className={className}>
      <NoiseOverlay intensity={noiseIntensity}>{children}</NoiseOverlay>
    </View>
  );
}
