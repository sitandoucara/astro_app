import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';

export default function QuizzScreen({ onBack }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';

  const iconColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16, backgroundColor }} onPress={goBack}>
          <View className="flex-row gap-2">
            <Ionicons name="arrow-back" size={24} style={{ color: textColor }} />
            <Text
              className="text-aref m-l-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              Learn Astrology
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const chapters = [
    {
      id: '01',
      title: 'Level 1: Introduction to Astrology',
      duration: '20 sec',
    },
    {
      id: '02',
      title: 'Level 1: The Zodiac Signs',
      duration: '20 sec',
    },
    {
      id: '03',
      title: 'Level 1: The Planets and Their',
      duration: '20 sec',
    },
    {
      id: '04',
      title: 'Level 2: The Ascendant ',
      duration: '',
    },
    {
      id: '05',
      title: 'Level 2: The Four Elements',
      duration: '',
    },
    {
      id: '06',
      title: 'Level 2: Planetary Aspects',
      duration: '',
    },
    {
      id: '07',
      title: 'Level 3: Birth Chart Interpretation',
      duration: '',
    },
    {
      id: '08',
      title: 'Level 3: Synastry and Compatibility',
      duration: '',
    },
    {
      id: '09',
      title: 'Level 3: Planetary Transits',
      duration: '',
    },
    {
      id: '10',
      title: 'Level 3: Retrogrades ',
      duration: '',
    },
  ];

  // Fonction pour déterminer si un chapitre est verrouillé
  const isLocked = (chapter: (typeof chapters)[0]) => {
    // Les leçons 01, 02, 03 sont disponibles - les autres sont verrouillées
    const availableLessons = ['01', '02', '03'];
    return !availableLessons.includes(chapter.id);
  };

  // Fonction pour gérer le clic sur un chapitre
  const handleChapterPress = (chapter: (typeof chapters)[0]) => {
    if (isLocked(chapter)) {
      // Afficher l'alerte pour les leçons verrouillées
      Alert.alert(
        'Coming Soon!',
        `${chapter.title} will be available soon !`,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: true }
      );
    } else {
      // Naviguer vers l'AudioBookScreen pour les leçons disponibles
      navigation.navigate('GuessWhoGame');
    }
  };

  // Fonction pour obtenir le style visuel des cartes verrouillées
  const getCardStyle = (chapter: (typeof chapters)[0]) => {
    if (isLocked(chapter)) {
      return {
        opacity: 0.6,
        className: `mt-4 w-full rounded-3xl p-4 ${cardBg} border ${borderColor}`,
      };
    }
    return {
      opacity: 1,
      className: `mt-4 w-full rounded-3xl p-4 ${cardBg} border ${borderColor}`,
    };
  };

  // Fonction pour obtenir le style du texte selon l'état de verrouillage
  const getTextStyle = (chapter: (typeof chapters)[0], baseStyle: string) => {
    if (isLocked(chapter)) {
      return `${baseStyle} opacity-60`;
    }
    return baseStyle;
  };

  return (
    <View className="flex-1 p-2" style={{ backgroundColor }}>
      <ScrollView className="mt-20">
        <View>
          <View className="mt-8">
            {chapters.map((chapter, idx) => {
              const cardStyle = getCardStyle(chapter);
              const locked = isLocked(chapter);

              return (
                <Animated.View key={chapter.id} entering={FadeInUp.delay(idx * 50).duration(400)}>
                  <TouchableOpacity
                    activeOpacity={locked ? 0.7 : 0.8}
                    onPress={() => handleChapterPress(chapter)}
                    className={cardStyle.className}
                    style={{ opacity: cardStyle.opacity }}>
                    <View className="flex-row items-center">
                      {/* Numéro du chapitre - centré horizontalement */}
                      <View className="mr-4 w-10 items-center justify-center">
                        <Text
                          className={getTextStyle(
                            chapter,
                            `text-aref text-lg font-bold ${textPrimary}`
                          )}>
                          {chapter.id}
                        </Text>
                      </View>

                      {/* Contenu du chapitre */}
                      <View className="flex-1">
                        <Text
                          className={getTextStyle(
                            chapter,
                            `text-aref whitespace-nowrap text-base font-medium ${textPrimary} mb-1`
                          )}>
                          {chapter.title}
                        </Text>
                        <Text
                          className={getTextStyle(
                            chapter,
                            `text-aref whitespace-nowrap text-sm ${textSecondary}`
                          )}>
                          {chapter.duration}
                        </Text>
                      </View>

                      {/* Bouton play et cadenas */}
                      <View className="ml-3 flex-row items-center">
                        {/* Cadenas pour les leçons verrouillées */}
                        {locked ? (
                          <View className="h-10 w-10 items-center justify-center">
                            <MaterialIcons
                              name="lock"
                              size={24}
                              style={{ color: iconColor, opacity: 0.7 }}
                            />
                          </View>
                        ) : (
                          /* Icône play pour les leçons disponibles */
                          <View className="h-10 w-10 items-center justify-center">
                            <Ionicons name="play-circle" size={32} style={{ color: iconColor }} />
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
