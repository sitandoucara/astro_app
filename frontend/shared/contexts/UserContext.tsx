import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type UserContextType = {
  username: string | null;
  email: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();

        if (userProfile) {
          setUsername(userProfile.username);
          setEmail(user.email ?? null);
        } else {
          console.error('Erreur profil user :', userError);
        }
      } else {
        console.error('Erreur user auth :', error);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erreur logout :', error.message);
      return;
    }
    setUsername(null);
    setEmail(null);
  };

  return (
    <UserContext.Provider value={{ username, email, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
