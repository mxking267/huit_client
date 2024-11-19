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
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';

const columns = [
  {
    key: 'student_code',
    label: 'MSSV',
  },
  {
    key: 'full_name',
    label: 'Họ tên',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'class',
    label: 'Lớp',
  },
  {
    key: 'actions',
    label: 'Hành động',
  },
];

interface Props {
  users: User[];
  onAddToList: (user: User) => void; // Callback để xử lý thêm user vào danh sách
}

export default function StudentTable({ users, onAddToList }: Props) {
  const renderCell = React.useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
        case 'actions':
          return (
            <div className='relative flex items-center gap-2'>
              <Tooltip content='Thêm vào danh sách'>
                <Button
                  color='primary'
                  size='sm'
                  onPress={() => onAddToList(user)}
                >
                  Thêm
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onAddToList]
  );

  return (
    <Table aria-label='Bảng danh sách sinh viên'>
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
