import { useState, useEffect } from 'react';
import { useLanguage } from 'shared/language/language.hook';
import { supabase } from 'shared/lib/supabase';

interface Affirmations {
  today: string;
  tomorrow: string;
  week: string;
  month: string;
}

interface AffirmationRow {
  type: string;
  text: string;
}

interface UseAffirmationsReturn {
  affirmations: Affirmations;
  loading: boolean;
  error: string | null;
  refreshAffirmations: () => Promise<void>;
  getCurrentAffirmation: (timeFrame: string) => string;
}

export const useAffirmations = (): UseAffirmationsReturn => {
  const [affirmations, setAffirmations] = useState<Affirmations>({
    today: '',
    tomorrow: '',
    week: '',
    month: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentLanguage } = useLanguage();

  const fetchAffirmations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('affirmations')
        .select('type, text')
        .eq('language', currentLanguage)
        .order('type');

      if (fetchError) {
        throw fetchError;
      }

      // Transformer les données en format utilisable avec typage correct
      const affirmationsMap = (data as AffirmationRow[]).reduce(
        (acc: Partial<Affirmations>, item: AffirmationRow) => {
          acc[item.type as keyof Affirmations] = item.text;
          return acc;
        },
        {} as Partial<Affirmations>
      );

      // Transform data into a usable format with correct typing
      const defaultAffirmations: Affirmations = {
        today:
          affirmationsMap.today ||
          "Today's cosmic energy brings new opportunities for growth and self-discovery.",
        tomorrow:
          affirmationsMap.tomorrow ||
          'Tomorrow holds the promise of new beginnings and fresh perspectives.',
        week:
          affirmationsMap.week ||
          'This week, embrace the changes coming your way with confidence and grace.',
        month:
          affirmationsMap.month ||
          'The month ahead holds promise for deep personal transformation and renewal.',
      };

      setAffirmations(defaultAffirmations);
    } catch (err) {
      console.error('Error fetching affirmations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load affirmations');

      // Fallback to default assertions
      setAffirmations({
        today: "Today's cosmic energy brings new opportunities for growth and self-discovery.",
        tomorrow: 'Tomorrow holds the promise of new beginnings and fresh perspectives.',
        week: 'This week, embrace the changes coming your way with confidence and grace.',
        month: 'The month ahead holds promise for deep personal transformation and renewal.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAffirmation = (timeFrame: string): string => {
    switch (timeFrame.toUpperCase()) {
      case 'TODAY':
        return affirmations.today;
      case 'TOMORROW':
        return affirmations.tomorrow;
      case 'WEEK':
        return affirmations.week;
      case 'MONTH':
        return affirmations.month;
      default:
        return affirmations.today;
    }
  };

  // Load assertions on startup and when language changes
  useEffect(() => {
    fetchAffirmations();
  }, [currentLanguage]);

  // Listen to changes in real time
  useEffect(() => {
    const subscription = supabase
      .channel('affirmations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'affirmations',
          filter: `language=eq.${currentLanguage}`,
        },
        (payload) => {
          console.log('Affirmation updated:', payload);
          fetchAffirmations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentLanguage]);

  return {
    affirmations,
    loading,
    error,
    refreshAffirmations: fetchAffirmations,
    getCurrentAffirmation,
  };
};
