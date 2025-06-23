import { Audio } from 'expo-av';
import type { AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

interface TextBlock {
  timestamp: number;
  content: string;
  wordsCount?: number;
  endTimestamp?: number;
}

interface WordWithTimestamp {
  word: string;
  startTime: number;
  endTime: number;
  blockIndex: number;
  wordIndex: number;
}

interface ChapterData {
  title: string;
  duration: number;
  totalWords?: number;
  text: TextBlock[];
}

export const useAudioPlayer = (jsonUrl: string, chapterData: ChapterData | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<WordWithTimestamp[]>([]);

  const wordsRef = useRef<WordWithTimestamp[]>([]);

  const extractLessonId = (jsonUrl: string): string => {
    const match = jsonUrl.match(/lesson_(\d+)\.json/);
    return match ? match[1] : '01';
  };

  const getAudioUrl = (jsonUrl: string): string => {
    const lessonId = extractLessonId(jsonUrl);
    const baseUrl =
      'https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/learn/';
    return `${baseUrl}lesson_${lessonId}_female.mp3`;
  };

  const createWordsWithTimestamps = (textBlocks: TextBlock[], totalDuration: number) => {
    const words: WordWithTimestamp[] = [];
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
      });
    });

    console.log(`Total de ${words.length} mots créés pour la lesson ${lessonId}`);
    return words;
  };

  const findCurrentWordIndex = (time: number, words: WordWithTimestamp[]) => {
    if (!words.length) return -1;

    for (let i = 0; i < words.length; i++) {
      const wordData = words[i];
      if (time >= wordData.startTime && time < wordData.endTime) {
        return i;
      }
    }

    if (time < words[0].startTime) return -1;
    if (time >= words[words.length - 1].endTime) return words.length - 1;
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

      const newWordIndex = findCurrentWordIndex(newTime, wordsRef.current);
      if (newWordIndex !== currentWordIndex) {
        setCurrentWordIndex(newWordIndex);
      }
    }
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
      console.error('Error while toggling play/pause:', error);
    }
  };

  const unloadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
  };

  useEffect(() => {
    if (chapterData && duration > 0) {
      const words = createWordsWithTimestamps(chapterData.text, duration);
      setWordsWithTimestamps(words);
      wordsRef.current = words;
    }
  }, [chapterData, duration, jsonUrl]);

  // load sound
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

        const audioUrl = getAudioUrl(jsonUrl);
        const lessonId = extractLessonId(jsonUrl);

        console.log(`Loading audio for the lesson ${lessonId}: ${audioUrl}`);

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
          console.log(`Audio loaded for the lesson ${lessonId}, duration: ${audioDuration}s`);
        }
      } catch (error) {
        console.error('Error loading sound:', error);
        const lessonId = extractLessonId(jsonUrl);
        Alert.alert(
          'Audio Error',
          `Unable to load audio file for lesson ${lessonId}. Check that the file exists.`
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

  return {
    isPlaying,
    sound,
    currentTime,
    duration,
    currentWordIndex,
    wordsWithTimestamps,
    togglePlayPause,
    unloadSound,
    extractLessonId,
  };
};
