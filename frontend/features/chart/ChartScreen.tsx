import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed/dist/Button';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { useAppSelector } from 'shared/hooks';

export default function ChartScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.auth.user);
  const chartUrl = user?.birthChartUrl;

  type PlanetData = {
    sign: string;
    [key: string]: any;
  };

  const [planets, setPlanets] = useState<Record<string, PlanetData> | null>(null);
  const [ascendant, setAscendant] = useState<{ sign: string } | null>(null);
  const [planetsDescriptions, setPlanetsDescriptions] = useState<{
    [planet: string]: { sign: string; text: string };
  } | null>(null);

  const fetchSignDetail = async (sign: string): Promise<any> => {
    try {
      const url = `https://vaajrvpkjbzyqbxiuzsi.supabase.co/storage/v1/object/public/signdetails/${sign}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${sign}`);
      return await response.json();
    } catch (error) {
      console.error('Error loading JSON:', error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.planets) {
      const formattedPlanets: Record<string, PlanetData> = Object.entries(user.planets).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? { sign: value } : value;
          return acc;
        },
        {} as Record<string, PlanetData>
      );
      setPlanets(formattedPlanets);
    }

    if (user?.ascendant) {
      setAscendant(user.ascendant);
    }
  }, [user]);

  useEffect(() => {
    const loadDescriptions = async () => {
      if (!planets || !user?.gender) return;
      const gender = user.gender.toLowerCase();
      const validPlanets = [
        'sun',
        'moon',
        'venus',
        'mars',
        'ascendant',
        'mercury',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
      ];

      const descriptions: {
        [planet: string]: {
          sign: string;
          text: string;
        };
      } = {};

      for (const [planet, data] of Object.entries(planets)) {
        const lowerPlanet = planet.toLowerCase();
        const sign = data.sign;
        if (validPlanets.includes(lowerPlanet)) {
          const detail = await fetchSignDetail(sign);
          if (detail?.[lowerPlanet]?.[gender]) {
            descriptions[planet] = {
              sign,
              text: detail[lowerPlanet][gender],
            };
          }
        }
      }

      setPlanetsDescriptions(descriptions);
    };

    loadDescriptions();
  }, [planets, user]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">Here is your chart</Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

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
            transform: scale(1.1);
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

  return (
    <ScrollView className="flex-1 bg-[#F2EAE0] px-5 pt-10">
      <Text className="text-aref mb-6 text-center text-3xl font-bold text-[#7B635A]">
        Your Birth Chart
      </Text>

      <Button>Share</Button>

      {chartUrl && (
        <View className="items-center pt-5">
          <WebView
            originWhitelist={['*']}
            source={{ html: generateHtmlWithSvg(chartUrl) }}
            style={{ width: 300, height: 300, backgroundColor: 'transparent' }}
            scrollEnabled={false}
          />
        </View>
      )}

      {planetsDescriptions && (
        <View className="mt-7 space-y-4">
          {Object.entries(planetsDescriptions).map(([planet, info]) => (
            <View
              key={planet}
              className="border-light-border bg-light-cardback mt-4 rounded-[13px] border p-3">
              <Text className="text-light-text1 font-bold">
                {planet} in {info.sign}
              </Text>
              <Text className="text-light-text3 mt-1">{info.text}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
