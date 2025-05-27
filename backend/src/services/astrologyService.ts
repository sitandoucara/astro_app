import axios from "axios";

export const getChartFromAPI = async (input: any) => {
  const { FREE_ASTROLOGY_API_KEY, FREE_ASTROLOGY_API_URL } = process.env;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": FREE_ASTROLOGY_API_KEY || "",
  };

  const response = await axios.post(FREE_ASTROLOGY_API_URL || "", input, {
    headers,
  });
  return response.data;
};
