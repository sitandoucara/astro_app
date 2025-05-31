import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { useAppSelector } from 'shared/hooks';

export default function BirthChartForm() {
  const user = useAppSelector((state) => state.auth.user);
  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateHtmlWithSvg = (url: string) => `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background-color: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        .container {
          overflow: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        img {
          display: block;
          width: 100%;
          height: auto;
          transform: scale(1.1); /* zoom */
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${url}" />
      </div>
    </body>
  </html>
`;

  const generateChart = async () => {
    if (
      !user ||
      !user.dateOfBirth ||
      !user.timeOfBirth ||
      user.latitude == null ||
      user.longitude == null ||
      user.timezoneOffset == null
    ) {
      console.warn('Missing user data for chart generation');
      return;
    }

    try {
      setLoading(true);

      const date = new Date(user.dateOfBirth);
      const time = new Date(user.timeOfBirth);

      const payload = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        date: date.getUTCDate(),
        hours: time.getUTCHours(),
        minutes: time.getUTCMinutes(),
        seconds: 0,
        latitude: user.latitude,
        longitude: user.longitude,
        timezone: user.timezoneOffset,
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
      };

      const response = await fetch('http://localhost:4000/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setChartUrl(data.output || null);
    } catch (err) {
      console.error('Erreur lors de la génération du thème :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateChart();
  }, [user]);

  return (
    <View className="space-y-5 pb-10">
      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="#7B635A" className="pt-2" />}

      {/* Affichage image */}
      {chartUrl && (
        <View className="items-center pt-5">
          <Text className="mb-2 text-[#32221E]">Votre thème astral :</Text>

          <WebView
            originWhitelist={['*']}
            source={{ html: generateHtmlWithSvg(chartUrl) }}
            style={{ width: 300, height: 300, backgroundColor: 'transparent' }}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}
