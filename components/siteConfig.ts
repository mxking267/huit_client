import { ERole } from '@/types/user';

export const siteConfig = {
  navItems: [
    { href: '/user/events', label: 'Sự kiện', roles: [ERole.USER] },
    {
      href: '/events-registered',
      label: 'Sự kiện đã đăng ký',
      roles: [ERole.USER],
    },
    {
      href: '/training-points',
      label: 'Lịch sử cộng điểm',
      roles: [ERole.USER],
    },
    {
      href: '/manager/events',
      label: 'Sự kiện',
      roles: [ERole.MANAGER, ERole.ADMIN],
    },
    { href: '/users', label: 'Người dùng', roles: [ERole.ADMIN] },
    { href: '/locations', label: 'Địa điểm', roles: [ERole.ADMIN] },
    { href: '/courses', label: 'Khoá', roles: [ERole.ADMIN] },
    { href: '/faculties', label: 'Khoa', roles: [ERole.ADMIN] },
  ],
};
