import { createClient } from "@supabase/supabase-js";
import { getChartFromAPI, getPlanetsFromAPI } from "./astrologyService";
import { config } from "../config/env";

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const getSupabaseClient = () => {
  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  return createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
};

type UserAstroData = {
  id: string;
  dateOfBirth: string;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
};

export const generateCompleteChart = async (user: UserAstroData) => {
  try {
    const supabase = getSupabaseClient();

    if (
      !user.dateOfBirth ||
      !user.timeOfBirth ||
      user.latitude == null ||
      user.longitude == null ||
      user.timezoneOffset == null
    ) {
      throw new Error("Missing user data for chart generation");
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
        observation_point: "topocentric",
        ayanamsha: "tropical",
        house_system: "Placidus",
        language: "en",
        exclude_planets: [],
        allowed_aspects: ["Conjunction", "Opposition", "Trine", "Square"],
        aspect_line_colors: {
          Conjunction: "#558B6E",
          Opposition: "#88A09E",
          Trine: "#B88C9E",
          Square: "#704C5E",
        },
        wheel_chart_colors: {
          zodiac_sign_background_color: "#303036",
          chart_background_color: "#281109",
          zodiac_signs_text_color: "#FFFFFF",
          dotted_line_color: "#FFFAFF",
          planets_icon_color: "#FFFAFF",
        },
        orb_values: {
          Conjunction: 5,
          Opposition: 5,
          Trine: 5,
          Square: 5,
        },
      },
    };

    // Récupérer le chart SVG et les planètes en parallèle
    const [chartData, planetData] = await Promise.all([
      getChartFromAPI(payload),
      getPlanetsFromAPI(payload),
    ]);

    const imageUrl = chartData.output;
    const planets = planetData.output ?? [];

    // Traiter les données des planètes
    const simplifiedPlanets: Record<string, string> = {};
    planets.forEach((planet: any) => {
      const name = planet.planet?.en;
      const sign = planet.zodiac_sign?.name?.en;
      if (name && sign) {
        simplifiedPlanets[name] = sign;
      }
    });

    // Récupérer l'ascendant
    const ascendantEntry = planets.find(
      (p: any) => p.planet?.en === "Ascendant"
    );
    const ascendantData = ascendantEntry
      ? {
          sign: ascendantEntry.zodiac_sign?.name?.en ?? "",
        }
      : null;

    // Télécharger et convertir l'image en base64
    const imageRes = await fetch(imageUrl);
    const blob = await imageRes.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Upload vers Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("charts")
      .upload(
        `charts/${user.id}_birthchart.svg`,
        base64ToArrayBuffer(base64Data),
        {
          contentType: "image/svg+xml",
          upsert: true,
        }
      );

    if (uploadError) {
      throw new Error(`Failed to upload chart: ${uploadError.message}`);
    }

    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("charts")
      .getPublicUrl(`charts/${user.id}_birthchart.svg`);

    const chartUrl = publicUrlData?.publicUrl;

    // Mettre à jour les métadonnées utilisateur
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          birthChartUrl: chartUrl,
          planets: simplifiedPlanets,
          ascendant: ascendantData,
        },
      }
    );

    if (updateError) {
      throw new Error(`Failed to update user metadata: ${updateError.message}`);
    }

    return {
      success: true,
      chartUrl,
      planets: simplifiedPlanets,
      ascendant: ascendantData,
    };
  } catch (error: any) {
    console.error("Error in generateCompleteChart:", error);
    throw error;
  }
};
