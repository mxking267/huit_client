'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGetMe from '@/components/hooks/useGetProfile';

const EventsPage = () => {
  const router = useRouter();
  const { user, loading } = useGetMe();

  useEffect(() => {
    const checkRole = async () => {
      if (loading) return; // Nếu đang tải hoặc có lỗi thì không làm gì

      if (!user) {
        router.push('/login'); // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
        return;
      }

      const { role } = user;

      if (role === 'ADMIN') {
        router.push('/admin/events');
      } else if (role === 'MANAGER') {
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
