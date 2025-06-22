import { useState, useEffect } from 'react';

interface ZodiacSign {
  name: string;
  englishName: string;
  symbol: string;
  element: string;
  dates: string;
}

interface GameQuestion extends ZodiacSign {
  answers: string[];
}

interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  percentage: number;
}

const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    englishName: 'aries',
    symbol: '♈',
    element: 'Fire',
    dates: 'March 21 - April 19',
  },
  {
    name: 'Taurus',
    englishName: 'taurus',
    symbol: '♉',
    element: 'Earth',
    dates: 'April 20 - May 20',
  },
  {
    name: 'Gemini',
    englishName: 'gemini',
    symbol: '♊',
    element: 'Air',
    dates: 'May 21 - June 20',
  },
  {
    name: 'Cancer',
    englishName: 'cancer',
    symbol: '♋',
    element: 'Water',
    dates: 'June 21 - July 22',
  },
  {
    name: 'Leo',
    englishName: 'leo',
    symbol: '♌',
    element: 'Fire',
    dates: 'July 23 - August 22',
  },
  {
    name: 'Virgo',
    englishName: 'virgo',
    symbol: '♍',
    element: 'Earth',
    dates: 'August 23 - September 22',
  },
  {
    name: 'Libra',
    englishName: 'libra',
    symbol: '♎',
    element: 'Air',
    dates: 'September 23 - October 22',
  },
  {
    name: 'Scorpio',
    englishName: 'scorpio',
    symbol: '♏',
    element: 'Water',
    dates: 'October 23 - November 21',
  },
  {
    name: 'Sagittarius',
    englishName: 'sagittarius',
    symbol: '♐',
    element: 'Fire',
    dates: 'November 22 - December 21',
  },
  {
    name: 'Capricorn',
    englishName: 'capricorn',
    symbol: '♑',
    element: 'Earth',
    dates: 'December 22 - January 19',
  },
  {
    name: 'Aquarius',
    englishName: 'aquarius',
    symbol: '♒',
    element: 'Air',
    dates: 'January 20 - February 18',
  },
  {
    name: 'Pisces',
    englishName: 'pisces',
    symbol: '♓',
    element: 'Water',
    dates: 'February 19 - March 20',
  },
];

export const useGuessWhoGame = (numberOfQuestions: number = 8) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // questions random
  const generateQuestions = () => {
    setIsLoading(true);

    const shuffled = [...zodiacSigns].sort(() => Math.random() - 0.5);
    const gameQuestions = shuffled.slice(0, numberOfQuestions).map((sign) => {
      const wrongAnswers = zodiacSigns
        .filter((s) => s.name !== sign.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((s) => s.name);

      const allAnswers = [sign.name, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        ...sign,
        answers: allAnswers,
      };
    });

    setQuestions(gameQuestions);
    setIsLoading(false);
  };

  // initial  game
  useEffect(() => {
    generateQuestions();
  }, [numberOfQuestions]);

  // Gerer les reponses
  const handleAnswer = (answer: string) => {
    if (showResult || isLoading) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentQuestion].name;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setMaxStreak((prev) => Math.max(prev, streak + 1));
    } else {
      setStreak(0);
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameFinished(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    generateQuestions();
  };

  const getGameStats = (): GameStats => ({
    score,
    streak,
    maxStreak,
    percentage: questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
  });

  const getEndMessage = () => {
    const percentage = getGameStats().percentage;
    if (percentage === 100) return 'Perfect! Master astrologer!';
    if (percentage >= 75) return 'Excellent! Great knowledge!';
    if (percentage >= 50) return 'Well done! Keep learning!';
    return 'Not bad! A little more practice!';
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const isAnswerCorrect = (answer: string) => {
    return answer === questions[currentQuestion]?.name;
  };

  const getProgress = () => ({
    current: currentQuestion + 1,
    total: questions.length,
    percentage: questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0,
  });

  return {
    // Game state
    currentQuestion,
    score,
    gameFinished,
    questions,
    selectedAnswer,
    showResult,
    streak,
    maxStreak,
    isLoading,

    // Game data
    getCurrentQuestion,
    getGameStats,
    getEndMessage,
    getProgress,

    // Game actions
    handleAnswer,
    restartGame,
    isAnswerCorrect,

    // Constants
    zodiacSigns,
  };
};
