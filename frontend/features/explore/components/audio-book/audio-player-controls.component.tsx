import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AudioPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  sound: any;
  loading: boolean;
  isDarkMode: boolean;
  onTogglePlayPause: () => void;
}

export const AudioPlayerControls: React.FC<AudioPlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  sound,
  loading,
  isDarkMode,
  onTogglePlayPause,
}) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const textLecteur = isDarkMode ? '#FFFFFF' : '#281109';

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t px-5 py-6"
      style={{
        backgroundColor: isDarkMode ? 'rgba(50, 34, 30, 0.95)' : 'rgba(242, 234, 224, 0.95)',
        borderTopColor: isDarkMode ? '#544A46' : '#D8D3D0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
      }}>
      {/* Waveform visualization */}
      <View className="mb-5 flex-row justify-center px-2.5">
        <View className="w-full flex-row items-end justify-between" style={{ height: 50 }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const isPlayed = i < (progressPercentage / 100) * 60;
            const height = Math.random() * 35 + 8;
            return (
              <View
                key={i}
                className="w-0.5 rounded-full"
                style={{
                  height,
                  backgroundColor: isPlayed
                    ? isDarkMode
                      ? '#F2EAE0'
                      : '#281109'
                    : isDarkMode
                      ? '#544A46'
                      : '#B8B3B0',
                  opacity: isPlayed ? 1 : 0.4,
                  transform: [{ scaleY: isPlayed ? 1 : 0.7 }],
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Audio controls with time */}
      <View className="mb-5 flex-row items-center justify-between">
        {/* Current weather */}
        <View className="min-w-12">
          <Text
            className="text-aref text-center text-base font-semibold"
            style={{ color: textLecteur }}>
            {formatTime(currentTime)}
          </Text>
        </View>

        {/* Central Play/Pause button */}
        <TouchableOpacity
          onPress={onTogglePlayPause}
          disabled={!sound || loading}
          className="h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg"
          style={{
            backgroundColor: !sound || loading ? '#999' : isDarkMode ? '#F2EAE0' : '#281109',
            borderColor: !sound || loading ? '#777' : isDarkMode ? '#D8D3D0' : '#442F29',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            opacity: !sound || loading ? 0.5 : 1,
          }}>
          {isPlaying ? (
            <MaterialIcons
              name="pause"
              size={36}
              color={!sound || loading ? '#555' : isDarkMode ? '#32221E' : '#F2EAE0'}
            />
          ) : (
            <MaterialIcons
              name="play-arrow"
              size={36}
              color={!sound || loading ? '#555' : isDarkMode ? '#32221E' : '#F2EAE0'}
            />
          )}
        </TouchableOpacity>

        {/* Total time */}
        <View className="min-w-12">
          <Text
            className="text-aref text-center text-base font-semibold"
            style={{ color: textLecteur }}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};
