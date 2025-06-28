import { AppDispatch } from 'app/store';
import { generateChart } from 'features/chart/services/generate-chart.service';
import { supabase } from 'shared/lib/supabase';

import {
  clearUser,
  setUser,
  setLoading,
  setGeneratingChart,
  updateUserMetadata,
} from './auth.slice';

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

  console.log('Signup payload:', {
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
  try {
    dispatch(setLoading(true));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch(setLoading(false));
      return { data, error };
    }

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

      if (!metadata.birthChartUrl) {
        console.log('Missing BirthChart, current generation...');
        dispatch(setGeneratingChart(true));

        const chartPayload = {
          id: data.user.id,
          dateOfBirth: metadata.dateOfBirth,
          timeOfBirth: metadata.timeOfBirth,
          latitude: metadata.latitude,
          longitude: metadata.longitude,
          timezoneOffset: metadata.timezoneOffset,
        };

        try {
          await generateChart(chartPayload);

          console.log('Chart generated, data refresh...');

          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { data: refreshedSession } = await supabase.auth.refreshSession();

          if (refreshedSession?.user) {
            const updatedMetadata = refreshedSession.user.user_metadata || {};

            dispatch(
              updateUserMetadata({
                birthChartUrl: updatedMetadata.birthChartUrl,
                planets: updatedMetadata.planets,
                ascendant: updatedMetadata.ascendant,
              })
            );
          }
        } catch (chartError: any) {
          console.error('Chart generation error:', chartError.message);
        } finally {
          dispatch(setGeneratingChart(false));
        }
      }
    }

    return { data, error };
  } catch (error: any) {
    dispatch(setLoading(false));
    return { data: null, error };
  }
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
    const res = await fetch('https://astro-app-eight-chi.vercel.app/api/delete-account', {
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

export const updateProfile = async (
  dispatch: AppDispatch,
  updates: {
    username?: string;
    email?: string;
    birthplace?: string;
    dateOfBirth?: Date;
  }
) => {
  try {
    const {
      data: { user: currentUser },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !currentUser) {
      return { error: getUserError || { message: 'No user logged in' } };
    }

    const updateData: any = {
      data: {
        ...currentUser.user_metadata,
        ...(updates.username && { username: updates.username }),
        ...(updates.birthplace && { birthplace: updates.birthplace }),
        ...(updates.dateOfBirth && { dateOfBirth: updates.dateOfBirth.toISOString() }),
      },
    };

    if (updates.email && updates.email !== currentUser.email) {
      updateData.email = updates.email;
    }

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
      console.error('Update profile error:', error);
      return { error };
    }

    if (data.user) {
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
          token: currentUser.app_metadata?.token || '',
        })
      );
    }

    return { data };
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return { error: { message: 'Unexpected error updating profile' } };
  }
};
