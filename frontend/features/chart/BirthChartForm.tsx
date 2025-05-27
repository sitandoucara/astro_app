import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import useBirthChartForm from './useBirthChartForm';
import WebView from 'react-native-webview';

export default function BirthChartForm() {
  const { values, handleChange, getPayload } = useBirthChartForm();
  const [loading, setLoading] = useState(false);
  const [chartUrl, setChartUrl] = useState<string | null>(null);
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

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setChartUrl(null);
      const response = await fetch('http://localhost:4000/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getPayload()),
      });

      const data = await response.json();
      console.log('Réponse backend:', data);

      setChartUrl(data.output || null);
    } catch (error) {
      console.error('Erreur API :', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="space-y-5 pb-10">
      {/* Inputs */}
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Year (e.g. 1998)"
        keyboardType="numeric"
        value={values.year}
        onChangeText={handleChange('year')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Month (e.g. 3)"
        keyboardType="numeric"
        value={values.month}
        onChangeText={handleChange('month')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Date (e.g. 3)"
        keyboardType="numeric"
        value={values.date}
        onChangeText={handleChange('date')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Hours (e.g. 10)"
        keyboardType="numeric"
        value={values.hours}
        onChangeText={handleChange('hours')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Minutes (e.g. 30)"
        keyboardType="numeric"
        value={values.minutes}
        onChangeText={handleChange('minutes')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Latitude (e.g. 48.8566)"
        keyboardType="numeric"
        value={values.latitude}
        onChangeText={handleChange('latitude')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Longitude (e.g. 2.3522)"
        keyboardType="numeric"
        value={values.longitude}
        onChangeText={handleChange('longitude')}
      />
      <TextInput
        className="rounded-xl border border-[#7B635A] bg-white px-4 py-2 text-[#32221E]"
        placeholder="Timezone (e.g. 2.0)"
        keyboardType="numeric"
        value={values.timezone}
        onChangeText={handleChange('timezone')}
      />

      {/* Bouton */}
      <TouchableOpacity
        className="mt-2 rounded-xl bg-[#7B635A] py-3"
        onPress={handleGenerate}
        disabled={loading}>
        <Text className="text-center text-lg font-bold text-white">
          {loading ? 'Chargement...' : 'Générer mon thème astral'}
        </Text>
      </TouchableOpacity>

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
