'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGetMe from '@/components/hooks/useGetProfile';

const EventsPage = () => {
  const router = useRouter();
  const { user, loading } = useGetMe();

  useEffect(() => {
    const checkRole = async () => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      const { role } = user;

      if (role === 'ADMIN' || role === 'MANAGER') {
        router.push('/manager/events');
      } else if (role === 'USER') {
        router.push('/user/events');
      }
    };

    checkRole();
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default EventsPage;
