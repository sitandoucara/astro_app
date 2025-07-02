import { useState, useEffect } from 'react';
import { useAppSelector } from 'shared/hooks';

export const useZodiacCompatibility = (showError?: (title: string, message: string) => void) => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [partnerSign, setPartnerSign] = useState<string | null>(null);
  const [userSign, setUserSign] = useState<string | null>(null);

  const user = useAppSelector((state) => state.auth.user);

  // Fonction unique pour calculer le signe zodiacal
  const getZodiacSign = (input: Date | string) => {
    const date = typeof input === 'string' ? new Date(input) : input;
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
    return 'Aries';
  };
  // Determine the user's sign based on the available data
  useEffect(() => {
    let calculatedUserSign = 'Cancer';

    if (user) {
      if (
        user.planets &&
        user.planets.Sun &&
        typeof user.planets.Sun === 'object' &&
        user.planets.Sun.sign
      ) {
        calculatedUserSign = user.planets.Sun.sign;
      } else if (user.planets && user.planets.Sun && typeof user.planets.Sun === 'string') {
        calculatedUserSign = user.planets.Sun;
      } else if (user.dateOfBirth) {
        calculatedUserSign = getZodiacSign(user.dateOfBirth);
      }
    }

    console.log('User data:', user);
    console.log('Calculated user sign:', calculatedUserSign);

    setUserSign(calculatedUserSign);
  }, [user]);

  const compatibilityData = {
    romance: {
      title: 'Romance',
      icon: 'heart',
      compatibility: 85,
      description: 'Strong romantic connection with deep emotional understanding.',
    },
    business: {
      title: 'Business',
      icon: 'briefcase',
      compatibility: 72,
      description: 'Good business partnership with complementary skills.',
    },
    magnetism: {
      title: 'Magnetism',
      icon: 'magnet',
      compatibility: 90,
      description: 'Incredible magnetic attraction and chemistry.',
    },
    friendship: {
      title: 'Friendship',
      icon: 'nature-people',
      compatibility: 78,
      description: 'Solid friendship based on mutual respect and fun.',
    },
  };

  const handleCheckCompatibility = () => {
    if (!username.trim() || !gender || !date) {
      if (showError) {
        showError('Incomplete Information', 'Please fill in all fields');
      } else {
        console.warn('Incomplete form data');
      }
      return;
    }

    const calculatedPartnerSign = getZodiacSign(date);
    setPartnerSign(calculatedPartnerSign);
    setShowCompatibility(true);
  };

  const resetCompatibility = () => {
    setShowCompatibility(false);
    setPartnerSign(null);
  };

  return {
    // States
    username,
    setUsername,
    gender,
    setGender,
    date,
    setDate,
    showCompatibility,
    partnerSign,
    userSign,

    // Data
    compatibilityData,

    // Functions
    handleCheckCompatibility,
    resetCompatibility,
    getZodiacSign,
  };
};
