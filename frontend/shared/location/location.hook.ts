import debounce from 'lodash.debounce';
import { useState, useCallback } from 'react';

export type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function useLocationSearch() {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (query: string) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Location search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(search, 500), []);

  return { results, loading, search: debouncedSearch };
}
