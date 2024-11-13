import { ERole } from '@/types/user';

export const siteConfig = {
  navItems: [
    { href: '/', label: 'Home', roles: [ERole.USER] },
    { href: '/user/events', label: 'Events', roles: [ERole.USER] },
    {
      href: '/events-registered',
      label: 'Events registered',
      roles: [ERole.USER],
    },
    { href: '/training-points', label: 'Training points', roles: [ERole.USER] },
    { href: '/admin/events', label: 'Events', roles: [ERole.ADMIN] },
    { href: '/manager/events', label: 'Events', roles: [ERole.MANAGER] },
    { href: '/users', label: 'Users', roles: [ERole.ADMIN] },
    { href: '/locations', label: 'Locations', roles: [ERole.ADMIN] },
    { href: '/courses', label: 'Courses', roles: [ERole.ADMIN] },
    { href: '/faculties', label: 'Faculties', roles: [ERole.ADMIN] },
  ],
};
