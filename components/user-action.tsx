'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { User } from '@nextui-org/user';
import useGetMe from './hooks/useGetProfile';
import { useAuth } from './utils/auth';

export default function UserAction() {
  const { user } = useGetMe();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <Dropdown placement='bottom-start'>
      <DropdownTrigger>
        <User
          as='button'
          avatarProps={{
            isBordered: true,
            src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          }}
          className='transition-transform'
          description={user?.email || ''}
          name={user?.full_name || ''}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label='User Actions'
        variant='flat'
      >
        <DropdownItem
          key='profile'
          className='h-14 gap-2'
        >
          <p className='font-bold'>Đăng nhập với</p>
          <p className='font-bold'>@{user?.email}</p>
        </DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          onClick={handleLogout}
        >
          Đăng xuất
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
