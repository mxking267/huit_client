import { useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [value, setValue] = useLocalStorage('access_token');
  const router = useRouter();

  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  }, []);

  const login = (token: string) => {
    try {
      setValue(token);
    } catch (error) {
      console.error('Invalid token', error);
    }
  };

  const logout = () => {
    setValue('');
    queryClient.invalidateQueries(['user-me']);
    router.push('/login');
  };

  const token = value;

  if (token && !isTokenExpired(token)) {
    try {
      const decoded: any = jwtDecode(token);
      return { auth: true, userRole: decoded.role, logout, login };
    } catch (error) {
      console.error('Invalid token', error);
      return { auth: false, userRole: null, logout, login };
    }
  } else {
    return { auth: false, userRole: null, logout, login };
  }
};
