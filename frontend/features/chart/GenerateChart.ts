import { supabase } from 'shared/lib/supabase';
import { decode } from 'base64-arraybuffer';

type UserAstroData = {
  id: string;
  dateOfBirth: string;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
};

export const generateChart = async (user: UserAstroData) => {
  if (
    !user.dateOfBirth ||
    !user.timeOfBirth ||
    user.latitude == null ||
    user.longitude == null ||
    user.timezoneOffset == null
  ) {
    console.warn('Missing user data for chart generation');
    return;
  }

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

  // Fetch chart SVG image
  const chartRes = await fetch('http://localhost:4000/api/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const chartData = await chartRes.json();
  const imageUrl = chartData.output;

  // Fetch planet positions
  const planetRes = await fetch('http://localhost:4000/api/chart/planets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const planetJson = await planetRes.json();
  const planetData = planetJson.output ?? [];

  // Simplify planet data → only { planetName: sign }
  const simplifiedPlanets: Record<string, string> = {};
  planetData.forEach((planet: any) => {
    const name = planet.planet?.en;
    const sign = planet.zodiac_sign?.name?.en;
    if (name && sign) {
      simplifiedPlanets[name] = sign;
    }
  });

  // Ascendant
  const ascendantEntry = planetData.find((p: any) => p.planet?.en === 'Ascendant');
  const ascendantData = ascendantEntry
    ? {
        sign: ascendantEntry.zodiac_sign?.name?.en ?? '',
      }
    : null;

  // Download chart image as base64
  const imageRes = await fetch(imageUrl);
  const blob = await imageRes.blob();
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
  const base64Data = base64.split(',')[1];

  // Upload image to Supabase storage
  await supabase.storage
    .from('charts')
    .upload(`charts/${user.id}_birthchart.svg`, decode(base64Data), {
      contentType: 'image/svg+xml',
      upsert: true,
    });

  const { data: publicUrlData } = supabase.storage
    .from('charts')
    .getPublicUrl(`charts/${user.id}_birthchart.svg`);
  const chartUrl = publicUrlData?.publicUrl;

  // Update Supabase user metadata with chart + signs only
  await supabase.auth.updateUser({
    data: {
      birthChartUrl: chartUrl,
      planets: simplifiedPlanets,
      ascendant: ascendantData,
    },
  });
};
