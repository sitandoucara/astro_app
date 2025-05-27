import { useState } from 'react';

type FormValues = {
  year: string;
  month: string;
  date: string;
  hours: string;
  minutes: string;
  latitude: string;
  longitude: string;
  timezone: string;
};

export default function useBirthChartForm() {
  const [values, setValues] = useState<FormValues>({
    year: '',
    month: '',
    date: '',
    hours: '',
    minutes: '',
    latitude: '',
    longitude: '',
    timezone: '',
  });

  const handleChange = (field: keyof FormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const getPayload = () => ({
    year: parseInt(values.year),
    month: parseInt(values.month),
    date: parseInt(values.date),
    hours: parseInt(values.hours),
    minutes: parseInt(values.minutes),
    seconds: 0,
    latitude: parseFloat(values.latitude),
    longitude: parseFloat(values.longitude),
    timezone: parseFloat(values.timezone),
    config: {
      observation_point: 'topocentric',
      ayanamsha: 'tropical',
      house_system: 'Placidus',
      language: 'en',
      exclude_planets: [],
      allowed_aspects: ['Conjunction', 'Opposition', 'Trine', 'Square'],
      aspect_line_colors: {
        Conjunction: '#558B6E',
        Opposition: '#88A09E',
        Trine: '#B88C9E',
        Square: '#704C5E',
      },
      wheel_chart_colors: {
        zodiac_sign_background_color: '#303036',
        chart_background_color: '#281109',
        zodiac_signs_text_color: '#FFFFFF',
        dotted_line_color: '#FFFAFF',
        planets_icon_color: '#FFFAFF',
      },
      orb_values: {
        Conjunction: 5,
        Opposition: 5,
        Trine: 5,
        Square: 5,
      },
    },
  });

  return {
    values,
    handleChange,
    getPayload,
  };
}
