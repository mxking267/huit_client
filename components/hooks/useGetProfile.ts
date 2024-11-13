import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import fetchWithAuth from './fetchWithAuth';

const useGetMe = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchWithAuth('auth/profile');

        setUser(data.user);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useGetMe;
