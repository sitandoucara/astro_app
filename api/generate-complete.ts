import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { AuthenticatedRequest, requireAuth } from "./middleware/auth";

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

const getChartFromAPI = async (input: any) => {
  const { FREE_ASTROLOGY_API_KEY, FREE_ASTROLOGY_API_URL } = process.env;

  if (!FREE_ASTROLOGY_API_URL || !FREE_ASTROLOGY_API_KEY) {
    throw new Error(
      "FREE_ASTROLOGY_API_URL and FREE_ASTROLOGY_API_KEY are required"
    );
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": FREE_ASTROLOGY_API_KEY,
  };

  const response = await axios.post(FREE_ASTROLOGY_API_URL, input, { headers });
  return response.data;
};

const getPlanetsFromAPI = async (input: any) => {
  const { FREE_ASTROLOGY_API_KEY } = process.env;

  if (!FREE_ASTROLOGY_API_KEY) {
    throw new Error("FREE_ASTROLOGY_API_KEY is required");
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": FREE_ASTROLOGY_API_KEY,
  };

  const response = await axios.post(
    "https://json.freeastrologyapi.com/western/planets",
    input,
    { headers }
  );

  return response.data;
};

const generateCompleteChart = async (user: any) => {
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

    console.log("Fetching chart data from astrology API...");

    const [chartData, planetData] = await Promise.all([
      getChartFromAPI(payload),
      getPlanetsFromAPI(payload),
    ]);

    const imageUrl = chartData.output;
    const planets = planetData.output ?? [];

    console.log("Astrology data received, processing planets...");

    const simplifiedPlanets: Record<string, string> = {};
    planets.forEach((planet: any) => {
      const name = planet.planet?.en;
      const sign = planet.zodiac_sign?.name?.en;
      if (name && sign) {
        simplifiedPlanets[name] = sign;
      }
    });

    const ascendantEntry = planets.find(
      (p: any) => p.planet?.en === "Ascendant"
    );
    const ascendantData = ascendantEntry
      ? {
          sign: ascendantEntry.zodiac_sign?.name?.en ?? "",
        }
      : null;

    console.log("Downloading chart image...");

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to download chart image: ${imageRes.statusText}`);
    }

    const imageBuffer = await imageRes.arrayBuffer();
    console.log(`Image downloaded, size: ${imageBuffer.byteLength} bytes`);

    const fileName = `charts/${user.id}_birthchart.svg`;

    console.log("Uploading to Supabase storage...");

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("charts")
      .upload(fileName, imageBuffer, {
        contentType: "image/svg+xml",
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new Error(`Failed to upload chart: ${uploadError.message}`);
    }

    console.log("Upload successful:", uploadData);

    const { data: publicUrlData } = supabase.storage
      .from("charts")
      .getPublicUrl(fileName);

    const chartUrl = publicUrlData?.publicUrl;
    console.log("Public URL generated:", chartUrl);

    console.log("Updating user metadata...");

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
      console.error("User metadata update error:", updateError);
      throw new Error(`Failed to update user metadata: ${updateError.message}`);
    }

    console.log("User metadata updated successfully");

    return {
      success: true,
      chartUrl,
      planets: simplifiedPlanets,
      ascendant: ascendantData,
      uploadPath: uploadData?.path,
    };
  } catch (error: any) {
    console.error("Error in generateCompleteChart:", error);
    throw error;
  }
};

const generateChartHandler = async (
  req: AuthenticatedRequest,
  res: VercelResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const userAstroData = req.body;
    const authenticatedUserId = req.user?.id;

    const requiredFields = [
      "id",
      "dateOfBirth",
      "timeOfBirth",
      "latitude",
      "longitude",
      "timezoneOffset",
    ];
    const missingFields = requiredFields.filter(
      (field) => !userAstroData[field] && userAstroData[field] !== 0
    );

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }

    // A user can only generate his own chart
    if (userAstroData.id !== authenticatedUserId) {
      res.status(403).json({
        error: "Forbidden",
        message: "You can only generate your own chart",
      });
      return;
    }

    console.log("Generating complete chart for user:", userAstroData.id);

    const result = await generateCompleteChart(userAstroData);

    res.json({
      success: true,
      message: "Chart generated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error generating complete chart:", error.message);
    res.status(500).json({
      error: "Failed to generate complete chart",
      details: error.message,
    });
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Apply authentication
  return requireAuth(generateChartHandler)(req as AuthenticatedRequest, res);
}
