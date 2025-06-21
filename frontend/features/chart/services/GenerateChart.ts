type UserAstroData = {
  id: string;
  dateOfBirth: string;
  timeOfBirth: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
};

export const generateChart = async (user: UserAstroData) => {
  try {
    if (
      !user.dateOfBirth ||
      !user.timeOfBirth ||
      user.latitude == null ||
      user.longitude == null ||
      user.timezoneOffset == null
    ) {
      console.warn('Missing user data for chart generation');
      throw new Error('Missing user data for chart generation');
    }

    console.log('Generating chart for user:', user.id);

    const response = await fetch('http://localhost:4000/api/chart/generate-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate chart');
    }

    const result = await response.json();
    console.log('Chart generated successfully:', result);

    return result;
  } catch (error: any) {
    console.error('Error generating chart:', error.message);
    throw error;
  }
};
