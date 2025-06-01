import axios from "axios";

export const getChartFromAPI = async (input: any) => {
  const { FREE_ASTROLOGY_API_KEY, FREE_ASTROLOGY_API_URL } = process.env;

  if (!FREE_ASTROLOGY_API_URL) {
    throw new Error(
      "FREE_ASTROLOGY_API_URL is missing in environment variables."
    );
  }

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
    "Sending payload to Astrology API:",
    JSON.stringify(input, null, 2)
  );
  const response = await axios.post(FREE_ASTROLOGY_API_URL, input, { headers });
  console.log("Astrology API response:", response.data);

  return response.data;
};

export const getPlanetsFromAPI = async (input: any) => {
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
