import { useState } from 'react';

interface HoroscopeData {
  date: string;
  horoscope_data: string;
}

interface ApiResponse {
  data: HoroscopeData;
  status: number;
  success: boolean;
}

interface UseHoroscopeReturn {
  horoscopeData: HoroscopeData | null;
  loading: boolean;
  error: string | null;
  fetchHoroscope: (sign: string, timeFrame: string) => Promise<void>;
  getHoroscopeTitle: (timeFrame: string) => string;
  getApiDay: (timeFrame: string) => string;
}

export const useHoroscope = (): UseHoroscopeReturn => {
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = 'https://horoscope-app-api.vercel.app/api/v1';

  // Map timeframes to API parameters
  const getApiDay = (timeFrame: string): string => {
    switch (timeFrame) {
      case 'YESTERDAY':
        return 'YESTERDAY';
      case 'TODAY':
        return 'TODAY';
      case 'TOMORROW':
        return 'TOMORROW';
      default:
        return 'TODAY';
    }
  };

  // Determine the endpoint according to the timeframe
  const getEndpoint = (timeFrame: string): string => {
    switch (timeFrame) {
      case 'WEEK':
        return '/get-horoscope/weekly';
      case 'MONTH':
        return '/get-horoscope/monthly';
      default:
        return '/get-horoscope/daily';
    }
  };

  // Generate the dynamic title
  const getHoroscopeTitle = (timeFrame: string): string => {
    switch (timeFrame) {
      case 'YESTERDAY':
        return "Your yesterday's horoscope";
      case 'TODAY':
        return "Your today's horoscope";
      case 'TOMORROW':
        return "Your tomorrow's horoscope";
      case 'WEEK':
        return 'Your weekly horoscope';
      case 'MONTH':
        return 'Your monthly horoscope';
      case '2025':
        return 'Your 2025 horoscope';
      case '2026':
        return 'Your 2026 horoscope';
      default:
        return "Your today's horoscope";
    }
  };

  const fetchHoroscope = async (sign: string, timeFrame: string): Promise<void> => {
    if (!sign) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint(timeFrame);
      let url = `${BASE_URL}${endpoint}?sign=${encodeURIComponent(sign)}`;
      if (endpoint === '/get-horoscope/daily') {
        const day = getApiDay(timeFrame);
        url += `&day=${day}`;
      }

      console.log('Fetching horoscope from URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: ApiResponse = await response.json();
      console.log('API Response:', responseData);

      if (responseData.success === true && responseData.data) {
        setHoroscopeData(responseData.data);
      } else {
        throw new Error('Failed to fetch horoscope');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Horoscope fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    horoscopeData,
    loading,
    error,
    fetchHoroscope,
    getHoroscopeTitle,
    getApiDay,
  };
};
