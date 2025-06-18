import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { useAppSelector } from 'shared/hooks';
import Animated, { FadeInUp, FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';

export default function GuessWhoGame({ onBack }: any) {
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Couleurs dynamiques basées sur votre design
  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';
  const correctColor = isDarkMode ? '#2D5A27' : '#4ADE80';
  const incorrectColor = isDarkMode ? '#7F1D1D' : '#EF4444';

  // Données des signes astrologiques avec leurs symboles
  const zodiacSigns = [
    { name: 'Bélier', symbol: '♈', element: 'Feu', dates: '21 mars - 19 avril' },
    { name: 'Taureau', symbol: '♉', element: 'Terre', dates: '20 avril - 20 mai' },
    { name: 'Gémeaux', symbol: '♊', element: 'Air', dates: '21 mai - 20 juin' },
    { name: 'Cancer', symbol: '♋', element: 'Eau', dates: '21 juin - 22 juillet' },
    { name: 'Lion', symbol: '♌', element: 'Feu', dates: '23 juillet - 22 août' },
    { name: 'Vierge', symbol: '♍', element: 'Terre', dates: '23 août - 22 septembre' },
    { name: 'Balance', symbol: '♎', element: 'Air', dates: '23 septembre - 22 octobre' },
    { name: 'Scorpion', symbol: '♏', element: 'Eau', dates: '23 octobre - 21 novembre' },
    { name: 'Sagittaire', symbol: '♐', element: 'Feu', dates: '22 novembre - 21 décembre' },
    { name: 'Capricorne', symbol: '♑', element: 'Terre', dates: '22 décembre - 19 janvier' },
    { name: 'Verseau', symbol: '♒', element: 'Air', dates: '20 janvier - 18 février' },
    { name: 'Poissons', symbol: '♓', element: 'Eau', dates: '19 février - 20 mars' },
  ];

  // États du jeu
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  // Générer des questions aléatoirement
  const generateQuestions = () => {
    const shuffled = [...zodiacSigns].sort(() => Math.random() - 0.5);
    const gameQuestions = shuffled.slice(0, 8).map((sign) => {
      // Créer 3 mauvaises réponses aléatoires
      const wrongAnswers = zodiacSigns
        .filter((s) => s.name !== sign.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((s) => s.name);

      // Mélanger toutes les réponses
      const allAnswers = [sign.name, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        ...sign,
        answers: allAnswers,
      };
    });

    setQuestions(gameQuestions);
  };

  // Initialiser le jeu
  useEffect(() => {
    generateQuestions();
  }, []);

  // Gérer la sélection d'une réponse
  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentQuestion].name;

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
    } else {
      setStreak(0);
    }

    // Passer à la question suivante après 1.5 secondes
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  // Redémarrer le jeu
  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameFinished(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    generateQuestions();
  };

  // Obtenir le message de fin selon le score
  const getEndMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return '🌟 Parfait ! Maître astrologue !';
    if (percentage >= 75) return '⭐ Excellent ! Très bonne connaissance !';
    if (percentage >= 50) return '👍 Bien joué ! Continuez à apprendre !';
    return '💪 Pas mal ! Encore un peu de pratique !';
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={textColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: textColor }}>
              Guess Who
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, textColor]);

  if (questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor }}>
        <Text className="text-aref text-lg" style={{ color: textColor }}>
          Préparation du jeu...
        </Text>
      </View>
    );
  }

  if (gameFinished) {
    return (
      <View className="flex-1" style={{ backgroundColor }}>
        <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600)} className="mt-8 items-center">
            {/* Score final */}
            <View className={`items-center rounded-3xl p-8 ${cardBg} border ${borderColor} mb-6`}>
              <Text className="text-aref mb-4 text-6xl">🏆</Text>
              <Text className={`text-aref mb-2 text-2xl font-bold ${textPrimary}`}>
                Jeu terminé !
              </Text>
              <Text className={`text-aref mb-4 text-lg ${textSecondary} text-center`}>
                {getEndMessage()}
              </Text>

              {/* Statistiques détaillées */}
              <View className="w-full">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Score final</Text>
                  <Text className={`text-aref text-xl font-bold ${textPrimary}`}>
                    {score}/{questions.length}
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Pourcentage</Text>
                  <Text className={`text-aref text-xl font-bold ${textPrimary}`}>
                    {Math.round((score / questions.length) * 100)}%
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Meilleure série</Text>
                  <Text className={`text-aref text-xl font-bold ${textPrimary}`}>
                    {maxStreak} 🔥
                  </Text>
                </View>
              </View>
            </View>

            {/* Boutons d'action */}
            <View className="w-full space-y-4">
              <TouchableOpacity
                onPress={restartGame}
                className={`w-full items-center rounded-2xl p-4 ${cardBg} border ${borderColor}`}
                activeOpacity={0.8}>
                <View className="flex-row items-center">
                  <MaterialIcons name="refresh" size={24} color={iconColor} />
                  <Text className={`text-aref ml-3 text-lg font-semibold ${textPrimary}`}>
                    Rejouer
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={goBack}
                className={`w-full items-center rounded-2xl border-2 p-4`}
                style={{ borderColor: textColor }}
                activeOpacity={0.8}>
                <Text className={`text-aref text-lg font-semibold ${textPrimary}`}>
                  Retour au menu
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const currentSign = questions[currentQuestion];

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
        {/* Header avec progression */}
        <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={`text-aref text-lg ${textSecondary}`}>
              Question {currentQuestion + 1}/{questions.length}
            </Text>
            <View className="flex-row items-center">
              <Text className={`text-aref text-lg font-bold ${textPrimary} mr-2`}>{score}</Text>
              <MaterialIcons name="star" size={20} color={iconColor} />
              {streak > 1 && (
                <Text className={`text-aref ml-2 text-sm ${textPrimary}`}>🔥{streak}</Text>
              )}
            </View>
          </View>

          {/* Barre de progression */}
          <View
            className={`h-2 w-full rounded-full border ${borderColor}`}
            style={{ backgroundColor: isDarkMode ? '#D8D3D0' : '#544A46' }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: isDarkMode ? '#32221E' : '#F2EAE0',
              }}
            />
          </View>
        </Animated.View>

        {/* Question principale */}
        <Animated.View entering={SlideInLeft.duration(500)} className="mb-8 items-center">
          <View className={`items-center rounded-3xl p-8 ${cardBg} border ${borderColor} mb-6`}>
            <Text className={`text-aref mb-4 text-lg ${textSecondary} text-center`}>
              Quel est ce signe astrologique ?
            </Text>

            {/* Symbole du signe */}
            <View className="mb-4 items-center">
              <Text className="mb-4 text-8xl" style={{ color: textColor }}>
                {currentSign.symbol}
              </Text>
              <Text className={`text-aref text-sm ${textSecondary} text-center`}>
                Élément : {currentSign.element}
              </Text>
              <Text className={`text-aref text-xs ${textSecondary} text-center opacity-70`}>
                {currentSign.dates}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Options de réponse */}
        <Animated.View entering={SlideInRight.duration(500)}>
          <View className="mb-8 space-y-3">
            {currentSign.answers.map((answer: string, index: number) => {
              let buttonStyle = `w-full rounded-2xl p-4 border ${borderColor} ${cardBg}`;
              let textStyle = `text-aref text-lg font-medium ${textPrimary}`;

              if (showResult && selectedAnswer === answer) {
                if (answer === currentSign.name) {
                  buttonStyle = `w-full rounded-2xl p-4 border-2`;
                  buttonStyle += ` border-green-500 bg-green-500/20`;
                } else {
                  buttonStyle = `w-full rounded-2xl p-4 border-2`;
                  buttonStyle += ` border-red-500 bg-red-500/20`;
                }
              }

              if (showResult && answer === currentSign.name && selectedAnswer !== answer) {
                buttonStyle = `w-full rounded-2xl p-4 border-2`;
                buttonStyle += ` border-green-500 bg-green-500/10`;
              }

              return (
                <Animated.View key={answer} entering={FadeInUp.delay(index * 100).duration(400)}>
                  <TouchableOpacity
                    onPress={() => handleAnswer(answer)}
                    disabled={showResult}
                    activeOpacity={0.8}
                    className={buttonStyle}>
                    <View className="flex-row items-center justify-between">
                      <Text className={textStyle}>{answer}</Text>
                      {showResult && selectedAnswer === answer && (
                        <MaterialIcons
                          name={answer === currentSign.name ? 'check-circle' : 'cancel'}
                          size={24}
                          color={answer === currentSign.name ? '#22C55E' : '#EF4444'}
                        />
                      )}
                      {showResult && answer === currentSign.name && selectedAnswer !== answer && (
                        <MaterialIcons name="check-circle" size={24} color="#22C55E" />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Message de feedback */}
        {showResult && (
          <Animated.View entering={FadeInUp.duration(300)} className="mb-8 items-center">
            <View className={`rounded-2xl p-4 ${cardBg} border ${borderColor}`}>
              <Text className={`text-aref text-center ${textPrimary}`}>
                {selectedAnswer === currentSign.name
                  ? `🎉 Correct ! C'est bien ${currentSign.name}`
                  : `❌ Incorrect. C'était ${currentSign.name}`}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
