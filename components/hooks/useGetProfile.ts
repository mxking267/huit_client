import { useState, useEffect } from 'react';
import { getAccessToken } from '@/components/utils/getAccessToken';
import { User } from '@/types/user';

const useGetMe = () => {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAccessToken();

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(
          `http://127.0.0.1:8080/api/v1/auth/profile`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
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
