import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Alert, Image } from 'react-native';
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
              Test your knowledge of Astrology
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const chapters = [
    {
      id: '01',
      title: 'Guess Who Signs ?',
      duration: 'Test 1',
      sign: 'aries',
      icon: 'gamepad-variant',
    },
    {
      id: '02',
      title: 'True or False',
      duration: 'Test 2',
      sign: 'taurus',
      icon: 'help-circle',
    },
    {
      id: '03',
      title: 'Astro Memory',
      duration: 'Test 3',
      sign: 'gemini',
      icon: 'cards',
    },
  ];

  // Fonction pour obtenir l'URL de l'image du signe
  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName}_${theme}.png`;
  };

  // Fonction pour déterminer si un chapitre est verrouillé
  const isLocked = (chapter: (typeof chapters)[0]) => {
    // Les leçons 01 et 02 sont disponibles - la 03 est verrouillée
    const availableLessons = ['01', '02'];
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
      // Naviguer vers le bon jeu selon l'ID
      if (chapter.id === '01') {
        navigation.navigate('GuessWhoGame');
      } else if (chapter.id === '02') {
        navigation.navigate('TrueOrFalseGame');
      }
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
                      {/* Image du signe astrologique */}
                      <View className="mr-4 h-12 w-12 items-center justify-center">
                        <Image
                          source={{ uri: getSignImageUrl(chapter.sign) }}
                          style={{
                            width: 40,
                            height: 40,
                            opacity: locked ? 0.6 : 1,
                          }}
                          resizeMode="contain"
                        />
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

                      {/* Numéro du chapitre et bouton play/cadenas */}
                      <View className="ml-3 flex-row items-center gap-3">
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
                            <MaterialCommunityIcons
                              name="gamepad-variant"
                              size={32}
                              style={{ color: iconColor }}
                            />
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
