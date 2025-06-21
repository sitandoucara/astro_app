import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const getPlanetsFromAPI = async (input: any) => {
  const { FREE_ASTROLOGY_API_KEY } = process.env;

  if (!FREE_ASTROLOGY_API_KEY) {
    throw new Error(
      "FREE_ASTROLOGY_API_KEY is missing in environment variables."
    );
  }

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": FREE_ASTROLOGY_API_KEY,
  };

  console.log(
    "Sending payload to /western/planets:",
    JSON.stringify(input, null, 2)
  );

  const response = await axios.post(
    "https://json.freeastrologyapi.com/western/planets",
    input,
    { headers }
  );

  console.log("Planets API response:", response.data);
  return response.data;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const planets = await getPlanetsFromAPI(req.body);
    res.json(planets);
  } catch (error: any) {
    console.error("Error getting planets:", error.message);
    res.status(500).json({ error: "Failed to get planet positions" });
  }
}
