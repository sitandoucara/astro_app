import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import Animated, { FadeInUp, FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';

import { useGuessWhoGame } from '../hooks/useGuessWhoGame';

interface GuessWhoGameProps {
  onBack?: () => void;
  numberOfQuestions?: number;
}

export default function GuessWhoGame({ onBack, numberOfQuestions = 8 }: GuessWhoGameProps) {
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const {
    gameFinished,
    isLoading,
    selectedAnswer,
    showResult,
    streak,
    getCurrentQuestion,
    getGameStats,
    getEndMessage,
    getProgress,
    handleAnswer,
    restartGame,
    isAnswerCorrect,
  } = useGuessWhoGame(numberOfQuestions);

  const backgroundColor = isDarkMode ? '#F2EAE0' : '#281109';
  const textColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const iconColor = isDarkMode ? '#32221E' : '#F2EAE0';
  const cardBg = isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50';
  const borderColor = isDarkMode ? 'border-light-border' : 'border-dark-border';
  const textPrimary = isDarkMode ? 'text-light-text1' : 'text-dark-text1';
  const textSecondary = isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]';
  const correctColor = isDarkMode ? '#16A34A' : '#22C55E';
  const dangerColor = isDarkMode ? '#871515' : '#EF4444';

  const getSignImageUrl = (signName: string) => {
    const theme = isDarkMode ? 'dark' : 'light';
    return `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/assets/signs/${signName}_${theme}.png`;
  };

  const goBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor,
      },
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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor }}>
        <Text className="text-aref text-lg" style={{ color: textColor }}>
          Preparing game...
        </Text>
      </View>
    );
  }

  if (gameFinished) {
    const stats = getGameStats();

    return (
      <View className="flex-1" style={{ backgroundColor }}>
        <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600)} className="mt-8 items-center">
            {/* final score */}
            <View className={`items-center rounded-3xl p-8 ${cardBg} border ${borderColor} mb-6`}>
              <View className="mb-4">
                <MaterialCommunityIcons name="trophy-award" size={64} color={iconColor} />
              </View>
              <Text className={`text-aref mb-2 text-2xl font-bold ${textPrimary}`}>
                Game Complete!
              </Text>
              <Text className={`text-aref mb-4 text-lg ${textSecondary} text-center`}>
                {getEndMessage()}
              </Text>

              {/* detailed statistics */}
              <View className="w-full">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Final Score</Text>
                  <Text className={`text-aref text-xl font-bold ${textPrimary}`}>
                    {stats.score}/{getProgress().total}
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Percentage</Text>
                  <Text className={`text-aref text-xl font-bold ${textPrimary}`}>
                    {stats.percentage}%
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${textSecondary}`}>Best Streak</Text>
                  <View className="flex-row items-center">
                    <Text className={`text-aref text-xl font-bold ${textPrimary} mr-2`}>
                      {stats.maxStreak}
                    </Text>
                    <MaterialCommunityIcons name="fire" size={20} color="#F97316" />
                  </View>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View className="w-full space-y-4">
              <TouchableOpacity
                onPress={restartGame}
                className={`w-full items-center rounded-2xl p-4 ${cardBg} border ${borderColor}`}
                activeOpacity={0.8}>
                <View className="flex-row items-center">
                  <MaterialIcons name="refresh" size={24} color={iconColor} />
                  <Text className={`text-aref ml-3 text-lg font-semibold ${textPrimary}`}>
                    Play Again
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={goBack}
                className="w-full items-center rounded-2xl border-2 p-4"
                style={{ borderColor: textColor }}
                activeOpacity={0.8}>
                <Text className={`text-aref text-lg font-semibold ${textPrimary}`}>
                  Back to Menu
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const currentSign = getCurrentQuestion();
  const progress = getProgress();
  const stats = getGameStats();

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScrollView className="mt-4 flex-1  px-5 pt-24" showsVerticalScrollIndicator={false}>
        {/* Header with progress */}
        <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={`text-aref text-lg ${textPrimary}`}>
              Question {progress.current}/{progress.total}
            </Text>
            <View className="flex-row items-center">
              <Text className={`text-aref text-lg font-bold ${textPrimary} mr-2`}>
                {stats.score}
              </Text>
              <MaterialIcons name="star" size={20} color={iconColor} />
              {streak > 1 && (
                <View className="ml-2 flex-row items-center">
                  <MaterialCommunityIcons name="fire" size={16} color="#F97316" />
                  <Text className={`text-aref ml-1 text-sm ${textPrimary}`}>{streak}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Progress bar */}
          <View
            className={`h-2 w-full rounded-full border ${borderColor}`}
            style={{ backgroundColor: isDarkMode ? '#D8D3D0' : '#544A46' }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: isDarkMode ? '#32221E' : '#F2EAE0',
              }}
            />
          </View>
        </Animated.View>

        {/* Main question */}
        <Animated.View entering={SlideInLeft.duration(500)} className="mb-8 items-center">
          <View className={`items-center rounded-3xl p-8 ${cardBg} border ${borderColor} mb-6`}>
            <Text className={`text-aref mb-6 text-lg ${textSecondary} text-center`}>
              What is this zodiac sign?
            </Text>

            {/* Sign image instead of symbol */}
            <View className="mb-6 items-center">
              <View className="mb-4 h-32 w-32 items-center justify-center">
                <Image
                  source={{ uri: getSignImageUrl(currentSign.englishName) }}
                  style={{
                    width: 120,
                    height: 120,
                  }}
                  resizeMode="contain"
                />
              </View>
              <Text className={`text-aref text-sm ${textSecondary} text-center`}>
                Element: {currentSign.element}
              </Text>
              <Text className={`text-aref text-xs ${textSecondary} text-center opacity-70`}>
                {currentSign.dates}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Answer options */}
        <Animated.View entering={SlideInRight.duration(500)}>
          <View className="mb-8 ">
            {currentSign.answers.map((answer: string, index: number) => {
              let buttonStyle = `w-full mt-2 rounded-2xl p-4 border ${borderColor} ${cardBg}`;
              let textStyle = `text-aref text-lg font-medium ${textPrimary}`;

              if (showResult && selectedAnswer === answer) {
                if (isAnswerCorrect(answer)) {
                  buttonStyle = `w-full mt-2 rounded-2xl p-4 border-2`;
                  buttonStyle += ` border-green-500 bg-green-500/20`;
                } else {
                  buttonStyle = `w-full mt-2 rounded-2xl p-4 border-2 border-red-500 bg-red-500/20`;
                }
              }

              if (showResult && isAnswerCorrect(answer) && selectedAnswer !== answer) {
                buttonStyle = `w-full mt-2 rounded-2xl p-4 border-2 border-green-500 bg-green-500/10`;
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
                        <MaterialCommunityIcons
                          name={isAnswerCorrect(answer) ? 'check-circle' : 'close-circle'}
                          size={24}
                          color={isAnswerCorrect(answer) ? correctColor : dangerColor}
                        />
                      )}
                      {showResult && isAnswerCorrect(answer) && selectedAnswer !== answer && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={correctColor}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Feedback message */}
        {showResult && (
          <Animated.View entering={FadeInUp.duration(300)} className="mb-8 items-center">
            <View
              className={`rounded-2xl p-4 ${cardBg} border ${borderColor} flex-row items-center`}>
              <MaterialCommunityIcons
                name={isAnswerCorrect(selectedAnswer!) ? 'party-popper' : 'close-circle-outline'}
                size={24}
                color={isAnswerCorrect(selectedAnswer!) ? correctColor : dangerColor}
                style={{ marginRight: 8 }}
              />
              <Text className={`text-aref text-center ${textPrimary} flex-1`}>
                {isAnswerCorrect(selectedAnswer!)
                  ? `Correct! It's ${currentSign.name}`
                  : `Incorrect. It was ${currentSign.name}`}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
