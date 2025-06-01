import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import { useAppSelector } from 'shared/hooks';

export default function ChartScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.auth.user);
  const [ascendant, setAscendant] = useState<{ sign: string } | null>(null);
  const chartUrl = user?.birthChartUrl;

  type PlanetData = {
    sign: string;
    [key: string]: any;
  };

  const [planets, setPlanets] = useState<Record<string, PlanetData> | null>(null);

  // ➤ Injection depuis Redux à l'ouverture de l'écran
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

  // ➤ Custom header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-aref ml-5 text-[20px] text-[#32221E]">Here is your chart</Text>
      ),
      headerTitleAlign: 'left',
    });
  }, [navigation]);

  // ➤ WebView HTML builder
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

      {planets && (
        <View className="mt-6 space-y-1">
          {Object.entries(planets).map(([planet, data]) => (
            <Text key={planet} className="text-[#32221E]">
              {planet}: {data.sign}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
