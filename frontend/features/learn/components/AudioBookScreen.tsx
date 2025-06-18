import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useState, useEffect, useRef } from 'react';
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

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';

  const iconColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const textLecteur = isDarkMode ? '#FFFFFF' : '#281109';

  // Couleurs pour le surlignage
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

    console.log('=== CRÉATION DES MOTS AVEC TIMESTAMPS ===');
    console.log('Durée totale audio:', totalDuration);
    console.log('Blocs de texte:', textBlocks);

    textBlocks.forEach((block: TextBlock, blockIndex: number) => {
      const blockWords: string[] = block.content
        .split(/\s+/)
        .filter((word: string) => word.trim() !== '');
      const blockStartTime: number = block.timestamp;

      // Utiliser endTimestamp s'il existe, sinon calculer comme avant
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

    console.log(`Total de ${words.length} mots créés`);
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
        console.log(
          `Temps: ${newTime.toFixed(2)}s, Mot index: ${newWordIndex}, Mot: ${
            newWordIndex >= 0 && wordsRef.current[newWordIndex]
              ? wordsRef.current[newWordIndex].word
              : 'Aucun'
          }`
        );
      }
    }
  };

  // Fonction CORRIGÉE pour rendre le texte avec surlignage
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
            style={{
              backgroundColor: isHighlighted ? highlightBg : 'transparent',
              color: isHighlighted ? highlightText : textColor,
              paddingHorizontal: 2,
              paddingVertical: 1,
            }}>
            {word.trim()}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </Text>
        );
      });

      return (
        <Text className="text-aref" key={blockIndex} style={{ fontSize: 18, lineHeight: 28 }}>
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
        console.log('Chargement des données depuis:', jsonUrl);
        const response = await fetch(jsonUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Données chargées:', data);
        setChapterData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Utiliser les données JSON que vous avez fournies comme fallback
        const fallbackData: ChapterData = {
          title: 'Level 1: Introduction to Astrology',
          duration: 20,
          totalWords: 47,
          text: [
            {
              timestamp: 0,
              content: 'Astrology is the study of the stars and how they influence our lives.',
              wordsCount: 13,
              endTimestamp: 5,
            },
            {
              timestamp: 5,
              content:
                'The zodiac is divided into 12 signs, each representing a segment of the sky.',
              wordsCount: 14,
              endTimestamp: 10,
            },
            {
              timestamp: 10,
              content: 'Each sign has its own characteristics, strengths and weaknesses.',
              wordsCount: 9,
              endTimestamp: 15,
            },
            {
              timestamp: 15,
              content:
                'Astrology is not a religion but a symbolic language and a tool for self-reflection.',
              wordsCount: 14,
              endTimestamp: 20,
            },
          ],
        };
        setChapterData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [jsonUrl, title]);

  // Créer la structure des mots avec timestamps quand les données sont chargées ET que l'audio est chargé
  useEffect(() => {
    if (chapterData && duration > 0) {
      console.log('=== EFFET DE CRÉATION DES MOTS ===');
      console.log('ChapterData:', chapterData);
      console.log('Duration:', duration);

      const words = createWordsWithTimestamps(chapterData.text, duration);
      setWordsWithTimestamps(words);
      // IMPORTANT: Mettre à jour aussi la référence
      wordsRef.current = words;

      console.log('=== RÉSUMÉ DES MOTS CRÉÉS ===');
      console.log('Nombre total de mots:', words.length);
      if (words.length > 0) {
        console.log('Premier mot:', words[0]);
        console.log('Dernier mot:', words[words.length - 1]);
        console.log('Premiers 5 mots:');
        words.slice(0, 5).forEach((w, i) => {
          console.log(
            `  ${i}: "${w.word}" (${w.startTime.toFixed(2)}s - ${w.endTime.toFixed(2)}s)`
          );
        });
      }
    } else {
      console.log('Pas de données ou durée = 0:', { chapterData: !!chapterData, duration });
    }
  }, [chapterData, duration]);

  // Charger l'audio
  useEffect(() => {
    let isMounted = true;

    const loadSound = async () => {
      try {
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
            progressUpdateIntervalMillis: 100, // Mise à jour toutes les 100ms
          },
          onPlaybackStatusUpdate
        );

        if (isMounted && status.isLoaded) {
          setSound(audioSound);
          const audioDuration = (status.durationMillis ?? 0) / 1000;
          setDuration(audioDuration);
          console.log('Audio chargé, durée:', audioDuration);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
          <View style={{ marginLeft: 8 }}>
            <Text
              className="text-aref"
              style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, textColor]);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          {loading ? (
            <Text
              className="text-aref"
              style={{ color: textColor, fontSize: 18, textAlign: 'center' }}>
              Chargement...
            </Text>
          ) : (
            chapterData?.text && renderTextWithHighlight(chapterData.text)
          )}
        </View>
      </ScrollView>

      {/* Audio Player */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDarkMode ? 'rgba(50, 34, 30, 0.95)' : 'rgba(242, 234, 224, 0.95)',

          paddingHorizontal: 20,
          paddingVertical: 25,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#544A46' : '#D8D3D0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        }}>
        {/* Waveform visualization stylisée */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: 50,
              width: '100%',
              justifyContent: 'space-between',
            }}>
            {Array.from({ length: 60 }).map((_, i) => {
              const isPlayed = i < (progressPercentage / 100) * 60;
              const height = Math.random() * 35 + 8;
              return (
                <View
                  key={i}
                  style={{
                    width: 3,
                    height: height,
                    backgroundColor: isPlayed
                      ? isDarkMode
                        ? '#F2EAE0'
                        : '#281109'
                      : isDarkMode
                        ? '#544A46'
                        : '#B8B3B0',
                    borderRadius: 1.5,
                    opacity: isPlayed ? 1 : 0.4,
                    transform: [{ scaleY: isPlayed ? 1 : 0.7 }],
                  }}
                />
              );
            })}
          </View>
        </View>
        {/* Contrôles audio avec temps */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          {/* Temps actuel */}
          <View style={{ minWidth: 50 }}>
            <Text
              className="text-aref"
              style={{
                color: textLecteur,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {formatTime(currentTime)}
            </Text>
          </View>

          {/* Bouton Play/Pause central */}
          <TouchableOpacity
            onPress={togglePlayPause}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: isDarkMode ? '#F2EAE0' : '#281109',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 2,
              borderColor: isDarkMode ? '#D8D3D0' : '#442F29',
            }}>
            {isPlaying ? (
              <MaterialIcons name="pause" size={36} color={isDarkMode ? '#32221E' : '#F2EAE0'} />
            ) : (
              <MaterialIcons
                name="play-arrow"
                size={36}
                color={isDarkMode ? '#32221E' : '#F2EAE0'}
              />
            )}
          </TouchableOpacity>

          {/* Temps total */}
          <View style={{ minWidth: 50 }}>
            <Text
              className="text-aref"
              style={{
                color: textLecteur,
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
