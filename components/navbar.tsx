'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons';
import UserAction from './user-action';
import { siteConfig } from './siteConfig';
import useGetMe from './hooks/useGetProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ERole } from '@/types/user';

type SideBarType = { href: string; label: string; roles: ERole[] };

export const Navbar = () => {
  const { user, loading } = useGetMe();
  const [items, setItems] = useState<SideBarType[]>([]);
  const router = useRouter();
  if (!user && !loading) router.push('/login');
  const filteredNavItems = user?.role
    ? siteConfig.navItems.filter((item) => item.roles.includes(user.role))
    : [];
  useEffect(() => {
    const filteredNavItems = user?.role
      ? siteConfig.navItems.filter((item) => item.roles.includes(user.role))
      : [];

    setItems(filteredNavItems);
  }, [user]);

  return (
    <div className='flex gap-4'>
      <NextUINavbar
        maxWidth='xl'
        position='sticky'
      >
        <NavbarContent
          className='basis-1/5 sm:basis-full'
          justify='start'
        >
          <NavbarBrand
            as='li'
            className='gap-3 max-w-fit'
          >
            <NextLink
              className='flex justify-start items-center gap-1'
              href='/'
            >
              <Logo />
              <p className='font-bold text-inherit'>ACME</p>
            </NextLink>
          </NavbarBrand>
          <ul className='hidden lg:flex gap-4 justify-start ml-2'>
            {filteredNavItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  href={item.href}
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                  )}
                  color='foreground'
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className='hidden sm:flex basis-1/5 sm:basis-full'
          justify='end'
        >
          <NavbarItem className='hidden sm:flex gap-2'>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          className='sm:hidden basis-1 pl-4'
          justify='end'
        >
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        <UserAction />
      </NextUINavbar>
    </div>
  );
};
