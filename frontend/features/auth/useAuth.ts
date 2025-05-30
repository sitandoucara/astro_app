import { supabase } from 'shared/lib/supabase';
import { clearUser, setUser } from './AuthSlice';
import { AppDispatch } from 'app/store';

export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // <-- stocké dans user_metadata
    },
  });

  return { data, error };
};

export const signIn = async (email: string, password: string, dispatch: AppDispatch) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data?.session && data.user) {
    const username = data.user.user_metadata?.username ?? '';
    dispatch(
      setUser({
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          username,
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
