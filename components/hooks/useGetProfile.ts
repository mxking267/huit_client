import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';
import fetchWithAuth from './fetchWithAuth';

const useGetMe = () => {
  const fetchUser = async (): Promise<User> => {
    const data = await fetchWithAuth('auth/profile');
    return data.user;
  };

  const {
    data: user,
    isLoading: loading,
    isError,
    error,
  } = useQuery<User, Error>({
    queryKey: ['user-me'],
    queryFn: fetchUser,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 2,
  });

  return {
    user,
    loading,
    error: isError
      ? error instanceof Error
        ? error.message
        : 'Unknown error'
      : undefined,
  };
};

export default useGetMe;
