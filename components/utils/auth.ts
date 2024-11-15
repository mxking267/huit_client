import { useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  // Hàm kiểm tra token có hết hạn không
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // So sánh thời gian hết hạn với thời gian hiện tại
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  }, []);

  const login = (token: string) => {
    try {
      localStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Invalid token', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
  };

  const token = localStorage.getItem('access_token');

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
