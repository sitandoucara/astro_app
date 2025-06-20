import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAppSelector } from 'shared/hooks';

import { AudioPlayerControls } from './AudioPlayerControls';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface TextBlock {
  timestamp: number;
  content: string;
  wordsCount?: number;
  endTimestamp?: number;
}

interface ChapterData {
  title: string;
  duration: number;
  totalWords?: number;
  text: TextBlock[];
}

export default function AudioBookScreen({ onBack }: any) {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, jsonUrl } = route.params as { title: string; jsonUrl: string };

  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Utilisation du hook personnalisé
  const {
    isPlaying,
    sound,
    currentTime,
    duration,
    currentWordIndex,
    togglePlayPause,
    unloadSound,
    extractLessonId,
  } = useAudioPlayer(jsonUrl, chapterData);

  // Couleurs dynamiques
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const highlightBg = isDarkMode ? '#281109' : '#F2EAE0';
  const highlightText = isDarkMode ? '#F2EAE0' : '#281109';

  const goBack = async () => {
    await unloadSound();
    if (onBack) onBack();
    else navigation.goBack();
  };

  const renderTextWithHighlight = (textBlocks: TextBlock[]) => {
    let globalWordIndex: number = 0;

    return textBlocks.map((block: TextBlock, blockIndex: number) => {
      const words: string[] = block.content
        .split(/\s+/)
        .filter((word: string) => word.trim() !== '');

      const renderedWords = words.map((word: string, wordIndex: number) => {
        const isHighlighted: boolean = currentWordIndex === globalWordIndex;
        globalWordIndex++;

        return (
          <Text
            key={`${blockIndex}-${wordIndex}`}
            className="px-0.5 py-0.5"
            style={{
              backgroundColor: isHighlighted ? highlightBg : 'transparent',
              color: isHighlighted ? highlightText : textColor,
            }}>
            {word.trim()}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </Text>
        );
      });

      return (
        <Text className="text-aref text-lg leading-7" key={blockIndex}>
          {renderedWords}
          {blockIndex < textBlocks.length - 1 ? ' ' : ''}
        </Text>
      );
    });
  };

  // Charger les données JSON
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        setLoading(true);
        const response = await fetch(jsonUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChapterData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [jsonUrl, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity className="ml-4" onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={textColor} />
            <View className="ml-2">
              <Text className="text-aref text-left text-xl font-bold" style={{ color: textColor }}>
                {title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, textColor]);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          {loading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-aref mb-2 text-center text-lg" style={{ color: textColor }}>
                Chargement de la lesson {extractLessonId(jsonUrl)}...
              </Text>
              <Text
                className="text-aref text-center text-sm opacity-70"
                style={{ color: textColor }}>
                Préparation du texte et de l'audio
              </Text>
            </View>
          ) : (
            chapterData?.text && (
              <View className="mt-5">{renderTextWithHighlight(chapterData.text)}</View>
            )
          )}
        </View>
      </ScrollView>

      {/* Composant AudioPlayerControls */}
      <AudioPlayerControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        sound={sound}
        loading={loading}
        isDarkMode={isDarkMode}
        onTogglePlayPause={togglePlayPause}
      />
    </View>
  );
}
