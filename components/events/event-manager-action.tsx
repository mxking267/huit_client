import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

interface Props {
  eventId: string;
}

export default function EventManagerAction({ eventId }: Props) {
  const items = [
    {
      key: 'attendance',
      label: 'Điểm danh',
      link: '/attendance',
    },
    {
      key: 'detail',
      label: 'Chi tiết',
      link: '/manager/events/detail',
    },
    {
      key: 'edit',
      label: 'Sửa',
      link: '/manager/events/update',
    },
    {
      key: 'list',
      label: 'Xem danh sách',
      link: '/manager/events/list-participant',
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant='solid'
          color='primary'
        >
          Open Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Dynamic Actions'
        items={items}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === 'delete' ? 'danger' : 'default'}
            className={item.key === 'delete' ? 'text-danger' : ''}
          >
            <Link
              className='block w-full'
              href={`${item.link}/${eventId}`}
            >
              {item.label}
            </Link>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
