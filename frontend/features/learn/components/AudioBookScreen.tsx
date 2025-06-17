import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Modal, Alert, ScrollView } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import { Audio } from 'expo-av';
import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';

export default function AudioBookScreen({ onBack }: any) {
  const navigation = useNavigation();

  const route = useRoute();
  const { title, jsonUrl } = route.params as { title: string; jsonUrl: string };

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0); // en secondes
  const [duration, setDuration] = useState(0); // en secondes
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [allWords, setAllWords] = useState<string[]>([]);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';

  const iconColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';

  // Couleurs pour le surlignage
  const highlightBg = '#281109';
  const highlightText = '#F2EAE0';

  const [chapterData, setChapterData] = useState<{
    title: string;
    duration: number;
    text: { timestamp: number; content: string }[];
  } | null>(null);

  const goBack = async () => {
    // Nettoyer l'audio avant de partir
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    if (onBack) onBack();
    else navigation.goBack();
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors du toggle play/pause:', error);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Fonction pour calculer l'index du mot actuel basé sur le temps
  const calculateCurrentWordIndex = (time: number) => {
    if (!allWords.length || !duration) return 0;

    // Estimation: un mot toutes les 0.5 secondes (vitesse de lecture normale)
    const wordsPerSecond = allWords.length / duration;
    const estimatedIndex = Math.floor(time * wordsPerSecond);

    return Math.min(estimatedIndex, allWords.length - 1);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const safeStatus = status as AVPlaybackStatusSuccess;

    if (safeStatus.didJustFinish) {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentWordIndex(0);
    } else if (safeStatus.positionMillis !== undefined) {
      const newTime = safeStatus.positionMillis / 1000;
      setCurrentTime(newTime);

      // Mettre à jour l'index du mot actuel seulement si on est en train de jouer
      if (isPlaying) {
        setCurrentWordIndex(calculateCurrentWordIndex(newTime));
      }
    }
  };

  // Fonction pour extraire tous les mots du texte
  const extractAllWords = (textBlocks: { timestamp: number; content: string }[]) => {
    const words: string[] = [];
    textBlocks.forEach((block) => {
      const blockWords = block.content.split(/\s+/).filter((word) => word.trim() !== '');
      words.push(...blockWords);
    });
    return words;
  };

  // Fonction pour rendre le texte avec surlignage
  const renderTextWithHighlight = (textBlocks: { timestamp: number; content: string }[]) => {
    let globalWordIndex = 0;

    return textBlocks.map((block, blockIndex) => {
      const words = block.content.split(/\s+/).filter((word) => word.trim() !== '');

      const renderedWords = words.map((word, wordIndex) => {
        const isHighlighted = isPlaying && globalWordIndex === currentWordIndex;
        globalWordIndex++;

        return (
          <Text
            key={`${blockIndex}-${wordIndex}`}
            style={{
              backgroundColor: isHighlighted ? highlightBg : 'transparent',
              color: isHighlighted ? highlightText : textColor,
              borderRadius: 4,
              paddingHorizontal: 2,
              paddingVertical: 1,
            }}>
            {word}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </Text>
        );
      });

      return (
        <Text key={blockIndex} className="mb-6 text-base leading-6" style={{ color: textColor }}>
          {renderedWords}
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
        const data = await response.json();
        setChapterData(data);

        // Extraire tous les mots
        const words = extractAllWords(data.text);
        setAllWords(words);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Données de fallback pour le test
        const fallbackData = {
          title: title,
          duration: 0,
          text: [
            {
              timestamp: 0,
              content:
                'This is the sum of all that Saba Hafezi remembers from the day her mother and twin sister flew away forever, maybe to America, maybe to somewhere even farther out of reach. If you asked her to recall it, she would cobble all the pieces together as muddled memories within memories, two balmy Gilan days torn out of sequence, floating somewhere in her eleventh summer, and glued back together like this.',
            },
            {
              timestamp: 30,
              content:
                '"Where is Mahtab?" Saba asks again, and fidgets in the backseat of the car. Her father drives, while in the passenger seat her mother searches her purse for passports and plane tickets and all the papers needed to get out of Iran.',
            },
          ],
        };
        setChapterData(fallbackData);

        // Extraire tous les mots du fallback
        const words = extractAllWords(fallbackData.text);
        setAllWords(words);
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [jsonUrl, title]);

  // Charger l'audio
  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
        // Configuration audio pour iOS/Android
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound: audioSound, status } = await Audio.Sound.createAsync(
          {
            uri: 'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/learn/lesson_01_female.mp3',
          },
          {
            shouldPlay: false,
            progressUpdateIntervalMillis: 100, // Mise à jour plus fréquente pour un surlignage fluide
          },
          onPlaybackStatusUpdate
        );

        if (isMounted && status.isLoaded) {
          setSound(audioSound);
          setDuration((status.durationMillis ?? 0) / 1000);
        }
      } catch (error) {
        console.error('Erreur de chargement du son:', error);
        Alert.alert('Erreur', 'Impossible de charger le fichier audio');
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Réinitialiser l'index des mots quand on met en pause
  useEffect(() => {
    if (!isPlaying) {
      // Optionnel: garder le surlignage ou le réinitialiser
      // setCurrentWordIndex(0);
    }
  }, [isPlaying]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row gap-2">
            <Ionicons name="arrow-back" size={24} style={{ color: textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, textColor]);

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScrollView className="mt-9 flex-1 px-6 pb-6 pt-20">
        <View className="mx-auto max-w-md">
          {loading ? (
            <Text style={{ color: textColor }} className="text-center">
              Chargement...
            </Text>
          ) : (
            chapterData?.text && renderTextWithHighlight(chapterData.text)
          )}
        </View>
      </ScrollView>

      {/* Audio Player */}
      <View className="px-6 py-6" style={{ backgroundColor: isDarkMode ? '#FFFFFF' : '#1F1F1F' }}>
        <View className="mx-auto max-w-md">
          {/* Waveform visualization */}
          <View className="mb-4">
            <View className="mb-2 h-16 flex-row items-end justify-center">
              {/* Waveform bars */}
              {Array.from({ length: 50 }).map((_, i) => {
                const isPlayed = i < (progressPercentage / 100) * 50;
                return (
                  <View
                    key={i}
                    className="mx-0.5 w-1 rounded-full"
                    style={{
                      height: Math.random() * 40 + 10,
                      backgroundColor: isPlayed ? '#3B82F6' : '#D1D5DB',
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* Time display */}
          <View className="mb-4 flex-row justify-between">
            <Text className="text-sm" style={{ color: '#6B7280' }}>
              {formatTime(currentTime)}
            </Text>
            <Text className="text-sm" style={{ color: '#6B7280' }}>
              {formatTime(duration)}
            </Text>
          </View>

          {/* Play/Pause button */}
          <View className="flex-row justify-center">
            <TouchableOpacity
              onPress={togglePlayPause}
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: '#3B82F6' }}
              disabled={!sound}>
              {isPlaying ? (
                <Ionicons name="pause" size={24} color="white" />
              ) : (
                <Ionicons name="play" size={24} color="white" style={{ marginLeft: 2 }} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
