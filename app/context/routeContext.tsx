import useGetMe from '@/components/hooks/useGetProfile';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Skeleton } from '@nextui-org/skeleton';
import { ERole } from '@/types/user';

const PrivateRouteContext = ({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: ERole[];
}) => {
  const { error, loading, user } = useGetMe();
  const router = useRouter();

  if (loading)
    return (
      <Skeleton className='rounded-lg'>
        <div className='h-24 rounded-lg bg-default-300' />
      </Skeleton>
    );
  if (!user || error) {
    router.push('/login');
  }

  const isAllow =
    roles && roles.length > 0
      ? roles.some((role) => user?.role === role)
      : true;

  if (!isAllow) router.push('/forbidden');

  return isAllow ? children : null;
};

export default PrivateRouteContext;
