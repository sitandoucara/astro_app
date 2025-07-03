export const createUserFromSupabaseData = (user: any, token: string) => ({
  user: {
    id: user.id,
    email: user.email ?? '',
    username: user.user_metadata?.username ?? '',
    dateOfBirth: user.user_metadata?.dateOfBirth ?? '',
    timeOfBirth: user.user_metadata?.timeOfBirth ?? '',
    birthplace: user.user_metadata?.birthplace ?? '',
    timezoneName: user.user_metadata?.timezoneName ?? '',
    timezoneOffset: user.user_metadata?.timezoneOffset ?? 0,
    latitude: user.user_metadata?.latitude ?? null,
    longitude: user.user_metadata?.longitude ?? null,
    gender: user.user_metadata?.gender ?? '',
    birthChartUrl: user.user_metadata?.birthChartUrl ?? '',
    planets: user.user_metadata?.planets ?? null,
    ascendant: user.user_metadata?.ascendant ?? null,
  },
  token,
});
