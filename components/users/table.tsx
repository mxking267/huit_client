'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { User } from '@/types/user';

import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import UpdateUser from './update-user';
import UpdateManager from '../managers/update-manager';

const columns = [
  {
    key: 'full_name',
    label: 'Họ tên',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'actions',
    label: 'Hành động',
  },
];

interface Props {
  users: User[];
  type: 'USER' | 'MANAGER';
}

export default function UserTable({ users, type }: Props) {
  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case 'actions':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Cập nhật'>
              <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                {type === 'USER' ? (
                  <UpdateUser user={user} />
                ) : (
                  <UpdateManager manager={user} />
                )}
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label='Example table with dynamic content'>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
