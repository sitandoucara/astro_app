import { supabase } from 'shared/lib/supabase';
import { clearUser, setUser } from './AuthSlice';
import { AppDispatch } from 'app/store';

export const signUp = async (
  email: string,
  password: string,
  username: string,
  dateOfBirth: Date,
  timeOfBirth: Date,
  birthplace: string,
  timezoneName: string,
  timezoneOffset: number,
  latitude: number,
  longitude: number,
  gender: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        dateOfBirth: dateOfBirth.toISOString(),
        timeOfBirth: timeOfBirth.toISOString(),
        birthplace,
        timezoneName,
        timezoneOffset,
        latitude,
        longitude,
        gender,
      },
    },
  });

  console.log('📤 Signup payload:', {
    username,
    dateOfBirth: dateOfBirth.toISOString(),
    timeOfBirth: timeOfBirth.toISOString(),
    birthplace,
    timezoneName,
    timezoneOffset,
    latitude,
    longitude,
    gender,
  });

  if (error) {
    console.error('Signup error:', error);
  } else {
    console.log('Signup success:', data);
  }

  return { data, error };
};

export const signIn = async (email: string, password: string, dispatch: AppDispatch) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data?.session && data.user) {
    const metadata = data.user.user_metadata || {};

    dispatch(
      setUser({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          username: metadata.username ?? '',
          dateOfBirth: metadata.dateOfBirth,
          timeOfBirth: metadata.timeOfBirth,
          birthplace: metadata.birthplace,
          latitude: metadata.latitude,
          longitude: metadata.longitude,
          timezoneName: metadata.timezoneName,
          timezoneOffset: metadata.timezoneOffset,
          gender: metadata.gender,
          birthChartUrl: metadata.birthChartUrl,
          planets: metadata.planets,
          ascendant: metadata.ascendant,
        },
        token: data.session.access_token,
      })
    );
  }

  return { data, error };
};

export const logout = async (dispatch: AppDispatch) => {
  await supabase.auth.signOut();
  dispatch(clearUser());
};

export const deleteAccount = async (dispatch: AppDispatch) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: userError || { message: 'No user logged in' } };
    }
    const res = await fetch('https://astro-mood-store.vercel.app/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    const json = await res.json();

    if (!res.ok) {
      console.error('Delete-account failed:', json.error);
      return { error: { message: json.error || 'Delete failed' } };
    }

    await supabase.auth.signOut();
    dispatch(clearUser());
    return { data: { success: true } };
  } catch (err) {
    console.error('Unexpected error during deletion:', err);
    return { error: { message: 'Unexpected error during account deletion' } };
  }
};
