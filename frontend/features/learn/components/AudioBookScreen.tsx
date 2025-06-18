import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function AudioBookScreen({ onBack }: any) {
  const navigation = useNavigation();

  const route = useRoute();
  const { title, jsonUrl } = route.params as { title: string; jsonUrl: string };

  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  // Structure pour stocker les mots avec leurs timestamps
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<
    {
      word: string;
      startTime: number;
      endTime: number;
      blockIndex: number;
      wordIndex: number;
    }[]
  >([]);

  // Utiliser useRef pour avoir une référence stable des mots
  const wordsRef = useRef<typeof wordsWithTimestamps>([]);

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Couleurs dynamiques - gardées en style car elles dépendent de l'état
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const textLecteur = isDarkMode ? '#FFFFFF' : '#281109';
  const highlightBg = isDarkMode ? '#281109' : '#F2EAE0';
  const highlightText = isDarkMode ? '#F2EAE0' : '#281109';

  // Interface pour typer les données du chapitre
  interface ChapterData {
    title: string;
    duration: number;
    totalWords?: number;
    text: TextBlock[];
  }

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);

  // Fonction pour extraire l'ID de la leçon depuis l'URL JSON
  const extractLessonId = (jsonUrl: string): string => {
    const match = jsonUrl.match(/lesson_(\d+)\.json/);
    return match ? match[1] : '01';
  };

  // Fonction pour construire l'URL audio dynamiquement
  const getAudioUrl = (jsonUrl: string): string => {
    const lessonId = extractLessonId(jsonUrl);
    const baseUrl =
      'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/learn/';
    return `${baseUrl}lesson_${lessonId}_female.mp3`;
  };

  const goBack = async () => {
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

  // Interface pour typer les blocs de texte
  interface TextBlock {
    timestamp: number;
    content: string;
    wordsCount?: number;
    endTimestamp?: number;
  }

  // Fonction AMÉLIORÉE pour créer la structure des mots avec timestamps
  const createWordsWithTimestamps = (textBlocks: TextBlock[], totalDuration: number) => {
    const words: {
      word: string;
      startTime: number;
      endTime: number;
      blockIndex: number;
      wordIndex: number;
    }[] = [];

    const lessonId = extractLessonId(jsonUrl);
    textBlocks.forEach((block: TextBlock, blockIndex: number) => {
      const blockWords: string[] = block.content
        .split(/\s+/)
        .filter((word: string) => word.trim() !== '');
      const blockStartTime: number = block.timestamp;

      const blockEndTime: number =
        block.endTimestamp ||
        (blockIndex < textBlocks.length - 1 ? textBlocks[blockIndex + 1].timestamp : totalDuration);

      const blockDuration: number = Math.max(0.5, blockEndTime - blockStartTime);

      console.log(
        `Bloc ${blockIndex}: ${blockStartTime}s -> ${blockEndTime}s (${blockDuration}s) - ${blockWords.length} mots`
      );

      // Distribuer le temps équitablement entre les mots du bloc
      const timePerWord: number = blockWords.length > 0 ? blockDuration / blockWords.length : 0;

      blockWords.forEach((word: string, wordIndex: number) => {
        const wordStartTime: number = blockStartTime + wordIndex * timePerWord;
        const wordEndTime: number = wordStartTime + timePerWord;

        words.push({
          word: word.trim(),
          startTime: wordStartTime,
          endTime: wordEndTime,
          blockIndex,
          wordIndex,
        });

        // Log pour les premiers mots de chaque bloc
        if (wordIndex < 3) {
          console.log(
            `  Mot "${word.trim()}": ${wordStartTime.toFixed(2)}s -> ${wordEndTime.toFixed(2)}s`
          );
        }
      });
    });

    console.log(`Total de ${words.length} mots créés pour la lesson ${lessonId}`);
    return words;
  };

  // Fonction AMÉLIORÉE pour trouver l'index du mot actuel
  const findCurrentWordIndex = (time: number, words: typeof wordsWithTimestamps) => {
    if (!words.length) {
      console.log('Aucun mot disponible dans findCurrentWordIndex');
      return -1;
    }

    // Recherche du mot qui correspond au temps actuel
    for (let i = 0; i < words.length; i++) {
      const wordData = words[i];
      if (time >= wordData.startTime && time < wordData.endTime) {
        return i;
      }
    }

    // Si on est avant le premier mot
    if (time < words[0].startTime) {
      return -1;
    }

    // Si on est après le dernier mot
    if (time >= words[words.length - 1].endTime) {
      return words.length - 1;
    }

    return -1;
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    const safeStatus = status as AVPlaybackStatusSuccess;

    if (safeStatus.didJustFinish) {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentWordIndex(-1);
    } else if (safeStatus.positionMillis !== undefined) {
      const newTime = safeStatus.positionMillis / 1000;
      setCurrentTime(newTime);

      // Utiliser wordsRef.current au lieu de wordsWithTimestamps
      const newWordIndex = findCurrentWordIndex(newTime, wordsRef.current);
      if (newWordIndex !== currentWordIndex) {
        setCurrentWordIndex(newWordIndex);
        const lessonId = extractLessonId(jsonUrl);
        console.log(
          `[Lesson ${lessonId}] Temps: ${newTime.toFixed(2)}s, Mot index: ${newWordIndex}, Mot: ${
            newWordIndex >= 0 && wordsRef.current[newWordIndex]
              ? wordsRef.current[newWordIndex].word
              : 'Aucun'
          }`
        );
      }
    }
  };

  const renderTextWithHighlight = (textBlocks: TextBlock[]) => {
    let globalWordIndex: number = 0;

    return textBlocks.map((block: TextBlock, blockIndex: number) => {
      const words: string[] = block.content
        .split(/\s+/)
        .filter((word: string) => word.trim() !== '');

      const renderedWords = words.map((word: string, wordIndex: number) => {
        const isHighlighted: boolean = currentWordIndex === globalWordIndex;
        const currentGlobalIndex: number = globalWordIndex;
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
        //const lessonId = extractLessonId(jsonUrl);
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

  // Créer la structure des mots avec timestamps quand les données sont chargées ET que l'audio est chargé
  useEffect(() => {
    if (chapterData && duration > 0) {
      //const lessonId = extractLessonId(jsonUrl);

      const words = createWordsWithTimestamps(chapterData.text, duration);
      setWordsWithTimestamps(words);
      wordsRef.current = words;
      if (words.length > 0) {
        words.slice(0, 5).forEach((w, i) => {
          console.log(
            `  ${i}: "${w.word}" (${w.startTime.toFixed(2)}s - ${w.endTime.toFixed(2)}s)`
          );
        });
      }
    } else {
      console.log('Pas de données ou durée = 0:', { chapterData: !!chapterData, duration });
    }
  }, [chapterData, duration, jsonUrl]);

  // Charger l'audio - VERSION DYNAMIQUE
  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Construire l'URL audio dynamiquement
        const audioUrl = getAudioUrl(jsonUrl);
        const lessonId = extractLessonId(jsonUrl);

        console.log(`Chargement de l'audio pour la lesson ${lessonId}: ${audioUrl}`);

        const { sound: audioSound, status } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          {
            shouldPlay: false,
            progressUpdateIntervalMillis: 100,
          },
          onPlaybackStatusUpdate
        );

        if (isMounted && status.isLoaded) {
          setSound(audioSound);
          const audioDuration = (status.durationMillis ?? 0) / 1000;
          setDuration(audioDuration);
          console.log(`Audio chargé pour la lesson ${lessonId}, durée: ${audioDuration}s`);
        }
      } catch (error) {
        console.error('Erreur de chargement du son:', error);
        const lessonId = extractLessonId(jsonUrl);
        Alert.alert(
          'Erreur Audio',
          `Impossible de charger le fichier audio pour la lesson ${lessonId}. Vérifiez que le fichier existe.`
        );
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [jsonUrl]);

  useLayoutEffect(() => {
    //const lessonId = extractLessonId(jsonUrl);
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
  }, [navigation, title, textColor, jsonUrl]);

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

      {/* Audio Player */}
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
        {/* Waveform visualization stylisée */}
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

        {/* Contrôles audio avec temps */}
        <View className="mb-5 flex-row items-center justify-between">
          {/* Temps actuel */}
          <View className="min-w-12">
            <Text
              className="text-aref text-center text-base font-semibold"
              style={{ color: textLecteur }}>
              {formatTime(currentTime)}
            </Text>
          </View>

          {/* Bouton Play/Pause central */}
          <TouchableOpacity
            onPress={togglePlayPause}
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

          {/* Temps total */}
          <View className="min-w-12">
            <Text
              className="text-aref text-center text-base font-semibold"
              style={{ color: textLecteur }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
