import { useState, useEffect } from 'react';

interface AstroQuestion {
  id: number;
  question: string;
  answer: boolean;
  explanation: string;
  category: 'signs' | 'elements' | 'planets' | 'compatibility' | 'traits';
}

interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  percentage: number;
}

const astroQuestions: AstroQuestion[] = [
  // Signs & Symbols
  {
    id: 1,
    question: 'Scorpio is a fire sign',
    answer: false,
    explanation: 'Scorpio is a water sign, not fire',
    category: 'signs',
  },
  {
    id: 2,
    question: 'Aries is the first sign of the zodiac',
    answer: true,
    explanation: 'Aries marks the beginning of the zodiac cycle',
    category: 'signs',
  },
  {
    id: 3,
    question: 'Gemini symbol represents twins',
    answer: true,
    explanation: 'Gemini is indeed represented by the twins',
    category: 'signs',
  },
  {
    id: 4,
    question: 'Capricorn is represented by a fish',
    answer: false,
    explanation: 'Capricorn is represented by a goat, Pisces by fish',
    category: 'signs',
  },

  // Elements
  {
    id: 5,
    question: 'There are 4 elements in astrology',
    answer: true,
    explanation: 'Fire, Earth, Air, and Water are the 4 elements',
    category: 'elements',
  },
  {
    id: 6,
    question: 'Leo is an earth sign',
    answer: false,
    explanation: 'Leo is a fire sign, not earth',
    category: 'elements',
  },
  {
    id: 7,
    question: 'Taurus, Virgo and Capricorn are all earth signs',
    answer: true,
    explanation: 'These three signs form the earth element group',
    category: 'elements',
  },
  {
    id: 8,
    question: 'Cancer is an air sign',
    answer: false,
    explanation: 'Cancer is a water sign, not air',
    category: 'elements',
  },

  // Planets
  {
    id: 9,
    question: 'Venus rules Libra',
    answer: true,
    explanation: 'Venus is indeed the ruling planet of Libra',
    category: 'planets',
  },
  {
    id: 10,
    question: 'Mars rules Pisces',
    answer: false,
    explanation: 'Mars rules Aries and Scorpio, not Pisces',
    category: 'planets',
  },
  {
    id: 11,
    question: 'The Sun rules Leo',
    answer: true,
    explanation: 'Leo is ruled by the Sun',
    category: 'planets',
  },
  {
    id: 12,
    question: 'Mercury rules both Gemini and Virgo',
    answer: true,
    explanation: 'Mercury is the ruling planet for both signs',
    category: 'planets',
  },

  // Compatibility
  {
    id: 13,
    question: 'Fire and air signs are generally compatible',
    answer: true,
    explanation: 'Fire and air elements complement each other well',
    category: 'compatibility',
  },
  {
    id: 14,
    question: 'Opposite signs in the zodiac are always incompatible',
    answer: false,
    explanation: 'Opposite signs can actually be very compatible',
    category: 'compatibility',
  },
  {
    id: 15,
    question: 'Water and earth signs complement each other',
    answer: true,
    explanation: 'Water and earth elements work well together',
    category: 'compatibility',
  },

  // Traits
  {
    id: 16,
    question: 'Virgos are known for being perfectionists',
    answer: true,
    explanation: 'Attention to detail is a classic Virgo trait',
    category: 'traits',
  },
  {
    id: 17,
    question: 'Sagittarius is known for being homebodies',
    answer: false,
    explanation: 'Sagittarius are known for loving travel and adventure',
    category: 'traits',
  },
  {
    id: 18,
    question: 'Leos are natural leaders',
    answer: true,
    explanation: 'Leadership is a key Leo characteristic',
    category: 'traits',
  },
  {
    id: 19,
    question: 'Aquarius is the most emotional sign',
    answer: false,
    explanation: 'Aquarius tends to be more detached and logical',
    category: 'traits',
  },
  {
    id: 20,
    question: 'Libras value harmony and balance',
    answer: true,
    explanation: 'Balance and harmony are core Libra values',
    category: 'traits',
  },
];

export const useTrueOrFalseGame = (numberOfQuestions: number = 10) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [questions, setQuestions] = useState<AstroQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const generateQuestions = () => {
    setIsLoading(true);

    const shuffled = [...astroQuestions].sort(() => Math.random() - 0.5);
    const gameQuestions = shuffled.slice(0, numberOfQuestions);

    setQuestions(gameQuestions);
    setIsLoading(false);
  };

  // Init game
  useEffect(() => {
    generateQuestions();
  }, [numberOfQuestions]);

  const handleAnswer = (answer: boolean) => {
    if (showResult || isLoading) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === questions[currentQuestion].answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setMaxStreak((prev) => Math.max(prev, streak + 1));
    } else {
      setStreak(0);
    }

    //Move next question after 2 sec
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
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
    if (percentage === 100) return 'Perfect! Astro Master!';
    if (percentage >= 80) return 'Excellent! Great knowledge!';
    if (percentage >= 60) return 'Well done! Keep learning!';
    if (percentage >= 40) return 'Not bad! Practice more!';
    return 'Keep studying the stars!';
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const isAnswerCorrect = (answer: boolean) => {
    return answer === questions[currentQuestion]?.answer;
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
    astroQuestions,
  };
};
