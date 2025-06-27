import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  BounceIn,
} from 'react-native-reanimated';
import { useAppSelector } from 'shared/hooks';
import { useThemeColors } from 'shared/hooks/useThemeColors';

import { useTrueOrFalseGame } from '../hooks/true-or-false-game.hook';

interface TrueOrFalseGameProps {
  onBack?: () => void;
  numberOfQuestions?: number;
}

export default function TrueOrFalseGame({ onBack, numberOfQuestions = 10 }: TrueOrFalseGameProps) {
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const colors = useThemeColors();

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
  } = useTrueOrFalseGame(numberOfQuestions);

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
        backgroundColor: colors.backgroundColor,
      },
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={goBack}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="chevron-back" size={24} color={colors.textColor} />
            <Text
              className="text-aref ml-2 text-left text-xl font-bold"
              style={{ color: colors.textColor }}>
              True or False
            </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.textColor]);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.backgroundColor }}>
        <Animated.View entering={BounceIn.duration(800)}>
          <MaterialCommunityIcons name="star-four-points" size={48} color={colors.iconColorAlt2} />
        </Animated.View>
        <Text className="text-aref mt-4 text-lg" style={{ color: colors.textColor }}>
          Preparing questions...
        </Text>
      </View>
    );
  }

  if (gameFinished) {
    const stats = getGameStats();

    return (
      <View className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
        <ScrollView className="flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(600)} className="mt-8 items-center">
            {/* Final score */}
            <View
              className={`mt-6 items-center rounded-3xl p-8 ${colors.cardBg} border ${colors.borderColor} mb-6`}>
              <Animated.View entering={BounceIn.delay(200).duration(800)} className="mb-4">
                <MaterialCommunityIcons
                  name="trophy-award"
                  size={64}
                  color={colors.iconColorAlt2}
                />
              </Animated.View>
              <Text className={`text-aref mb-2 text-2xl font-bold ${colors.textPrimary}`}>
                Game Complete!
              </Text>
              <Text className={`text-aref mb-4 text-lg ${colors.textSecondaryAlt} text-center`}>
                {getEndMessage()}
              </Text>

              {/* Detailed statistics */}
              <View className="w-full">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${colors.textSecondaryAlt}`}>
                    Final Score
                  </Text>
                  <Text className={`text-aref text-xl font-bold ${colors.textPrimary}`}>
                    {stats.score}/{getProgress().total}
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${colors.textSecondaryAlt}`}>
                    Percentage
                  </Text>
                  <Text className={`text-aref text-xl font-bold ${colors.textPrimary}`}>
                    {stats.percentage}%
                  </Text>
                </View>

                <View className="mb-3 flex-row items-center justify-between">
                  <Text className={`text-aref text-base ${colors.textSecondaryAlt}`}>
                    Best Streak
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-aref text-xl font-bold ${colors.textPrimary} mr-2`}>
                      {stats.maxStreak}
                    </Text>
                    <MaterialCommunityIcons name="fire" size={20} color="#F97316" />
                  </View>
                </View>
              </View>
            </View>

            {/* Btn action */}
            <View className="w-full space-y-4">
              <Animated.View entering={SlideInLeft.delay(400).duration(500)}>
                <TouchableOpacity
                  onPress={restartGame}
                  className={`w-full items-center rounded-2xl p-4 ${colors.cardBg} border ${colors.borderColor}`}
                  activeOpacity={0.8}>
                  <View className="flex-row items-center">
                    <MaterialIcons name="refresh" size={24} color={colors.iconColorAlt2} />
                    <Text className={`text-aref ml-3 text-lg font-semibold ${colors.textPrimary}`}>
                      Play Again
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={SlideInRight.delay(500).duration(500)}>
                <TouchableOpacity
                  onPress={goBack}
                  className="mt-2 w-full items-center rounded-2xl border-2 p-4"
                  style={{ borderColor: colors.textColor }}
                  activeOpacity={0.8}>
                  <Text className={`text-aref text-lg font-semibold ${colors.textPrimary}`}>
                    Back to Menu
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const stats = getGameStats();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.backgroundColor }}>
      <ScrollView className="mt-4 flex-1 px-5 pt-24" showsVerticalScrollIndicator={false}>
        {/* Header with progression */}
        <Animated.View entering={FadeInDown.duration(400)} className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={`text-aref text-lg ${colors.textPrimary}`}>
              Question {progress.current}/{progress.total}
            </Text>
            <View className="flex-row items-center">
              <Text className={`text-aref text-lg font-bold ${colors.textPrimary} mr-2`}>
                {stats.score}
              </Text>
              <MaterialIcons name="star" size={20} color={colors.iconColorAlt2} />
              {streak > 1 && (
                <Animated.View
                  entering={BounceIn.duration(300)}
                  className="ml-2 flex-row items-center">
                  <MaterialCommunityIcons name="fire" size={16} color="#F97316" />
                  <Text className={`text-aref ml-1 text-sm ${colors.textPrimary}`}>{streak}</Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Progress bar */}
          <View
            className={`h-2 w-full rounded-full border ${colors.borderColor}`}
            style={{ backgroundColor: isDarkMode ? '#D8D3D0' : '#544A46' }}>
            <Animated.View
              className="h-full rounded-full"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: colors.textColor,
              }}
            />
          </View>
        </Animated.View>

        {/* Main question */}
        <Animated.View entering={SlideInLeft.duration(500)} className="mb-8">
          <View className={`rounded-3xl p-8 ${colors.cardBg} border ${colors.borderColor}`}>
            <View className="mb-6 items-center">
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={48}
                color={colors.iconColorAlt2}
                style={{ marginBottom: 16 }}
              />
            </View>

            <Text
              className={`text-aref text-xl font-medium ${colors.textPrimary} text-center leading-7`}>
              {currentQuestion.question}
            </Text>

            {/* Category */}
            <View className="mt-4 items-center">
              <View
                className={`rounded-full px-3 py-1 ${colors.cardBg} border ${colors.borderColor}`}>
                <Text
                  className={`text-aref text-xs ${colors.textSecondaryAlt} uppercase tracking-wide`}>
                  {currentQuestion.category}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Btns True/False */}
        <Animated.View entering={SlideInRight.duration(500)} className="mb-8">
          <View className="space-y-4">
            {/* Btn TRUE */}
            <Animated.View entering={FadeInUp.delay(100).duration(400)}>
              <TouchableOpacity
                onPress={() => handleAnswer(true)}
                disabled={showResult}
                activeOpacity={0.8}
                className={`mb-2 w-full rounded-2xl border p-6 ${colors.borderColor} ${
                  showResult && selectedAnswer === true
                    ? isAnswerCorrect(true)
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-red-500 bg-red-500/20'
                    : showResult && currentQuestion.answer === true
                      ? 'border-green-500 bg-green-500/10'
                      : colors.cardBg
                }`}>
                <View className="flex-row items-center justify-center">
                  <Text className={`text-aref text-2xl font-bold ${colors.textPrimary}`}>TRUE</Text>
                  {showResult && selectedAnswer === true && (
                    <Animated.View entering={BounceIn.duration(300)} style={{ marginLeft: 12 }}>
                      <MaterialCommunityIcons
                        name={isAnswerCorrect(true) ? 'check-circle' : 'close-circle'}
                        size={24}
                        color={isAnswerCorrect(true) ? colors.correctColor : colors.dangerColor}
                      />
                    </Animated.View>
                  )}
                  {showResult && currentQuestion.answer === true && selectedAnswer !== true && (
                    <Animated.View entering={BounceIn.duration(300)} style={{ marginLeft: 12 }}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={colors.correctColor}
                      />
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Btn FALSE */}
            <Animated.View entering={FadeInUp.delay(200).duration(400)}>
              <TouchableOpacity
                onPress={() => handleAnswer(false)}
                disabled={showResult}
                activeOpacity={0.8}
                className={`w-full rounded-2xl border p-6 ${colors.borderColor} ${
                  showResult && selectedAnswer === false
                    ? isAnswerCorrect(false)
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-red-500 bg-red-500/20'
                    : showResult && currentQuestion.answer === false
                      ? 'border-green-500 bg-green-500/10'
                      : colors.cardBg
                }`}>
                <View className="flex-row items-center justify-center">
                  <Text className={`text-aref text-2xl font-bold ${colors.textPrimary}`}>
                    FALSE
                  </Text>
                  {showResult && selectedAnswer === false && (
                    <Animated.View entering={BounceIn.duration(300)} style={{ marginLeft: 12 }}>
                      <MaterialCommunityIcons
                        name={isAnswerCorrect(false) ? 'check-circle' : 'close-circle'}
                        size={24}
                        color={isAnswerCorrect(false) ? colors.correctColor : colors.dangerColor}
                      />
                    </Animated.View>
                  )}
                  {showResult && currentQuestion.answer === false && selectedAnswer !== false && (
                    <Animated.View entering={BounceIn.duration(300)} style={{ marginLeft: 12 }}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={colors.correctColor}
                      />
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Msg feedback */}
        {showResult && (
          <Animated.View entering={FadeInUp.duration(300)} className="mb-8">
            <View className={`rounded-2xl p-4 ${colors.cardBg} border ${colors.borderColor}`}>
              <View className="flex-row items-start">
                <MaterialCommunityIcons
                  name={isAnswerCorrect(selectedAnswer!) ? 'party-popper' : 'information-outline'}
                  size={24}
                  color={
                    isAnswerCorrect(selectedAnswer!) ? colors.correctColor : colors.iconColorAlt2
                  }
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className={`text-aref font-semibold ${colors.textPrimary} mb-2`}>
                    {isAnswerCorrect(selectedAnswer!) ? 'Correct!' : 'Incorrect!'}
                  </Text>
                  <Text className={`text-aref ${colors.textSecondaryAlt} leading-5`}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
