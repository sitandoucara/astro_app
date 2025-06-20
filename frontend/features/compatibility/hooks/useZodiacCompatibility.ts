import { useState } from 'react';
import { Alert } from 'react-native';

export const useZodiacCompatibility = () => {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [partnerSign, setPartnerSign] = useState<string | null>(null);
  const [userSign, setUserSign] = useState<string | null>(null);

  const mockUser = {
    raw_user_meta_data: {
      planets: {
        Sun: 'Virgo',
      },
    },
  };

  const getZodiacSign = (birthDate: Date) => {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

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
      Alert.alert('Incomplete', 'Please fill in all fields');
      return;
    }

    const calculatedPartnerSign = getZodiacSign(date);
    const calculatedUserSign = mockUser.raw_user_meta_data.planets.Sun;

    setPartnerSign(calculatedPartnerSign);
    setUserSign(calculatedUserSign);
    setShowCompatibility(true);
  };

  const resetCompatibility = () => {
    setShowCompatibility(false);
    setPartnerSign(null);
    setUserSign(null);
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
