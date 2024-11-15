import { useAuth } from '@/components/utils/auth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { ERole } from '@/types/user';

export default function isAuth(Component: any, requiredRole?: ERole | ERole[]) {
  return function IsAuth(props: any) {
    const { userRole } = useAuth();

    useEffect(() => {
      if (!userRole) {
        redirect('/login');
      } else if (
        requiredRole &&
        !(
          (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
          userRole === requiredRole
        )
      ) {
        redirect('/unauthorized');
      }
    }, [userRole]);

    if (
      !userRole ||
      (requiredRole &&
        !(
          (Array.isArray(requiredRole) && requiredRole.includes(userRole)) ||
          userRole === requiredRole
        ))
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}
