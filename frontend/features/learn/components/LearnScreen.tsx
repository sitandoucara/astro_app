import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/types';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAppSelector } from 'shared/hooks';

export default function LearnScreen({ onBack }: any) {
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
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
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
      duration: '16 min 9 sec',
    },
    {
      id: '02',
      title: 'Level 2: The Zodiac Signs',
      duration: '16 min 10 sec',
    },
    {
      id: '03',
      title: 'Level 3: The Planets and Their',
      duration: '20 min 2 sec',
    },
    {
      id: '04',
      title: 'Level 4: The Ascendant and the Houses',
      duration: '23 min 8 sec',
    },
    {
      id: '05',
      title: 'Level 5: The Four Elements',
      duration: '15 min 5 sec',
    },
    {
      id: '06',
      title: 'Level 2: UI/UX Design Tools',
      duration: '19 min 2 sec',
    },
    {
      id: '07',
      title: 'Level 3: UI/UX Design Tools',
      duration: '19 min 2 sec',
    },
    {
      id: '08',
      title: 'Level 3: UI/UX Design Tools',
      duration: '19 min 2 sec',
    },
  ];

  // Fonction pour déterminer si un chapitre est verrouillé
  const isLocked = (title: string) => {
    return title.includes('Level 2') || title.includes('Level 3');
  };

  return (
    <View className="flex-1 justify-center p-2" style={{ backgroundColor }}>
      <View>
        {/* Titre */}

        {/* Liste des chapitres */}
        <View className="mt-8">
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('AudioBookScreen', {
                  title: chapter.title,
                  jsonUrl: `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/learn/lesson_${chapter.id}.json`,
                })
              }
              className={`mt-4 w-full rounded-3xl p-4 ${cardBg} border ${borderColor}`}>
              <View className="flex-row items-center">
                {/* Numéro du chapitre - centré horizontalement */}
                <View className="mr-4 w-10 items-center justify-center">
                  <Text className={`text-aref text-lg font-bold ${textPrimary}`}>{chapter.id}</Text>
                </View>

                {/* Contenu du chapitre */}
                <View className="flex-1">
                  <Text
                    className={`text-aref whitespace-nowrap text-base font-medium ${textPrimary} mb-1`}>
                    {chapter.title}
                  </Text>
                  <Text className={`text-aref whitespace-nowrap text-sm ${textSecondary}`}>
                    {chapter.duration}
                  </Text>
                </View>

                {/* Bouton play et cadenas */}
                <View className="ml-3 flex-row items-center">
                  {/* Cadenas pour Level 2 et 3 */}
                  {isLocked(chapter.title) && (
                    <View className="ml-2 h-8 w-8 items-center justify-center">
                      <MaterialIcons name="lock" size={20} style={{ color: iconColor }} />
                    </View>
                  )}

                  {/* Icône play */}
                  <View className="h-10 w-10 items-center justify-center">
                    <Ionicons name="play-circle" size={32} style={{ color: iconColor }} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
